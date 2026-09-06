import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

const paymentSchema = z.object({
  orderId: z.string(),
  paymentMethod: z.enum(["CARTAO", "MULTIBANCO", "MBWAY"]),
});

const PAYMENT_METHOD_TYPES: Record<string, string[]> = {
  CARTAO: ["card"],
  MULTIBANCO: ["multibanco"],
  MBWAY: ["mb_way"],
};

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = paymentSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Dados inválidos.", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { orderId, paymentMethod } = parsed.data;

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { payment: true, items: true },
  });

  if (!order) {
    return NextResponse.json(
      { error: "Pedido não encontrado. Recarrega a página e tenta novamente." },
      { status: 404 }
    );
  }

  if (order.payment) {
    return NextResponse.json(
      { error: "Este pedido já tem um pagamento em curso." },
      { status: 400 }
    );
  }

  // Nunca confiar em stock/preços já calculados no passo anterior — o carrinho
  // pode ter mudado entretanto (ex: outro cliente esgotou o stock).
  const productIds = order.items.map((i) => i.productId).filter((id): id is string => !!id);
  const products = await prisma.product.findMany({ where: { id: { in: productIds } } });
  const stockError = order.items.find((item) => {
    if (!item.productId) return false;
    const product = products.find((p) => p.id === item.productId);
    return !product || !product.active || product.stock < item.quantity;
  });
  if (stockError) {
    return NextResponse.json(
      { error: `"${stockError.productName}" deixou de estar disponível ou não há stock suficiente.` },
      { status: 400 }
    );
  }

  const paymentMethodTypes = PAYMENT_METHOD_TYPES[paymentMethod];

  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(Number(order.total) * 100),
    currency: "eur",
    payment_method_types: paymentMethodTypes,
    receipt_email: order.guestEmail,
    metadata: {
      orderId: order.id,
    },
  });

  await prisma.order.update({
    where: { id: order.id },
    data: { paymentMethod, status: "PENDENTE" },
  });

  await prisma.payment.create({
    data: {
      orderId: order.id,
      stripePaymentIntentId: paymentIntent.id,
      status: paymentIntent.status,
      method: paymentMethod,
      amount: order.total,
    },
  });

  return NextResponse.json({
    orderId: order.id,
    clientSecret: paymentIntent.client_secret,
  });
}
