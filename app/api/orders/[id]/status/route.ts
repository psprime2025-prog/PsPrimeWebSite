import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
    select: {
      id: true,
      status: true,
      paymentMethod: true,
      total: true,
      payment: {
        select: {
          status: true,
          multibancoEntity: true,
          multibancoReference: true,
          multibancoExpiresAt: true,
        },
      },
    },
  });

  if (!order) {
    return NextResponse.json({ error: "Encomenda não encontrada." }, { status: 404 });
  }

  return NextResponse.json({
    status: order.status,
    paymentMethod: order.paymentMethod,
    total: order.total.toString(),
    payment: order.payment,
  });
}
