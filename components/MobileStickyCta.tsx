import Link from "next/link";
import { HeroTrustLine } from "@/components/HeroTrustLine";
import { CartIcon, TagIcon } from "@/components/icons/InfoIcons";

/**
 * Barra de CTAs fixa ao fundo do ecrã, exclusiva mobile (<768px) e só na
 * homepage. Vive fora do fluxo normal do Hero — fica visível desde o
 * primeiro instante, por cima do conteúdo com scroll (ver app/page.tsx).
 *
 * Classes próprias, sem tocar em .hero-cta-primary/.hero-cta-secondary
 * (desktop) nem em app/globals.css.
 */
export function MobileStickyCta() {
  return (
    <div
      className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-[#0a0d14]/95 px-4 pt-3 backdrop-blur-md md:hidden"
      style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 0.75rem)" }}
    >
      <div className="flex items-center gap-2.5">
        <Link
          href="/catalogo"
          className="flex h-12 flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-full bg-primary px-2 text-[13px] font-semibold text-white shadow-[0_8px_20px_-8px_rgba(0,0,0,0.5)] transition-transform active:scale-95"
        >
          <CartIcon className="h-4 w-4 shrink-0" />
          COMPRE JÁ
          <span aria-hidden="true">→</span>
        </Link>
        <Link
          href="/vender"
          className="flex h-12 flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-full border border-white/20 bg-white/[0.04] px-2 text-[13px] font-medium text-white backdrop-blur-md transition-transform active:scale-95"
        >
          <TagIcon className="h-4 w-4 shrink-0" />
          VENDER CONSOLA
        </Link>
      </div>

      <div className="flex justify-center">
        <HeroTrustLine />
      </div>
    </div>
  );
}
