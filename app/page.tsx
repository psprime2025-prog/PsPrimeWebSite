import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { FloatingSymbols } from "@/components/FloatingSymbols";
import { HeroCTAs } from "@/components/HeroCTAs";
import { HeroTrustLine } from "@/components/HeroTrustLine";
import { HeroMobile } from "@/components/HeroMobile";
import { MobileStickyCta } from "@/components/MobileStickyCta";
import { ConsolesForSale } from "@/components/home/ConsolesForSale";
import { TrustHighlight } from "@/components/home/TrustHighlight";
import { HowWePrepare } from "@/components/home/HowWePrepare";
import { SellTeaser } from "@/components/home/SellTeaser";
import { Reviews } from "@/components/home/Reviews";
import { FaqTeaser } from "@/components/home/FaqTeaser";
import { AboutBlurb } from "@/components/home/AboutBlurb";

export const dynamic = "force-dynamic";

async function getConsoles() {
  return prisma.product.findMany({
    where: { active: true, category: { slug: "consolas" } },
    include: { images: { orderBy: { order: "asc" }, take: 1 } },
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
    take: 8,
  });
}

export default async function HomePage() {
  const consoles = await getConsoles();

  return (
    <div>
      <section className="relative overflow-hidden border-b border-border bg-surface">
        <FloatingSymbols />

        {/* Hero mobile (<768px) — ver components/HeroMobile.tsx. Bloco desktop/tablet abaixo inalterado. */}
        <HeroMobile />

        {/* Hero desktop/tablet (>=768px) — inalterado, apenas passou de "grid" para "hidden md:grid" */}
        <div className="relative mx-auto hidden max-w-7xl grid-cols-1 gap-8 px-4 py-16 sm:px-6 md:grid lg:grid-cols-2 lg:px-8">
          <div className="relative z-10 flex flex-col justify-center">
            <span className="badge-condition mb-4 inline-flex w-fit items-center gap-1.5 border-success/40 text-success">
              Produtos seminovos testados
            </span>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              O teu mundo PlayStation, <span className="text-primary-light">seminovo</span> e de
              confiança.
            </h1>
            <p className="mt-4 max-w-lg text-text-muted">
              Consolas, comandos, jogos e acessórios de todas as gerações PlayStation, testados e
              recondicionados pela nossa equipa antes de chegarem até ti.
            </p>
            <div className="mt-8">
              <HeroCTAs />
            </div>
            <HeroTrustLine />
          </div>

          <div className="relative min-h-[320px] overflow-hidden rounded-card lg:min-h-[480px]">
            <Image
              src="/hero-photo.jpg"
              alt="PsPrime — universo PlayStation"
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            {/* Overlay escuro para profundidade + transição suave para o lado do texto */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/50 to-transparent" />
            <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-surface to-transparent lg:hidden" />
            <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-28 bg-gradient-to-r from-surface to-transparent lg:block" />
          </div>
        </div>
      </section>

      <ConsolesForSale products={consoles.map((p) => ({ ...p, price: p.price.toString() }))} />
      <TrustHighlight />
      <HowWePrepare />
      <SellTeaser />
      <Reviews />
      <FaqTeaser />
      <AboutBlurb />

      {/* Espaço para a barra de CTAs fixa (mobile) não tapar o rodapé */}
      <div className="h-28 md:hidden" aria-hidden="true" />

      <MobileStickyCta />
    </div>
  );
}
