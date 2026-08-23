import { ButtonLink } from "@/components/ui/Button";
import { ShieldIcon, CheckIcon } from "@/components/icons/InfoIcons";
import { FloatingSymbolsCompact } from "@/components/FloatingSymbols";

const POINTS = ["Testado", "Estado real", "Garantia legal", "Apoio pós-venda"];

export function TrustHighlight() {
  return (
    <section className="relative mx-auto max-w-7xl overflow-hidden px-4 py-12 sm:px-6 lg:px-8">
      <FloatingSymbolsCompact />
      <h2 className="relative mb-6 text-2xl font-bold">Por que PsPrime?</h2>

      <div className="card relative flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary-light">
            <ShieldIcon className="h-5 w-5" />
          </span>
          <div>
            <p className="text-lg font-semibold">Não precisas apostar quando compras usado.</p>
            <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-text-muted">
              {POINTS.map((point) => (
                <li key={point} className="flex items-center gap-1.5">
                  <CheckIcon className="h-4 w-4 shrink-0 text-success" />
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <ButtonLink href="/como-testamos" variant="secondary" className="shrink-0 self-start sm:self-center">
          Ver como testamos
        </ButtonLink>
      </div>
    </section>
  );
}
