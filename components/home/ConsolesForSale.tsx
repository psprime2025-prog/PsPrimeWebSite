import Link from "next/link";
import { ProductCard, type ProductCardData } from "@/components/ProductCard";

export function ConsolesForSale({ products }: { products: ProductCardData[] }) {
  if (products.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold">Consolas à venda</h2>
        <Link href="/catalogo?categoria=consolas" className="text-sm text-primary-light hover:underline">
          Ver todas
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
