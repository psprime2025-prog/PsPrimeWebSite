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

const SIGNATURE_WORDS = ["Seminovo", "Testado", "Garantido"];

/* Glifos PlayStation decorativos — mesmo traço fino/contorno e mesmas
 * animações float-a/b/c/d de components/FloatingSymbols.tsx, mas com
 * posições próprias, pensadas para o Hero mobile compacto (alguns maiores
 * sangram ligeiramente para fora da secção, que já tem overflow-hidden). */
const CROSS = (
  <g stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="7" y1="7" x2="17" y2="17" />
    <line x1="17" y1="7" x2="7" y2="17" />
  </g>
);
const CIRCLE = <circle cx="12" cy="12" r="7.5" stroke="currentColor" strokeWidth="2.2" fill="none" />;
const TRIANGLE = (
  <path d="M12 5 L20 19 H4 Z" stroke="currentColor" strokeWidth="2.2" fill="none" strokeLinejoin="round" />
);
const SQUARE = <rect x="5" y="5" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="2.2" fill="none" />;

const HERO_GLYPHS = [
  { path: TRIANGLE, className: "left-[8%] top-[1%] h-5 w-5 rotate-6 opacity-[0.14]", animation: "float-b 8s infinite", delay: "0.2s" },
  { path: CIRCLE, className: "-right-4 -top-3 h-16 w-16 opacity-[0.1]", animation: "float-a 9s infinite", delay: "0.8s" },
  { path: CROSS, className: "right-[9%] top-[15%] h-4 w-4 opacity-[0.16]", animation: "float-c 6.5s infinite", delay: "1.3s" },
  { path: SQUARE, className: "-left-4 top-[40%] h-10 w-10 -rotate-12 opacity-[0.12]", animation: "float-d 7.8s infinite", delay: "0.5s" },
  { path: TRIANGLE, className: "right-[12%] bottom-[9%] h-5 w-5 -rotate-12 opacity-[0.15]", animation: "float-c 7.2s infinite", delay: "1.6s" },
  { path: CIRCLE, className: "left-[5%] bottom-[3%] h-6 w-6 opacity-[0.13]", animation: "float-b 8.6s infinite", delay: "0.1s" },
  { path: CROSS, className: "-right-3 -bottom-3 h-12 w-12 opacity-[0.09]", animation: "float-a 9.5s infinite", delay: "2s" },
];

function HeroGlyphs() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {HERO_GLYPHS.map((g, i) => (
        <svg
          key={i}
          viewBox="0 0 24 24"
          className={`floating-symbol absolute text-primary-light ${g.className}`}
          style={{ animation: g.animation, animationDelay: g.delay }}
        >
          {g.path}
        </svg>
      ))}
    </div>
  );
}

export function HeroMobile() {
  return (
    <div
      className="relative px-4 pt-8 sm:px-6 md:hidden"
      style={{ paddingBottom: STICKY_BAR_CLEARANCE }}
    >
      <HeroGlyphs />

      <p className="relative text-sm font-bold uppercase tracking-[0.08em] text-primary-light">
        PsPrime
      </p>

      <h1 className="relative mt-1.5 max-w-xs text-[2.25rem] font-bold leading-[1.1] tracking-tight">
        <span className="text-white">O teu mundo </span>
        <span className="text-primary-light">PlayStation.</span>
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
          quality={95}
          className="relative object-contain"
          sizes="100vw"
        />
      </div>

      <p className="relative mt-10 text-center text-xl font-semibold tracking-[0.03em] text-white/75">
        {SIGNATURE_WORDS.map((word, i) => (
          <span key={word}>
            {i > 0 && " "}
            {i > 0 && <span className="mx-1 text-white/30">·</span>}
            {i > 0 && " "}
            {word}
          </span>
        ))}
      </p>
    </div>
  );
}
