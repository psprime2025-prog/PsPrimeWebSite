"use client";

import { useState } from "react";
import { CheckIcon, ShieldIcon, TruckIcon, LockIcon } from "@/components/icons/InfoIcons";
import { FloatingSymbolsCompact } from "@/components/FloatingSymbols";

const REASONS = [
  {
    icon: CheckIcon,
    title: "Produtos testados",
    description: "Testados e recondicionados pela nossa equipa antes de saírem do stock.",
  },
  {
    icon: ShieldIcon,
    title: "Garantia legal",
    description: "Todos os produtos beneficiam de garantia legal de conformidade.",
  },
  {
    icon: TruckIcon,
    title: "Envio rápido",
    description: "Envio seguro e rastreável em 24–48h para todo o país.",
  },
  {
    icon: LockIcon,
    title: "Pagamento seguro",
    description: "Cartão, Multibanco ou MB WAY, processados de forma segura pela Stripe.",
  },
];

function ReasonsGrid() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {REASONS.map(({ icon: Icon, title, description }) => (
        <div key={title} className="card p-5">
          <span className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-primary-light">
            <Icon className="h-5 w-5" />
          </span>
          <h3 className="mt-3 font-semibold">{title}</h3>
          <p className="mt-1 text-sm text-text-muted">{description}</p>
        </div>
      ))}
    </div>
  );
}

export function WhyBuy() {
  const [open, setOpen] = useState(false);

  return (
    <section className="relative mx-auto max-w-7xl overflow-hidden px-4 py-12 sm:px-6 lg:px-8">
      <FloatingSymbolsCompact />
      <h2 className="relative mb-2 text-2xl font-bold sm:mb-6">Por que comprar na PsPrime</h2>

      <div className="sm:hidden">
        {open ? (
          <div className="mt-4">
            <ReasonsGrid />
          </div>
        ) : (
          <>
            <p className="text-sm text-text-muted">
              Testados, com garantia legal, envio rápido e pagamento seguro.
            </p>
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="mt-3 text-sm font-medium text-primary-light hover:underline"
            >
              Ver as {REASONS.length} razões →
            </button>
          </>
        )}
      </div>
      <div className="hidden sm:block">
        <ReasonsGrid />
      </div>
    </section>
  );
}
