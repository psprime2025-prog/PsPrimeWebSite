import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { formatPrice, CONDITION_LABELS, GENERATION_LABELS } from "@/lib/format";
import { AddToCartForm } from "@/components/AddToCartForm";
import { ProductCard } from "@/components/ProductCard";

export const dynamic = "force-dynamic";

async function getProduct(slug: string) {
  return prisma.product.findUnique({
    where: { slug, active: true },
    include: { images: { orderBy: { order: "asc" } }, category: true },
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return {};
  return {
    title: product.name,
    description: product.description.slice(0, 155),
    openGraph: {
      title: product.name,
      description: product.description.slice(0, 155),
      images: product.images[0] ? [product.images[0].url] : [],
    },
  };
}

export default async function ProdutoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  const related = await prisma.product.findMany({
    where: { active: true, categoryId: product.categoryId, id: { not: product.id } },
    include: { images: { orderBy: { order: "asc" }, take: 1 } },
    take: 4,
  });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images.map((i) => i.url),
    sku: product.id,
    offers: {
      "@type": "Offer",
      priceCurrency: "EUR",
      price: product.price.toString(),
      availability:
        product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      url: `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/produto/${product.slug}`,
    },
    itemCondition: "https://schema.org/UsedCondition",
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <nav className="mb-6 text-sm text-text-muted">
        <Link href="/catalogo" className="hover:text-text">
          Catálogo
        </Link>{" "}
        / <span className="text-text">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="card relative aspect-square overflow-hidden">
            {product.images[0] ? (
              <Image
                src={product.images[0].url}
                alt={product.images[0].alt || product.name}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-contain p-6"
                priority
              />
            ) : (
              <div className="flex h-full items-center justify-center text-text-muted">
                Sem imagem
              </div>
            )}
          </div>
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-3">
              {product.images.slice(1).map((img) => (
                <div key={img.id} className="card relative aspect-square overflow-hidden">
                  <Image src={img.url} alt={img.alt || product.name} fill className="object-contain p-2" />
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <div className="flex flex-wrap gap-2">
            <span className="badge-condition">{GENERATION_LABELS[product.psGeneration]}</span>
            <span className="badge-condition">{product.category.name}</span>
            <span className="badge-condition border-success/40 text-success">
              {CONDITION_LABELS[product.condition]}
            </span>
          </div>
          <h1 className="mt-4 text-3xl font-bold">{product.name}</h1>
          <p className="mt-3 text-3xl font-bold text-primary-light">{formatPrice(product.price)}</p>

          <p className="mt-2 text-sm text-text-muted">
            Produto seminovo, testado e recondicionado pela nossa equipa.
          </p>

          <div className="mt-6">
            <AddToCartForm
              productId={product.id}
              name={product.name}
              slug={product.slug}
              price={Number(product.price)}
              image={product.images[0]?.url ?? null}
              condition={product.condition}
              stock={product.stock}
            />
          </div>

          <div className="mt-8 border-t border-border pt-6">
            <h2 className="mb-2 text-sm font-semibold">Descrição</h2>
            <p className="whitespace-pre-line text-sm text-text-muted">{product.description}</p>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-6 text-xl font-bold">Produtos relacionados</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={{ ...p, price: p.price.toString() }} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
