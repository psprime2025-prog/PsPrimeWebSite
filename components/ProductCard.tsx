import Image from "next/image";
import Link from "next/link";
import { formatPrice, CONDITION_LABELS, GENERATION_LABELS } from "@/lib/format";

export interface ProductCardData {
  id: string;
  name: string;
  slug: string;
  price: string | number;
  condition: string;
  psGeneration: string;
  stock: number;
  images: { url: string; alt: string }[];
}

export function ProductCard({ product }: { product: ProductCardData }) {
  const image = product.images[0];
  const outOfStock = product.stock <= 0;

  return (
    <Link
      href={`/produto/${product.slug}`}
      className="card group flex flex-col overflow-hidden transition-colors hover:border-primary/50"
    >
      <div className="relative aspect-square bg-background">
        {image ? (
          <Image
            src={image.url}
            alt={image.alt || product.name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-contain p-4 transition-transform group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-text-muted">Sem imagem</div>
        )}
        {outOfStock && (
          <span className="absolute left-2 top-2 rounded-full bg-background/90 px-2.5 py-1 text-xs font-medium text-text-muted">
            Esgotado
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex flex-wrap gap-1.5">
          <span className="badge-condition">{GENERATION_LABELS[product.psGeneration]}</span>
          <span className="badge-condition">{CONDITION_LABELS[product.condition]}</span>
        </div>
        <h3 className="line-clamp-2 text-sm font-medium text-text">{product.name}</h3>
        <p className="mt-auto text-lg font-bold text-primary-light">{formatPrice(product.price)}</p>
      </div>
    </Link>
  );
}
