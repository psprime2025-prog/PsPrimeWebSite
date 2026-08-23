import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const staticRoutes = [
    "",
    "/catalogo",
    "/sobre",
    "/contactos",
    "/faq",
    "/legal/termos",
    "/legal/privacidade",
    "/legal/devolucoes",
    "/legal/cookies",
  ].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
  }));

  const products = await prisma.product.findMany({
    where: { active: true },
    select: { slug: true, updatedAt: true },
  });

  const productRoutes = products.map((p) => ({
    url: `${baseUrl}/produto/${p.slug}`,
    lastModified: p.updatedAt,
  }));

  return [...staticRoutes, ...productRoutes];
}
