import Image from "next/image";

/**
 * Hero exclusivo para mobile (<768px) — desktop/tablet usam o bloco original
 * em app/page.tsx, inalterado. Versão simplificada: marca → título curto →
 * produto em destaque (com glow azul de profundidade) → assinatura. Os CTAs
 * vivem na barra fixa (ver components/MobileStickyCta.tsx), por isso não se
 * repetem aqui.
 *
 * Classes próprias, sem tocar em .hero-cta-primary/.hero-cta-secondary
 * (usadas pelo HeroCTAs do desktop) nem em app/globals.css.
 */

/* Altura da barra fixa de CTAs (ver MobileStickyCta) + margem de segurança,
 * para o conteúdo do Hero nunca ficar escondido por baixo dela. */
const STICKY_BAR_CLEARANCE = "calc(env(safe-area-inset-bottom) + 9rem)";

export function HeroMobile() {
  return (
    <div
      className="relative px-4 pt-8 sm:px-6 md:hidden"
      style={{ paddingBottom: STICKY_BAR_CLEARANCE }}
    >
      <p className="text-sm font-bold uppercase tracking-[0.08em] text-primary-light">PsPrime</p>

      <h1 className="mt-1.5 max-w-xs text-[2.25rem] font-bold leading-[1.1] tracking-tight text-white">
        O teu mundo PlayStation.
      </h1>

      <div className="animate-fade-in-up relative mt-8 h-80 w-full sm:h-96">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(closest-side, rgba(22,119,255,0.28), rgba(22,119,255,0.08) 60%, transparent 80%)",
            filter: "blur(4px)",
          }}
        />
        <Image
          src="/herophoto.png"
          alt="PsPrime — consola PlayStation testada e preparada"
          fill
          priority
          className="relative object-contain"
          sizes="100vw"
        />
      </div>

      <p className="mt-6 text-xl font-semibold text-white">Seminovo. Testado. Garantido.</p>
    </div>
  );
}
