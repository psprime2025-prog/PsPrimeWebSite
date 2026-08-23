import { CheckIcon, ShieldIcon, TruckIcon, LockIcon } from "@/components/icons/InfoIcons";

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

export function WhyBuy() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h2 className="mb-6 text-2xl font-bold">Por que comprar na PsPrime</h2>
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
    </section>
  );
}
