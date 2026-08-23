import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/ProductCard";
import { CATEGORIES_SEED } from "@/lib/constants";

export const dynamic = "force-dynamic";

async function getFeaturedProducts() {
  return prisma.product.findMany({
    where: { active: true, featured: true },
    include: { images: { orderBy: { order: "asc" }, take: 1 } },
    orderBy: { createdAt: "desc" },
    take: 8,
  });
}

async function getLatestProducts() {
  return prisma.product.findMany({
    where: { active: true },
    include: { images: { orderBy: { order: "asc" }, take: 1 } },
    orderBy: { createdAt: "desc" },
    take: 8,
  });
}

export default async function HomePage() {
  const [featured, latest] = await Promise.all([getFeaturedProducts(), getLatestProducts()]);
  const highlighted = featured.length > 0 ? featured : latest;

  return (
    <div>
      <section className="border-b border-border bg-surface">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-8 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <span className="badge-condition mb-4 inline-flex items-center gap-1.5 border-success/40 text-success">
              Produtos seminovos testados
            </span>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              O teu mundo PlayStation, <span className="text-primary-light">seminovo</span> e de
              confiança.
            </h1>
            <p className="mt-4 max-w-lg text-text-muted">
              Consolas, comandos, jogos e acessórios de todas as gerações PlayStation, testados e
              recondicionados pela nossa equipa antes de chegarem até ti.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/catalogo" className="btn-primary">
                Ver catálogo
              </Link>
              <Link href="/sobre" className="btn-secondary">
                Como funciona
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {CATEGORIES_SEED.map((cat) => (
              <Link
                key={cat.slug}
                href={`/catalogo?categoria=${cat.slug}`}
                className="card flex aspect-square flex-col items-center justify-center gap-2 p-4 text-center transition-colors hover:border-primary/50"
              >
                <span className="font-semibold">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Destaques</h2>
          <Link href="/catalogo" className="text-sm text-primary-light hover:underline">
            Ver tudo
          </Link>
        </div>
        {highlighted.length === 0 ? (
          <p className="text-text-muted">
            Ainda sem produtos publicados. Adiciona o primeiro produto no{" "}
            <Link href="/admin/produtos" className="text-primary-light hover:underline">
              painel de administração
            </Link>
            .
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {highlighted.map((product) => (
              <ProductCard
                key={product.id}
                product={{ ...product, price: product.price.toString() }}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
