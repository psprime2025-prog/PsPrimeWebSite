import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/Button";
import { CheckIcon } from "@/components/icons/InfoIcons";
import { FloatingSymbolsCompact } from "@/components/FloatingSymbols";

export const metadata: Metadata = { title: "Como testamos" };

const STEPS = [
  {
    title: "Recebemos",
    description: "A consola chega à nossa equipa e entra no processo de preparação.",
  },
  {
    title: "Testamos",
    description: "Verificação funcional completa — comando, temperatura, leitor e conectividade.",
  },
  {
    title: "Preparamos",
    description: "Limpamos e reparamos o que for necessário, com reparações técnicas reais.",
  },
  {
    title: "Classificamos",
    description: "Atribuímos um grau de condição honesto: Excelente, Muito Bom ou Bom.",
  },
  {
    title: "Enviamos",
    description: "Última verificação e envio seguro, rastreável, em 24–48h úteis.",
  },
];

const CHECKS = [
  { emoji: "🎮", title: "Comando", description: "Testamos sticks, botões e vibração." },
  { emoji: "🌡️", title: "Temperatura", description: "Verificamos funcionamento e refrigeração." },
  { emoji: "💿", title: "Leitor", description: "Testamos leitura de jogos." },
  { emoji: "📶", title: "Conectividade", description: "Wi-Fi, Bluetooth e portas." },
  { emoji: "🧹", title: "Limpeza", description: "Interior e exterior." },
  { emoji: "🔧", title: "Reparação", description: "Quando necessário." },
];

export default function ComoTestamosPage() {
  return (
    <div className="relative mx-auto max-w-2xl overflow-hidden px-4 py-12 sm:px-6">
      <FloatingSymbolsCompact />
      <h1 className="relative text-3xl font-bold">Como testamos</h1>
      <p className="mt-3 text-text-muted">
        Cada produto passa por este processo antes de chegar até ti — por isso preferimos
        chamar-lhes seminovos em vez de simplesmente &ldquo;usados&rdquo;.
      </p>

      <ol className="mt-8 space-y-6">
        {STEPS.map((step, i) => (
          <li key={step.title} className="flex gap-4">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/15 text-sm font-bold text-primary-light">
              {i + 1}
            </span>
            <div>
              <h2 className="font-semibold">{step.title}</h2>
              <p className="mt-0.5 text-sm text-text-muted">{step.description}</p>
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-10">
        <p className="mb-3 text-sm text-text-muted">
          O que &ldquo;testado e recondicionado&rdquo; significa, na prática:
        </p>
        <div className="grid grid-cols-2 gap-3">
          {CHECKS.map(({ emoji, title, description }) => (
            <div key={title} className="card p-3">
              <span className="text-lg" aria-hidden="true">
                {emoji}
              </span>
              <p className="mt-1.5 text-sm font-semibold">{title}</p>
              <p className="mt-0.5 text-xs text-text-muted">{description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="card mt-8 space-y-2 p-6">
        <div className="flex items-center gap-2.5 text-sm">
          <CheckIcon className="h-4 w-4 shrink-0 text-success" />
          Garantia legal em todos os produtos
        </div>
        <div className="flex items-center gap-2.5 text-sm">
          <CheckIcon className="h-4 w-4 shrink-0 text-success" />
          Grau de condição indicado em cada ficha de produto
        </div>
      </div>

      <div className="mt-8">
        <ButtonLink href="/catalogo" variant="primary">
          Ver catálogo
        </ButtonLink>
      </div>
    </div>
  );
}
