import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { sendOrderConfirmationEmail } from "@/lib/email";

export async function POST(request: NextRequest) {
  const signature = request.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    return NextResponse.json({ error: "Webhook não configurado." }, { status: 400 });
  }

  const rawBody = await request.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    console.error("Assinatura do webhook Stripe inválida:", err);
    return NextResponse.json({ error: "Assinatura inválida." }, { status: 400 });
  }

  switch (event.type) {
    case "payment_intent.succeeded": {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      await handlePaymentSucceeded(paymentIntent);
      break;
    }
    case "payment_intent.payment_failed": {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      await prisma.payment
        .update({
          where: { stripePaymentIntentId: paymentIntent.id },
          data: { status: paymentIntent.status },
        })
        .catch(() => null);
      break;
    }
    case "payment_intent.processing":
    case "payment_intent.requires_action": {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      await syncMultibancoDetails(paymentIntent);
      await prisma.payment
        .update({
          where: { stripePaymentIntentId: paymentIntent.id },
          data: { status: paymentIntent.status },
        })
        .catch(() => null);
      break;
    }
    default:
      break;
  }

  return NextResponse.json({ received: true });
}

async function syncMultibancoDetails(paymentIntent: Stripe.PaymentIntent) {
  const details = paymentIntent.next_action?.multibanco_display_details;
  if (!details) return;

  await prisma.payment
    .update({
      where: { stripePaymentIntentId: paymentIntent.id },
      data: {
        multibancoEntity: details.entity ?? undefined,
        multibancoReference: details.reference ?? undefined,
        multibancoExpiresAt: details.expires_at
          ? new Date(details.expires_at * 1000)
          : undefined,
      },
    })
    .catch(() => null);
}

async function handlePaymentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  const payment = await prisma.payment.findUnique({
    where: { stripePaymentIntentId: paymentIntent.id },
    include: { order: { include: { items: true, address: true } } },
  });

  if (!payment) return;
  if (payment.order.status === "PAGO") return; // idempotência: evita reprocessar

  await prisma.$transaction([
    prisma.payment.update({
      where: { id: payment.id },
      data: { status: paymentIntent.status },
    }),
    prisma.order.update({
      where: { id: payment.orderId },
      data: { status: "PAGO" },
    }),
    ...payment.order.items
      .filter((item) => item.productId)
      .map((item) =>
        prisma.product.update({
          where: { id: item.productId! },
          data: { stock: { decrement: item.quantity } },
        })
      ),
  ]);

  await sendOrderConfirmationEmail(payment.order.id).catch((err) =>
    console.error("Falha ao enviar email de confirmação:", err)
  );
}
