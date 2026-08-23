import { StarIcon } from "@/components/icons/InfoIcons";

export function Reviews() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 max-w-2xl">
        <h2 className="text-2xl font-bold">Avaliações de clientes</h2>
        <p className="mt-2 text-sm text-text-muted">
          Ainda estamos a recolher as primeiras avaliações reais de quem comprou na PsPrime.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="card flex flex-col items-center gap-2 p-8 text-center">
            <div className="flex gap-1 text-text-muted/40">
              {Array.from({ length: 5 }, (_, s) => (
                <StarIcon key={s} className="h-4 w-4" />
              ))}
            </div>
            <span className="badge-condition mt-2">Brevemente</span>
          </div>
        ))}
      </div>
    </section>
  );
}
