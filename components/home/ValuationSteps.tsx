const STEPS = [
  {
    number: "1",
    title: "Descreve a tua consola",
    description: "Preenches um formulário simples com o modelo, o estado e, se quiseres, fotos.",
  },
  {
    number: "2",
    title: "Recebe uma proposta",
    description: "A nossa equipa avalia o teu pedido e envia uma proposta, sem compromisso.",
  },
  {
    number: "3",
    title: "Recebe o pagamento",
    description: "Aceitas a proposta, envias a consola e recebes o pagamento.",
  },
];

export function ValuationSteps() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 max-w-2xl">
        <h2 className="text-2xl font-bold">Avaliação</h2>
        <p className="mt-2 text-sm text-text-muted">Como funciona vender a tua consola, em 3 passos.</p>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        {STEPS.map((step) => (
          <div key={step.number} className="card p-5">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/15 text-sm font-bold text-primary-light">
              {step.number}
            </span>
            <h3 className="mt-3 font-semibold">{step.title}</h3>
            <p className="mt-1 text-sm text-text-muted">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
