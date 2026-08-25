import Link from "next/link";
import Image from "next/image";
import { CheckIcon, CameraIcon, ShieldIcon, MessageIcon } from "@/components/icons/InfoIcons";
import { FloatingSymbolsCompact } from "@/components/FloatingSymbols";

const POINTS = [
  { icon: CheckIcon, title: "Testado", support: "5 testes antes de vender." },
  { icon: CameraIcon, title: "Estado real", support: "A consola que vês é a que recebes." },
  { icon: ShieldIcon, title: "Garantia", support: "Compra com tranquilidade." },
  { icon: MessageIcon, title: "Apoio", support: "Estamos aqui depois da compra." },
];

export function TrustHighlight() {
  return (
    <section className="relative mx-auto max-w-7xl overflow-hidden px-4 py-14 sm:px-6 lg:px-8">
      <FloatingSymbolsCompact />

      {/* Textura de fundo: fotografia real do produto, muito subtil, com glow azul
          de profundidade — nunca compete com os cartões. */}
      <div
        className="pointer-events-none absolute inset-y-0 right-0 hidden w-1/2 opacity-[0.06] sm:block"
        aria-hidden="true"
      >
        <Image
          src="/herophoto.png"
          alt=""
          fill
          className="object-contain object-right"
          sizes="50vw"
        />
      </div>
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: "radial-gradient(55% 60% at 82% 35%, rgba(22,119,255,0.12), transparent 70%)",
        }}
        aria-hidden="true"
      />

      <h2 className="relative max-w-xl text-2xl font-bold sm:text-3xl">
        Comprar usado não precisa ser uma aposta.
      </h2>

      <div className="relative mt-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {POINTS.map(({ icon: Icon, title, support }) => (
          <div key={title} className="card p-5">
            <Icon className="h-6 w-6 text-primary-light" />
            <p className="mt-3 text-sm font-bold uppercase tracking-wide">{title}</p>
            <p className="mt-1 text-sm text-text-muted">{support}</p>
          </div>
        ))}
      </div>

      <Link
        href="/como-testamos"
        className="relative mt-6 inline-block text-sm text-primary-light hover:underline"
      >
        Ver como testamos →
      </Link>
    </section>
  );
}
