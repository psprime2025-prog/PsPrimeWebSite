import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { calculateShippingCost } from "@/lib/constants";

const leadSchema = z.object({
  orderId: z.string().optional(),
  guestName: z.string().min(2, "Nome demasiado curto"),
  guestEmail: z.string().email("Email inválido"),
  guestPhone: z.string().min(9, "Número de telefone inválido"),
  street: z.string().min(3, "Morada inválida"),
  postalCode: z.string().min(4, "Código postal inválido"),
  city: z.string().min(2, "Cidade inválida"),
  items: z
    .array(
      z.object({
        productId: z.string(),
        quantity: z.number().int().positive(),
      })
    )
    .min(1, "O carrinho está vazio"),
});

/**
 * Regista os dados pessoais do checkout assim que o cliente termina o passo 1
 * ("Continuar para pagamento"), antes de escolher método de pagamento ou de
 * tentar pagar — para não perder o contacto (lead) de quem desiste a meio.
 * O pedido fica com status LEAD e um paymentMethod placeholder até ao passo
 * de pagamento em /api/checkout, que o substitui pelo escolhido a sério.
 */
export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = leadSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Dados inválidos.", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const data = parsed.data;

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

  // Se o cliente já tinha submetido este passo antes (voltou atrás e corrigiu
  // algo), atualiza o mesmo lead em vez de criar um pedido duplicado — só
  // quando ainda não avançou para o pagamento.
  const existing = data.orderId
    ? await prisma.order.findUnique({ where: { id: data.orderId } })
    : null;

  if (existing && existing.status === "LEAD") {
    await prisma.orderItem.deleteMany({ where: { orderId: existing.id } });
    await prisma.order.update({
      where: { id: existing.id },
      data: {
        guestName: data.guestName,
        guestEmail: data.guestEmail,
        guestPhone: data.guestPhone,
        subtotal,
        shippingCost,
        total,
        items: { create: orderItemsData },
        address: {
          update: { street: data.street, postalCode: data.postalCode, city: data.city },
        },
      },
    });
    return NextResponse.json({ orderId: existing.id });
  }

  const order = await prisma.order.create({
    data: {
      guestName: data.guestName,
      guestEmail: data.guestEmail,
      guestPhone: data.guestPhone,
      status: "LEAD",
      paymentMethod: "CARTAO", // placeholder — o cliente ainda não escolheu; substituído no passo de pagamento
      subtotal,
      shippingCost,
      total,
      items: { create: orderItemsData },
      address: {
        create: { street: data.street, postalCode: data.postalCode, city: data.city },
      },
    },
  });

  return NextResponse.json({ orderId: order.id });
}
