import Image from "next/image";
import { ShieldIcon, CheckIcon, CameraIcon } from "@/components/icons/InfoIcons";

/**
 * Hero exclusivo para mobile (<768px) — desktop/tablet usam o bloco original
 * em app/page.tsx, inalterado. Composição inspirada em apps premium: produto
 * grande sem moldura de card, texto alinhado à esquerda, título com quebra
 * de cor a meio. Os CTAs já não vivem aqui — passaram para a barra fixa
 * (ver components/MobileStickyCta.tsx).
 *
 * Classes próprias, sem tocar em .hero-cta-primary/.hero-cta-secondary
 * (usadas pelo HeroCTAs do desktop) nem em app/globals.css.
 */

const TRUST_CARDS = [
  { icon: CheckIcon, title: "Testado", subtitle: "5 testes de qualidade" },
  { icon: ShieldIcon, title: "Garantia", subtitle: "Garantia legal incluída" },
  { icon: CameraIcon, title: "Estado real", subtitle: "Fotos reais do produto" },
];

/* Altura da barra fixa de CTAs (ver MobileStickyCta) + margem de segurança,
 * para o conteúdo do Hero nunca ficar escondido por baixo dela. */
const STICKY_BAR_CLEARANCE = "calc(env(safe-area-inset-bottom) + 9rem)";

export function HeroMobile() {
  return (
    <div
      className="relative px-4 pt-8 sm:px-6 md:hidden"
      style={{ paddingBottom: STICKY_BAR_CLEARANCE }}
    >
      <span className="badge-condition mb-5 inline-flex w-fit items-center gap-1.5 border-primary/40 bg-transparent text-primary-light">
        <ShieldIcon className="h-3.5 w-3.5" />
        Produtos seminovos testados
      </span>

      <h1 className="max-w-sm text-[2.1rem] font-bold leading-[1.15] tracking-tight">
        <span className="block text-white">O teu mundo PlayStation.</span>
        <span className="block text-primary-light">Seminovo e</span>
        <span className="block text-primary-light">de confiança.</span>
      </h1>

      <p className="mt-4 max-w-xs text-sm leading-relaxed text-text-muted">
        Consolas, comandos, jogos e acessórios testados e preparados pela nossa equipa antes de
        chegarem até ti.
      </p>

      <div
        className="animate-fade-in-up relative mt-6 h-80 w-full sm:h-96"
        style={{
          maskImage:
            "linear-gradient(to bottom, transparent 0%, black 16%, black 84%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent 0%, black 16%, black 84%, transparent 100%)",
        }}
      >
        <Image
          src="/hero-photo.png"
          alt="PsPrime — consola PlayStation testada e preparada"
          fill
          priority
          className="object-contain"
          sizes="100vw"
        />
      </div>

      <div className="mt-2 grid grid-cols-3 gap-2.5">
        {TRUST_CARDS.map(({ icon: Icon, title, subtitle }) => (
          <div
            key={title}
            className="rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-center"
          >
            <Icon className="mx-auto h-5 w-5 text-primary-light" />
            <p className="mt-2 text-xs font-semibold">{title}</p>
            <p className="mt-0.5 text-[10px] leading-tight text-text-muted">{subtitle}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
