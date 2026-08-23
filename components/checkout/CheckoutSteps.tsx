import { CheckIcon } from "@/components/icons/InfoIcons";

export type CheckoutStep = "carrinho" | "dados" | "pagamento" | "confirmar";

const STEPS: { id: CheckoutStep; label: string }[] = [
  { id: "carrinho", label: "Carrinho" },
  { id: "dados", label: "Dados" },
  { id: "pagamento", label: "Pagamento" },
  { id: "confirmar", label: "Confirmar" },
];

export function CheckoutSteps({ current }: { current: CheckoutStep }) {
  const currentIndex = STEPS.findIndex((s) => s.id === current);

  return (
    <ol className="mb-8 flex items-center" aria-label="Progresso da compra">
      {STEPS.map((step, i) => {
        const isDone = i < currentIndex;
        const isCurrent = i === currentIndex;
        return (
          <li key={step.id} className="flex flex-1 items-center last:flex-none">
            <div className="flex items-center gap-2">
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                  isDone
                    ? "bg-success/15 text-success"
                    : isCurrent
                      ? "bg-primary text-white"
                      : "bg-surface text-text-muted"
                }`}
              >
                {isDone ? <CheckIcon className="h-3.5 w-3.5" /> : i + 1}
              </span>
              <span
                className={`hidden text-sm sm:inline ${
                  isCurrent ? "font-semibold text-text" : "text-text-muted"
                }`}
              >
                {step.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <span
                className={`mx-2 h-px flex-1 ${isDone ? "bg-success/40" : "bg-border"}`}
                aria-hidden="true"
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}
