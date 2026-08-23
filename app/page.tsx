import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/ProductCard";
import { ButtonLink } from "@/components/ui/Button";
import { FloatingSymbols } from "@/components/FloatingSymbols";
import { CATEGORIES_SEED } from "@/lib/constants";
import { ConsoleIcon, ControllerIcon, DiscIcon, AccessoryIcon } from "@/components/icons/CategoryIcons";

const CATEGORY_ICONS: Record<string, typeof ConsoleIcon> = {
  consolas: ConsoleIcon,
  comandos: ControllerIcon,
  jogos: DiscIcon,
  acessorios: AccessoryIcon,
};

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
      <section className="relative overflow-hidden border-b border-border bg-surface">
        <FloatingSymbols />
        <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div className="relative z-10 flex flex-col justify-center">
            <span className="badge-condition mb-4 inline-flex w-fit items-center gap-1.5 border-success/40 text-success">
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
              <ButtonLink href="/catalogo" variant="primary">
                Comprar consola já
              </ButtonLink>
              <ButtonLink href="/vender" variant="light">
                Vender consola
              </ButtonLink>
            </div>
          </div>

          <div className="relative min-h-[320px] overflow-hidden rounded-card lg:min-h-[480px]">
            {/* Ilustração de marca — substituir por uma fotografia real da PsPrime
                (produto, equipa ou loja) assim que estiver disponível: basta
                trocar o ficheiro public/hero.jpg, sem alterar código. */}
            <Image
              src="/hero.jpg"
              alt="PsPrime — universo PlayStation"
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            {/* Overlay escuro para profundidade + transição suave para o lado do texto */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/50 to-transparent" />
            <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-surface to-transparent lg:hidden" />
            <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-28 bg-gradient-to-r from-surface to-transparent lg:block" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <h2 className="mb-6 text-xl font-bold">Categorias</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {CATEGORIES_SEED.map((cat) => {
            const Icon = CATEGORY_ICONS[cat.slug];
            return (
              <Link
                key={cat.slug}
                href={`/catalogo?categoria=${cat.slug}`}
                className="card group flex aspect-square flex-col items-center justify-center gap-3 p-4 text-center transition-colors hover:border-primary/50"
              >
                {Icon && (
                  <span className="flex h-12 w-12 items-center justify-center rounded-full border border-border text-text-muted transition-colors group-hover:border-primary/50 group-hover:text-primary-light">
                    <Icon className="h-6 w-6" />
                  </span>
                )}
                <span className="font-semibold">{cat.name}</span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
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
