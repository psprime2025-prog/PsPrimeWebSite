import { LockIcon, ShieldIcon, SupportIcon } from "@/components/icons/InfoIcons";

const ITEMS = [
  { icon: LockIcon, label: "Segurança" },
  { icon: ShieldIcon, label: "Garantia" },
  { icon: SupportIcon, label: "Suporte 24h" },
];

/** Assinatura de confiança sob os CTAs do hero — discreta, uma linha, nunca quebra em bloco. */
export function HeroTrustLine() {
  return (
    <div className="animate-fade-in-up mt-6 flex flex-nowrap items-center gap-2.5 text-[11px] text-text-muted sm:gap-5 sm:text-xs">
      {ITEMS.map((item, i) => (
        <span key={item.label} className="flex flex-nowrap items-center gap-2.5 sm:gap-5">
          {i > 0 && <span className="text-border">·</span>}
          <span className="flex items-center gap-1.5 whitespace-nowrap">
            <item.icon className="h-3.5 w-3.5 shrink-0 text-primary-light sm:h-4 sm:w-4" />
            {item.label}
          </span>
        </span>
      ))}
    </div>
  );
}
