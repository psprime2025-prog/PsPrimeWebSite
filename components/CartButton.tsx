"use client";

import Link from "next/link";
import { useCartStore } from "@/lib/cart-store";
import { useMounted } from "@/lib/use-mounted";

export function CartButton() {
  const totalItems = useCartStore((s) => s.totalItems());
  // Evita mismatch de hidratação: o localStorage só está disponível no cliente.
  const mounted = useMounted();

  return (
    <Link
      href="/carrinho"
      className="relative flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm backdrop-blur-md transition-all duration-200 ease-out hover:border-primary/40 hover:bg-white/[0.06] active:scale-[0.97]"
      aria-label="Carrinho de compras"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="9" cy="21" r="1" />
        <circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
      </svg>
      <span className="hidden sm:inline">Carrinho</span>
      {mounted && totalItems > 0 && (
        <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-xs font-semibold text-white">
          {totalItems}
        </span>
      )}
    </Link>
  );
}
