"use client";

import { useState } from "react";

interface Props {
  title: string;
  summary: string;
  expandLabel: string;
  children: React.ReactNode;
}

/**
 * Em mobile mostra só um resumo + botão para expandir (evita blocos grandes
 * logo ao início do ecrã — ver Bloco I). Em tablet/desktop mostra sempre o
 * conteúdo completo, sem qualquer alteração de comportamento.
 */
export function MobileExpandable({ title, summary, expandLabel, children }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="sm:hidden">
        <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-muted">{title}</h2>
        {!open ? (
          <>
            <p className="text-sm text-text-muted">{summary}</p>
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="mt-3 text-sm font-medium text-primary-light hover:underline"
            >
              {expandLabel}
            </button>
          </>
        ) : (
          children
        )}
      </div>
      <div className="hidden sm:block">
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-text-muted">{title}</h2>
        {children}
      </div>
    </>
  );
}
