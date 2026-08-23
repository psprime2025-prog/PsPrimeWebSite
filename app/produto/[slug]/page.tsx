import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import {
  formatPrice,
  CONDITION_LABELS,
  CONDITION_DESCRIPTIONS,
  GENERATION_LABELS,
  STORAGE_LABELS,
} from "@/lib/format";
import { FAQS } from "@/lib/faq";
import { AddToCartForm } from "@/components/AddToCartForm";
import { ProductCard } from "@/components/ProductCard";
import { ProductGallery } from "@/components/ProductGallery";
import { MobileExpandable } from "@/components/ui/MobileExpandable";
import {
  CheckIcon,
  ShieldIcon,
  SupportIcon,
  TruckIcon,
  PackageIcon,
  PinIcon,
  ClockIcon,
  StarIcon,
  UndoIcon,
} from "@/components/icons/InfoIcons";

export const dynamic = "force-dynamic";

const PRODUCT_FAQ_QUESTIONS = [
  "Como sei o estado de conservação de um produto?",
  "Quais os métodos de pagamento disponíveis?",
  "Quais são os custos de envio?",
  "Posso devolver um produto?",
  "Os produtos têm garantia?",
];

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

function SectionCard({
  title,
  children,
  mobileSummary,
  mobileExpandLabel,
}: {
  title: string;
  children: React.ReactNode;
  mobileSummary?: string;
  mobileExpandLabel?: string;
}) {
  if (mobileSummary && mobileExpandLabel) {
    return (
      <section className="card p-5">
        <MobileExpandable title={title} summary={mobileSummary} expandLabel={mobileExpandLabel}>
          {children}
        </MobileExpandable>
      </section>
    );
  }

  return (
    <section className="card p-5">
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-text-muted">{title}</h2>
      {children}
    </section>
  );
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

  const inStock = product.stock > 0;
  const productFaqs = FAQS.filter((f) => PRODUCT_FAQ_QUESTIONS.includes(f.q));

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
      availability: inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
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
        <div className="lg:sticky lg:top-24 lg:self-start">
          <ProductGallery
            images={product.images.map((img) => ({ id: img.id, url: img.url, alt: img.alt }))}
            productName={product.name}
          />
        </div>

        <div className="space-y-6">
          <div>
            <div className="flex flex-wrap gap-2">
              <span className="badge-condition">{GENERATION_LABELS[product.psGeneration]}</span>
              {product.model && <span className="badge-condition">{product.model}</span>}
              {product.storageCapacity && (
                <span className="badge-condition">{STORAGE_LABELS[product.storageCapacity]}</span>
              )}
              <span className="badge-condition">{product.category.name}</span>
            </div>
            <h1 className="mt-4 text-3xl font-bold">{product.name}</h1>
          </div>

          <div className="flex items-center gap-1.5 text-sm font-medium text-text">
            <StarIcon className="h-4 w-4 shrink-0 text-primary-light" />
            {CONDITION_LABELS[product.condition]}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <p className="text-3xl font-bold text-primary-light">{formatPrice(product.price)}</p>
            <span
              className={
                inStock
                  ? "badge-condition border-success/40 text-success"
                  : "badge-condition text-text-muted"
              }
            >
              {inStock ? "Em stock" : "Esgotado"}
            </span>
          </div>

          <ul className="flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-text-muted">
            <li className="flex items-center gap-1.5">
              <TruckIcon className="h-4 w-4 shrink-0 text-primary-light" />
              Envio 24–48h
            </li>
            <li className="flex items-center gap-1.5">
              <ShieldIcon className="h-4 w-4 shrink-0 text-primary-light" />
              Garantia legal
            </li>
          </ul>

          <p className="flex items-center gap-1.5 text-xs text-text-muted">
            <UndoIcon className="h-3.5 w-3.5 shrink-0" />
            14 dias para devolução —{" "}
            <Link href="/legal/devolucoes" className="text-primary-light hover:underline">
              Consulta as condições
            </Link>
            {"."}
          </p>

          <AddToCartForm
            productId={product.id}
            name={product.name}
            slug={product.slug}
            price={Number(product.price)}
            image={product.images[0]?.url ?? null}
            condition={product.condition}
            stock={product.stock}
          />

          <div className="space-y-6 border-t border-border pt-6">
            <div>
              <h2 className="mb-2 text-sm font-semibold">Descrição</h2>
              <p className="whitespace-pre-line text-sm text-text-muted">{product.description}</p>
            </div>

            {product.includedItems.length > 0 && (
              <SectionCard
                title="O que recebes"
                mobileSummary={`${product.includedItems.length} itens incluídos na compra.`}
                mobileExpandLabel="Ver o que recebes"
              >
                <ul className="space-y-2">
                  {product.includedItems.map((item) => (
                    <li key={item} className="flex items-center gap-2.5 text-sm">
                      <CheckIcon className="h-4 w-4 shrink-0 text-success" />
                      {item}
                    </li>
                  ))}
                </ul>
              </SectionCard>
            )}

            <SectionCard title="Estado do produto">
              <div className="flex items-start gap-3">
                <span className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-success" />
                <div>
                  <p className="font-semibold text-success">{CONDITION_LABELS[product.condition]}</p>
                  <p className="mt-0.5 text-sm text-text-muted">
                    {CONDITION_DESCRIPTIONS[product.condition]}
                  </p>
                </div>
              </div>
            </SectionCard>

            {product.testedChecks.length > 0 && (
              <SectionCard
                title="Testes realizados"
                mobileSummary="Testamos cada consola antes de enviar."
                mobileExpandLabel={`Ver os ${product.testedChecks.length} testes`}
              >
                <ul className="grid grid-cols-2 gap-2.5">
                  {product.testedChecks.map((item) => (
                    <li key={item} className="flex items-center gap-2.5 text-sm">
                      <CheckIcon className="h-4 w-4 shrink-0 text-success" />
                      {item}
                    </li>
                  ))}
                </ul>
              </SectionCard>
            )}

            <SectionCard
              title="Envio"
              mobileSummary="Portugal, seguro e rastreável, em 24–48h."
              mobileExpandLabel="Ver detalhes do envio"
            >
              <ul className="grid grid-cols-2 gap-2.5">
                <li className="flex items-center gap-2.5 text-sm">
                  <TruckIcon className="h-4 w-4 shrink-0 text-primary-light" />
                  Portugal
                </li>
                <li className="flex items-center gap-2.5 text-sm">
                  <PackageIcon className="h-4 w-4 shrink-0 text-primary-light" />
                  Seguro
                </li>
                <li className="flex items-center gap-2.5 text-sm">
                  <PinIcon className="h-4 w-4 shrink-0 text-primary-light" />
                  Rastreável
                </li>
                <li className="flex items-center gap-2.5 text-sm">
                  <ClockIcon className="h-4 w-4 shrink-0 text-primary-light" />
                  24–48h
                </li>
              </ul>
            </SectionCard>

            <SectionCard title="Garantia">
              <ul className="space-y-2.5">
                <li className="flex items-center gap-2.5 text-sm">
                  <ShieldIcon className="h-4 w-4 shrink-0 text-primary-light" />
                  Garantia legal
                </li>
                <li className="flex items-center gap-2.5 text-sm">
                  <SupportIcon className="h-4 w-4 shrink-0 text-primary-light" />
                  Assistência PsPrime
                </li>
              </ul>
            </SectionCard>

            {productFaqs.length > 0 && (
              <SectionCard title="Perguntas frequentes">
                <div className="divide-y divide-border">
                  {productFaqs.map((item) => (
                    <details key={item.q} className="group py-3 first:pt-0 last:pb-0">
                      <summary className="cursor-pointer list-none text-sm font-medium marker:content-none">
                        {item.q}
                      </summary>
                      <p className="mt-2 text-sm text-text-muted">{item.a}</p>
                    </details>
                  ))}
                </div>
                <Link href="/faq" className="mt-3 inline-block text-sm text-primary-light hover:underline">
                  Ver todas as perguntas →
                </Link>
              </SectionCard>
            )}
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-6 text-xl font-bold">Produtos semelhantes</h2>
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
