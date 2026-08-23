import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/format";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q")?.trim();
  if (!q || q.length < 2) {
    return NextResponse.json({ results: [] });
  }

  const products = await prisma.product.findMany({
    where: { active: true, name: { contains: q, mode: "insensitive" } },
    include: { images: { orderBy: { order: "asc" }, take: 1 } },
    take: 8,
  });

  return NextResponse.json({
    results: products.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      price: formatPrice(p.price),
      image: p.images[0]?.url ?? null,
    })),
  });
}
