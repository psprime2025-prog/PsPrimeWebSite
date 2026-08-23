"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { CATEGORIES_SEED } from "@/lib/constants";

export function CatalogMenu() {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeCategoria = searchParams.get("categoria");
  const isCatalogActive = pathname.startsWith("/catalogo");

  // Usar a string da rota (não os objetos pathname/searchParams, cuja referência
  // pode mudar em re-renders não relacionados) como dependência — evita fechar o
  // menu sozinho por engano fora de uma navegação real.
  const routeKey = `${pathname}?${searchParams.toString()}`;
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- fecha o menu ao navegar (muda de rota)
    setOpen(false);
  }, [routeKey]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <Button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="true"
        variant="light"
        size="sm"
        className={isCatalogActive ? "btn-glass--active" : ""}
      >
        Catálogo
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </Button>

      {open && (
        <div
          onMouseLeave={() => setOpen(false)}
          className="card absolute left-0 top-full z-50 mt-2 w-56 overflow-hidden p-2 shadow-2xl"
        >
          <Link
            href="/catalogo"
            className={`block rounded-xl px-3 py-2 text-sm transition-colors ${
              isCatalogActive && !activeCategoria
                ? "bg-primary/10 text-primary-light"
                : "text-text hover:bg-white/5"
            }`}
          >
            Todos os produtos
          </Link>
          <div className="my-2 border-t border-border" />
          {CATEGORIES_SEED.map((cat) => (
            <Link
              key={cat.slug}
              href={`/catalogo?categoria=${cat.slug}`}
              className={`block rounded-xl px-3 py-2 text-sm transition-colors ${
                activeCategoria === cat.slug
                  ? "bg-primary/10 text-primary-light"
                  : "text-text-muted hover:bg-white/5 hover:text-text"
              }`}
            >
              {cat.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
