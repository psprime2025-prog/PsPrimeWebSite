import Link from "next/link";
import Image from "next/image";
import { HeroTrustLine } from "@/components/HeroTrustLine";
import { ShieldIcon } from "@/components/icons/InfoIcons";

/**
 * Hero exclusivo para mobile (<768px) — desktop/tablet usam o bloco original
 * em app/page.tsx, inalterado. O produto é o protagonista visual (imagem
 * grande e imersiva, sem moldura de card), com o texto a funcionar como
 * moldura antes/depois dela — não uma página de "infoproduto".
 *
 * Classes próprias, sem tocar em .hero-cta-primary/.hero-cta-secondary
 * (usadas pelo HeroCTAs do desktop) nem em app/globals.css.
 */
export function HeroMobile() {
  return (
    <div className="relative px-4 py-10 text-center sm:px-6 md:hidden">
      <span className="badge-condition mb-5 inline-flex w-fit items-center gap-1.5 border-success/40 text-success">
        <ShieldIcon className="h-3.5 w-3.5" />
        Produtos seminovos testados
      </span>

      <h1 className="mx-auto max-w-sm text-[2.15rem] font-bold leading-[1.15] tracking-tight">
        O teu mundo PlayStation, <span className="text-primary-light">seminovo</span> e de
        confiança.
      </h1>

      <div className="animate-fade-in-up mx-auto mt-10 w-[86%] max-w-[360px]">
        <div
          className="relative aspect-[3/4] overflow-hidden"
          style={{
            maskImage:
              "radial-gradient(ellipse 78% 72% at 50% 46%, black 60%, transparent 100%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 78% 72% at 50% 46%, black 60%, transparent 100%)",
            filter: "drop-shadow(0 24px 32px rgba(0,0,0,0.45))",
          }}
        >
          <Image
            src="/hero-photo.jpg"
            alt="PsPrime — consola PlayStation testada e preparada"
            fill
            priority
            className="object-cover"
            sizes="90vw"
          />
        </div>
      </div>

      <p className="mx-auto mt-8 max-w-xs text-sm text-text-muted">
        Consolas, comandos, jogos e acessórios testados e preparados pela nossa equipa.
      </p>

      <div className="mt-5 flex justify-center">
        <HeroTrustLine />
      </div>

      <div className="mt-7 flex items-center justify-center gap-2">
        <Link
          href="/catalogo"
          className="inline-flex h-12 shrink-0 items-center justify-center whitespace-nowrap rounded-full bg-primary px-5 text-sm font-semibold text-white shadow-[0_8px_20px_-8px_rgba(0,0,0,0.5)] transition-transform active:scale-95"
        >
          COMPRE JÁ
        </Link>
        <Link
          href="/vender"
          className="inline-flex h-12 shrink-0 items-center justify-center whitespace-nowrap rounded-full border border-white/15 bg-white/[0.04] px-5 text-sm font-medium text-white backdrop-blur-md transition-transform active:scale-95"
        >
          Vender consola
        </Link>
      </div>
    </div>
  );
}
