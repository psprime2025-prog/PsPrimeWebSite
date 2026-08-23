import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/Button";
import { CheckIcon } from "@/components/icons/InfoIcons";
import { FloatingSymbolsCompact } from "@/components/FloatingSymbols";

export const metadata: Metadata = { title: "Como testamos" };

const STEPS = [
  {
    title: "Verificação inicial",
    description: "Inspeção visual e funcional a todo o produto, por dentro e por fora.",
  },
  {
    title: "Testes específicos",
    description:
      "Consoante o produto: comando, ecrã, leitor de discos, Wi-Fi/Bluetooth, armazenamento ou bateria.",
  },
  {
    title: "Reparação, quando necessário",
    description: "A nossa equipa faz reparações técnicas reais antes de continuar o processo.",
  },
  {
    title: "Limpeza e classificação",
    description:
      "Limpamos o produto e atribuímos um grau de condição honesto: Excelente, Muito Bom ou Bom.",
  },
  {
    title: "Verificação final",
    description: "Última confirmação de que está tudo a funcionar corretamente antes do envio.",
  },
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

      <div className="card mt-10 space-y-2 p-6">
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
