import Link from "next/link";
import { ProductCard, type ProductCardData } from "@/components/ProductCard";
import { WhatsAppIcon } from "@/components/icons/InfoIcons";
import { STORE } from "@/lib/constants";

export function ConsolesForSale({ products }: { products: ProductCardData[] }) {
  if (products.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold">Consolas disponíveis</h2>
        <Link href="/catalogo?categoria=consolas" className="text-sm text-primary-light hover:underline">
          Ver todas
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <a
        href={STORE.whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 flex flex-col gap-3 rounded-card border border-border bg-surface/60 p-4 text-sm transition-colors hover:border-primary/40 sm:flex-row sm:items-center"
      >
        <span className="flex items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary-light">
            <WhatsAppIcon className="h-4 w-4" />
          </span>
          <span className="flex-1">
            <span className="block font-medium text-text">Não sabes qual escolher?</span>
            <span className="block text-text-muted">
              Diz-nos o teu orçamento e o que procuras. Nós recomendamos uma consola para ti.
            </span>
          </span>
        </span>
        <span className="shrink-0 text-sm font-medium text-primary-light sm:ml-3">
          Falar no WhatsApp →
        </span>
      </a>
    </section>
  );
}
