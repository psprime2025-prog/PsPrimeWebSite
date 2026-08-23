"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { usePathname, useSearchParams } from "next/navigation";
import { CATEGORIES_SEED } from "@/lib/constants";
import { useMounted } from "@/lib/use-mounted";

const EXTRA_LINKS = [
  { href: "/faq", label: "FAQ" },
  { href: "/sobre", label: "Sobre Nós" },
  { href: "/contactos", label: "Contactos" },
];

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const mounted = useMounted();
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
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Abrir menu"
        aria-expanded={open}
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] backdrop-blur-md transition-colors hover:bg-white/[0.06] lg:hidden"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <line x1="4" y1="7" x2="20" y2="7" />
          <line x1="4" y1="12" x2="20" y2="12" />
          <line x1="4" y1="17" x2="20" y2="17" />
        </svg>
      </button>

      {open &&
        mounted &&
        createPortal(
          <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Fechar menu"
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div className="absolute inset-y-0 right-0 flex w-full max-w-xs flex-col overflow-y-auto border-l border-border bg-surface p-5">
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold">Menu</span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Fechar menu"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.03]"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="6" y1="6" x2="18" y2="18" />
                  <line x1="18" y1="6" x2="6" y2="18" />
                </svg>
              </button>
            </div>

            <nav className="mt-5 space-y-1">
              <Link
                href="/catalogo"
                className={`block rounded-xl px-3 py-2.5 font-medium transition-colors ${
                  isCatalogActive && !activeCategoria
                    ? "bg-primary/10 text-primary-light"
                    : "text-text hover:bg-white/5"
                }`}
              >
                Catálogo
              </Link>
              <div className="ml-3 space-y-1 border-l border-border pl-3">
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

              <div className="my-3 border-t border-border" />

              {EXTRA_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`block rounded-xl px-3 py-2.5 font-medium transition-colors ${
                    pathname === link.href
                      ? "bg-primary/10 text-primary-light"
                      : "text-text hover:bg-white/5"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
