const SYMBOLS = [
  {
    // ✕ (cross)
    className: "left-[6%] top-[12%] h-10 w-10 opacity-[0.16] text-primary-light",
    animation: "float-a 7s infinite",
    delay: "0s",
    path: (
      <g stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
        <line x1="7" y1="7" x2="17" y2="17" />
        <line x1="17" y1="7" x2="7" y2="17" />
      </g>
    ),
    viewBox: "0 0 24 24",
  },
  {
    // △ (triangle)
    className: "right-[10%] top-[8%] h-9 w-9 opacity-[0.14] text-text-muted",
    animation: "float-b 8.5s infinite",
    delay: "0.6s",
    path: <path d="M12 5 L20 19 H4 Z" stroke="currentColor" strokeWidth="2.2" fill="none" strokeLinejoin="round" />,
    viewBox: "0 0 24 24",
  },
  {
    // ○ (circle)
    className: "left-[12%] bottom-[14%] h-8 w-8 opacity-[0.14] text-primary-light",
    animation: "float-c 6.5s infinite",
    delay: "1.1s",
    path: <circle cx="12" cy="12" r="7.5" stroke="currentColor" strokeWidth="2.2" fill="none" />,
    viewBox: "0 0 24 24",
  },
  {
    // ▢ (square)
    className: "right-[7%] bottom-[10%] h-9 w-9 opacity-[0.16] text-text-muted",
    animation: "float-d 7.8s infinite",
    delay: "0.3s",
    path: <rect x="5" y="5" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="2.2" fill="none" />,
    viewBox: "0 0 24 24",
  },
] as const;

/** Símbolos PlayStation decorativos, a flutuar suavemente pelo hero. Puramente estético. */
export function FloatingSymbols() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {SYMBOLS.map((s, i) => (
        <svg
          key={i}
          viewBox={s.viewBox}
          className={`floating-symbol absolute ${s.className}`}
          style={{ animation: s.animation, animationDelay: s.delay }}
        >
          {s.path}
        </svg>
      ))}
    </div>
  );
}
