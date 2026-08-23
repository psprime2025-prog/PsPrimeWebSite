import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { calculateShippingCost } from "@/lib/constants";

const checkoutSchema = z.object({
  guestName: z.string().min(2, "Nome demasiado curto"),
  guestEmail: z.string().email("Email inválido"),
  guestPhone: z.string().min(9, "Número de telefone inválido"),
  street: z.string().min(3, "Morada inválida"),
  postalCode: z.string().min(4, "Código postal inválido"),
  city: z.string().min(2, "Cidade inválida"),
  paymentMethod: z.enum(["CARTAO", "MULTIBANCO", "MBWAY"]),
  items: z
    .array(
      z.object({
        productId: z.string(),
        quantity: z.number().int().positive(),
      })
    )
    .min(1, "O carrinho está vazio"),
});

const PAYMENT_METHOD_TYPES: Record<string, string[]> = {
  CARTAO: ["card"],
  MULTIBANCO: ["multibanco"],
  MBWAY: ["mb_way"],
};

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = checkoutSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Dados inválidos.", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const data = parsed.data;

  // Nunca confiar em preços vindos do cliente — recalcular sempre a partir da base de dados.
  const productIds = data.items.map((i) => i.productId);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds }, active: true },
  });

  if (products.length !== productIds.length) {
    return NextResponse.json(
      { error: "Um ou mais produtos deixaram de estar disponíveis." },
      { status: 400 }
    );
  }

  const stockError = data.items.find((item) => {
    const product = products.find((p) => p.id === item.productId)!;
    return product.stock < item.quantity;
  });
  if (stockError) {
    const product = products.find((p) => p.id === stockError.productId)!;
    return NextResponse.json(
      { error: `Stock insuficiente para "${product.name}".` },
      { status: 400 }
    );
  }

  const orderItemsData = data.items.map((item) => {
    const product = products.find((p) => p.id === item.productId)!;
    const unitPrice = Number(product.price);
    return {
      productId: product.id,
      productName: product.name,
      unitPrice,
      quantity: item.quantity,
      subtotal: unitPrice * item.quantity,
    };
  });

  const subtotal = orderItemsData.reduce((sum, i) => sum + i.subtotal, 0);
  const shippingCost = calculateShippingCost(subtotal);
  const total = subtotal + shippingCost;

  const order = await prisma.order.create({
    data: {
      guestName: data.guestName,
      guestEmail: data.guestEmail,
      guestPhone: data.guestPhone,
      paymentMethod: data.paymentMethod,
      subtotal,
      shippingCost,
      total,
      items: { create: orderItemsData },
      address: {
        create: {
          street: data.street,
          postalCode: data.postalCode,
          city: data.city,
        },
      },
    },
  });

  const paymentMethodTypes = PAYMENT_METHOD_TYPES[data.paymentMethod];

  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(total * 100),
    currency: "eur",
    payment_method_types: paymentMethodTypes,
    receipt_email: data.guestEmail,
    metadata: {
      orderId: order.id,
    },
  });

  await prisma.payment.create({
    data: {
      orderId: order.id,
      stripePaymentIntentId: paymentIntent.id,
      status: paymentIntent.status,
      method: data.paymentMethod,
      amount: total,
    },
  });

  return NextResponse.json({
    orderId: order.id,
    clientSecret: paymentIntent.client_secret,
  });
}
