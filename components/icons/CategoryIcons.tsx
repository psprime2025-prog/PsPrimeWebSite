import type { SVGProps } from "react";

/** Ícones de linha minimalistas para as categorias — mesma linguagem visual dos símbolos flutuantes. */

export function ConsoleIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="3" y="8" width="18" height="9" rx="3" />
      <path d="M7 12h2M8 11v2" />
      <circle cx="16" cy="11.5" r="0.9" fill="currentColor" stroke="none" />
      <circle cx="18" cy="13.5" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function ControllerIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M7 9c-2.5 0-4 2-3.6 4.5l.4 2.2c.3 1.6 2.2 2.2 3.3 1l.6-.7a2 2 0 0 1 1.5-.7h5.6a2 2 0 0 1 1.5.7l.6.7c1.1 1.2 3 .6 3.3-1l.4-2.2C21 11 19.5 9 17 9Z" />
      <path d="M8.5 12.5h2M9.5 11.5v2" />
      <circle cx="16.5" cy="11.8" r="0.7" fill="currentColor" stroke="none" />
      <circle cx="15" cy="13.3" r="0.7" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function DiscIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="2.4" />
    </svg>
  );
}

export function AccessoryIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M5 12a7 7 0 0 1 14 0v4" />
      <rect x="3.5" y="12" width="3.5" height="5" rx="1.2" />
      <rect x="17" y="12" width="3.5" height="5" rx="1.2" />
    </svg>
  );
}
