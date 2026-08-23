import Link from "next/link";
import { STORE } from "@/lib/constants";

const LEGAL_LINKS = [
  { href: "/legal/termos", label: "Termos e Condições" },
  { href: "/legal/privacidade", label: "Política de Privacidade" },
  { href: "/legal/devolucoes", label: "Política de Devolução e Trocas" },
  { href: "/legal/cookies", label: "Política de Cookies" },
];

const INFO_LINKS = [
  { href: "/sobre", label: "Sobre Nós" },
  { href: "/contactos", label: "Contactos" },
  { href: "/faq", label: "FAQ" },
];

export function Footer() {
  return (
    <footer className="mt-16 border-t border-border bg-surface">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 py-12 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div>
          <h3 className="text-lg font-bold">PsPrime</h3>
          <p className="mt-2 text-sm text-text-muted">
            Consolas, comandos, jogos e acessórios PlayStation seminovos, testados e recondicionados
            pela nossa equipa.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-text">Informação</h4>
          <ul className="mt-3 space-y-2 text-sm text-text-muted">
            {INFO_LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="transition-colors hover:text-text">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-text">Legal</h4>
          <ul className="mt-3 space-y-2 text-sm text-text-muted">
            {LEGAL_LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="transition-colors hover:text-text">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-text">Contactos</h4>
          <ul className="mt-3 space-y-2 text-sm text-text-muted">
            <li>{STORE.address.street}</li>
            <li>
              {STORE.address.postalCode} {STORE.address.city}
            </li>
            <li>
              <a href={`mailto:${STORE.supportEmail}`} className="transition-colors hover:text-text">
                {STORE.supportEmail}
              </a>
            </li>
            <li>{STORE.supportPhone}</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border px-4 py-4 text-center text-xs text-text-muted sm:px-6 lg:px-8">
        © {new Date().getFullYear()} PsPrime. Todos os direitos reservados.
      </div>
    </footer>
  );
}
