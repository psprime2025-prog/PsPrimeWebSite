import { ButtonLink } from "@/components/ui/Button";

export function SellTeaser() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="card flex flex-col items-start gap-4 p-8 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold">Vender a minha consola</h2>
          <p className="mt-2 max-w-lg text-sm text-text-muted">
            Diz-nos o que tens para vender e enviamos-te uma proposta de avaliação. Sem
            compromisso — a decisão é sempre tua.
          </p>
        </div>
        <ButtonLink href="/vender" variant="primary" className="shrink-0">
          Pedir avaliação
        </ButtonLink>
      </div>
    </section>
  );
}
