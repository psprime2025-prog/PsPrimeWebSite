interface SymbolSpec {
  className: string;
  animation: string;
  delay: string;
  path: React.ReactNode;
  viewBox: string;
  hideOnMobile?: boolean;
}

const CROSS = (
  <g stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="7" y1="7" x2="17" y2="17" />
    <line x1="17" y1="7" x2="7" y2="17" />
  </g>
);
const TRIANGLE = <path d="M12 5 L20 19 H4 Z" stroke="currentColor" strokeWidth="2.2" fill="none" strokeLinejoin="round" />;
const CIRCLE = <circle cx="12" cy="12" r="7.5" stroke="currentColor" strokeWidth="2.2" fill="none" />;
const SQUARE = <rect x="5" y="5" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="2.2" fill="none" />;

// Símbolos PlayStation decorativos — SVG, opacidade baixa, animação lenta,
// aria-hidden, pointer-events-none. Menos elementos em mobile do que em
// desktop (ver Bloco J).
const SYMBOLS: SymbolSpec[] = [
  {
    className: "left-[6%] top-[12%] h-10 w-10 opacity-[0.16] text-primary-light",
    animation: "float-a 7s infinite",
    delay: "0s",
    path: CROSS,
    viewBox: "0 0 24 24",
  },
  {
    className: "left-[12%] bottom-[14%] h-8 w-8 opacity-[0.14] text-primary-light",
    animation: "float-c 6.5s infinite",
    delay: "1.1s",
    path: CIRCLE,
    viewBox: "0 0 24 24",
  },
  {
    className: "right-[10%] top-[8%] h-9 w-9 opacity-[0.14] text-text-muted",
    animation: "float-b 8.5s infinite",
    delay: "0.6s",
    path: TRIANGLE,
    viewBox: "0 0 24 24",
    hideOnMobile: true,
  },
  {
    className: "right-[7%] bottom-[10%] h-9 w-9 opacity-[0.16] text-text-muted",
    animation: "float-d 7.8s infinite",
    delay: "0.3s",
    path: SQUARE,
    viewBox: "0 0 24 24",
    hideOnMobile: true,
  },
  {
    className: "left-[45%] top-[5%] h-6 w-6 opacity-[0.12] text-text-muted",
    animation: "float-b 9.5s infinite",
    delay: "1.6s",
    path: CROSS,
    viewBox: "0 0 24 24",
    hideOnMobile: true,
  },
  {
    className: "left-[48%] bottom-[6%] h-7 w-7 opacity-[0.13] text-primary-light",
    animation: "float-d 7.2s infinite",
    delay: "0.9s",
    path: TRIANGLE,
    viewBox: "0 0 24 24",
    hideOnMobile: true,
  },
  {
    className: "right-[24%] top-[22%] h-6 w-6 opacity-[0.12] text-text-muted",
    animation: "float-a 8s infinite",
    delay: "2.1s",
    path: CIRCLE,
    viewBox: "0 0 24 24",
    hideOnMobile: true,
  },
  {
    className: "left-[26%] bottom-[20%] h-7 w-7 opacity-[0.13] text-primary-light",
    animation: "float-c 7s infinite",
    delay: "0.4s",
    path: SQUARE,
    viewBox: "0 0 24 24",
    hideOnMobile: true,
  },
];

// Variante mais leve para secções secundárias (fora do hero).
const COMPACT_SYMBOLS: SymbolSpec[] = [
  {
    className: "right-[6%] top-[10%] h-7 w-7 opacity-[0.13] text-primary-light",
    animation: "float-c 7.5s infinite",
    delay: "0.2s",
    path: CIRCLE,
    viewBox: "0 0 24 24",
  },
  {
    className: "left-[8%] bottom-[12%] h-6 w-6 opacity-[0.12] text-text-muted",
    animation: "float-b 8.2s infinite",
    delay: "0.8s",
    path: TRIANGLE,
    viewBox: "0 0 24 24",
    hideOnMobile: true,
  },
];

function SymbolsLayer({ symbols }: { symbols: SymbolSpec[] }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {symbols.map((s, i) => (
        <svg
          key={i}
          viewBox={s.viewBox}
          className={`floating-symbol absolute ${s.className} ${s.hideOnMobile ? "hidden sm:block" : ""}`}
          style={{ animation: s.animation, animationDelay: s.delay }}
        >
          {s.path}
        </svg>
      ))}
    </div>
  );
}

/** Campo cheio de símbolos flutuantes — usado no hero. */
export function FloatingSymbols() {
  return <SymbolsLayer symbols={SYMBOLS} />;
}

/** Versão leve para secções secundárias (fora do hero). */
export function FloatingSymbolsCompact() {
  return <SymbolsLayer symbols={COMPACT_SYMBOLS} />;
}
