import {
  ControllerIcon,
  ThermometerIcon,
  DiscIcon,
  WifiIcon,
  SparkleIcon,
  WrenchIcon,
} from "@/components/icons/InfoIcons";

const PIPELINE = ["Recebemos", "Testamos", "Preparamos", "Classificamos", "Enviamos"];

const CHECKS = [
  { icon: ControllerIcon, label: "Testamos o comando" },
  { icon: ThermometerIcon, label: "Verificamos temperatura" },
  { icon: DiscIcon, label: "Testamos leitor" },
  { icon: WifiIcon, label: "Testamos conectividade" },
  { icon: SparkleIcon, label: "Limpamos" },
  { icon: WrenchIcon, label: "Reparamos quando necessário" },
];

export function HowWePrepare() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 max-w-2xl">
        <h2 className="text-2xl font-bold">Como preparamos cada consola</h2>
      </div>

      <ol className="grid grid-cols-2 gap-3 sm:grid-cols-5 sm:gap-4">
        {PIPELINE.map((step, i) => (
          <li
            key={step}
            className={`card flex flex-col items-center gap-2 p-4 text-center ${
              i === PIPELINE.length - 1 ? "col-span-2 sm:col-span-1" : ""
            }`}
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/15 text-sm font-bold text-primary-light">
              {i + 1}
            </span>
            <span className="text-sm font-medium">{step}</span>
          </li>
        ))}
      </ol>

      <div className="mt-10">
        <p className="mb-4 text-sm text-text-muted">
          O que &ldquo;testado e recondicionado&rdquo; significa, na prática:
        </p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {CHECKS.map(({ icon: Icon, label }) => (
            <div key={label} className="card flex items-center gap-2.5 p-4 text-sm">
              <Icon className="h-4 w-4 shrink-0 text-primary-light" />
              {label}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
