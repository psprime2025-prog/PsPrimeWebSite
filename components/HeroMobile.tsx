import Image from "next/image";
import { HeroCTAs } from "@/components/HeroCTAs";
import { HeroTrustLine } from "@/components/HeroTrustLine";
import { CheckIcon, ShieldIcon, StarIcon } from "@/components/icons/InfoIcons";

const TRUST_CHIPS = [
  { icon: CheckIcon, label: "Testado" },
  { icon: ShieldIcon, label: "Garantia" },
  { icon: StarIcon, label: "Estado real" },
];

/**
 * Hero exclusivo para mobile (<768px) — desktop/tablet usam o bloco original
 * em app/page.tsx, inalterado. Ver instrução "Hero: evolução visual MOBILE,
 * preservação total do DESKTOP". Reutiliza HeroCTAs/HeroTrustLine (já são
 * componentes exclusivos do Hero) e o mesmo asset /hero-photo.jpg — sem
 * inventar produto novo.
 */
export function HeroMobile() {
  return (
    <div className="relative px-4 py-16 sm:px-6 md:hidden">
      <span className="badge-condition mb-4 inline-flex w-fit items-center gap-1.5 border-success/40 text-success">
        Produtos seminovos testados
      </span>
      <h1 className="text-4xl font-bold tracking-tight">
        O teu mundo PlayStation, <span className="text-primary-light">seminovo</span> e de
        confiança.
      </h1>
      <p className="mt-4 text-text-muted">
        Consolas, comandos, jogos e acessórios testados e preparados pela nossa equipa.
      </p>

      <div className="mt-8">
        <HeroCTAs />
      </div>
      <HeroTrustLine />

      <div className="mt-14 flex flex-col items-center">
        <div className="w-[70%] max-w-[300px] overflow-hidden rounded-2xl shadow-[0_28px_60px_-24px_rgba(0,0,0,0.6)]">
          <Image
            src="/hero-photo.jpg"
            alt="PsPrime — consola PlayStation testada e preparada"
            width={1600}
            height={1262}
            priority
            className="h-auto w-full object-cover"
            sizes="70vw"
          />
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          {TRUST_CHIPS.map(({ icon: Icon, label }) => (
            <span
              key={label}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5 text-xs text-text-muted backdrop-blur-md"
            >
              <Icon className="h-3 w-3 shrink-0 text-primary-light" />
              {label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
