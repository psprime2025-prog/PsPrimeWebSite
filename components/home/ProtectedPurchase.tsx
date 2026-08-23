"use client";

import { useState } from "react";
import Link from "next/link";
import { ShieldIcon, CheckIcon, SupportIcon } from "@/components/icons/InfoIcons";
import { STORE } from "@/lib/constants";
import { FloatingSymbolsCompact } from "@/components/FloatingSymbols";

const POINTS = [
  {
    icon: ShieldIcon,
    title: "Garantia legal de conformidade",
    description:
      "Todos os produtos seminovos beneficiam de garantia legal, nos termos da lei portuguesa.",
    href: "/legal/termos",
    linkLabel: "Ver termos e garantia",
  },
  {
    icon: CheckIcon,
    title: "Testados antes do envio",
    description: "Cada produto é testado e recondicionado pela nossa equipa antes de sair do stock.",
  },
  {
    icon: SupportIcon,
    title: "Suporte dedicado",
    description: `Equipa disponível em ${STORE.supportEmail} ou ${STORE.supportPhone} para qualquer dúvida.`,
    href: "/contactos",
    linkLabel: "Contactar",
  },
];

function PointsGrid() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
      {POINTS.map(({ icon: Icon, title, description, href, linkLabel }) => (
        <div key={title}>
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary-light">
            <Icon className="h-5 w-5" />
          </span>
          <h3 className="mt-3 font-semibold">{title}</h3>
          <p className="mt-1 text-sm text-text-muted">{description}</p>
          {href && (
            <Link href={href} className="mt-2 inline-block text-sm text-primary-light hover:underline">
              {linkLabel} →
            </Link>
          )}
        </div>
      ))}
    </div>
  );
}

export function ProtectedPurchase() {
  const [open, setOpen] = useState(false);

  return (
    <section className="relative overflow-hidden border-y border-border bg-surface/50">
      <FloatingSymbolsCompact />
      <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8 max-w-2xl">
          <h2 className="text-2xl font-bold">Compra protegida</h2>
          <p className="mt-2 text-sm text-text-muted">Testamos cada consola antes de enviar.</p>
        </div>

        <div className="sm:hidden">
          {open ? (
            <PointsGrid />
          ) : (
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="text-sm font-medium text-primary-light hover:underline"
            >
              Ver os motivos →
            </button>
          )}
        </div>
        <div className="hidden sm:block">
          <PointsGrid />
        </div>
      </div>
    </section>
  );
}
