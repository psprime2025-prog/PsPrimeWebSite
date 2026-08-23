import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/ProductCard";
import { CatalogFilters } from "@/components/CatalogFilters";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Catálogo",
  description: "Consolas, comandos, jogos e acessórios PlayStation seminovos.",
};

export const dynamic = "force-dynamic";

const PAGE_SIZE = 24;

interface CatalogSearchParams {
  categoria?: string;
  geracao?: string;
  condicao?: string;
  ordenar?: string;
  q?: string;
  pagina?: string;
}

export default async function CatalogoPage({
  searchParams,
}: {
  searchParams: Promise<CatalogSearchParams>;
}) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.pagina) || 1);

  const where: Prisma.ProductWhereInput = { active: true };
  if (params.categoria) where.category = { slug: params.categoria };
  if (params.geracao) where.psGeneration = params.geracao as Prisma.EnumPsGenerationFilter["equals"];
  if (params.condicao)
    where.condition = params.condicao as Prisma.EnumProductConditionFilter["equals"];
  if (params.q) where.name = { contains: params.q, mode: "insensitive" };

  const orderBy: Prisma.ProductOrderByWithRelationInput =
    params.ordenar === "preco-asc"
      ? { price: "asc" }
      : params.ordenar === "preco-desc"
        ? { price: "desc" }
        : { createdAt: "desc" };

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: { images: { orderBy: { order: "asc" }, take: 1 } },
      orderBy,
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.product.count({ where }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold">Catálogo</h1>
      {params.q && (
        <p className="mt-1 text-sm text-text-muted">
          Resultados para <span className="text-text">&ldquo;{params.q}&rdquo;</span>
        </p>
      )}

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[220px_1fr]">
        <CatalogFilters />

        <div>
          {products.length === 0 ? (
            <p className="text-text-muted">Nenhum produto encontrado com estes filtros.</p>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={{ ...product, price: product.price.toString() }}
                />
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <nav className="mt-10 flex items-center justify-center gap-2 text-sm">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
                const sp = new URLSearchParams();
                Object.entries(params).forEach(([k, v]) => v && k !== "pagina" && sp.set(k, v));
                sp.set("pagina", String(p));
                return (
                  <a
                    key={p}
                    href={`/catalogo?${sp.toString()}`}
                    className={`flex h-9 w-9 items-center justify-center rounded-full border transition-all duration-200 ease-out hover:scale-[1.02] active:scale-[0.97] ${
                      p === page ? "border-primary text-primary-light" : "border-border text-text-muted"
                    }`}
                  >
                    {p}
                  </a>
                );
              })}
            </nav>
          )}
        </div>
      </div>
    </div>
  );
}
