import Link from "next/link";

/**
 * CTAs do Hero — desenho exclusivo (classes .hero-cta-*), não partilhado com
 * o resto do site. Ver app/globals.css e Bloco 1 do pedido do utilizador.
 */
export function HeroCTAs() {
  return (
    <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
      <Link href="/catalogo" className="hero-cta-primary">
        COMPRE JÁ
        <svg
          className="hero-cta-arrow"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      </Link>
      <Link href="/vender" className="hero-cta-secondary">
        Vender consola
      </Link>
    </div>
  );
}
