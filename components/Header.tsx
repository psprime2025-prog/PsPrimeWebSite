import Link from "next/link";
import Image from "next/image";
import { CartButton } from "@/components/CartButton";
import { SearchBar } from "@/components/SearchBar";
import { ButtonLink } from "@/components/ui/Button";

const NAV_LINKS = [
  { href: "/catalogo", label: "Catálogo" },
  { href: "/catalogo?categoria=consolas", label: "Consolas" },
  { href: "/catalogo?categoria=comandos", label: "Comandos" },
  { href: "/catalogo?categoria=jogos", label: "Jogos" },
  { href: "/catalogo?categoria=acessorios", label: "Acessórios" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <Image src="/logo.svg" alt="PsPrime" width={40} height={40} priority />
          <span className="hidden text-lg font-bold tracking-tight sm:block">PsPrime</span>
        </Link>

        <nav className="hidden items-center gap-2 lg:flex">
          {NAV_LINKS.map((link) => (
            <ButtonLink key={link.href} href={link.href} variant="light" size="sm">
              {link.label}
            </ButtonLink>
          ))}
        </nav>

        <div className="ml-auto flex flex-1 items-center justify-end gap-3 sm:flex-initial">
          <div className="hidden flex-1 sm:block sm:max-w-xs">
            <SearchBar />
          </div>
          <CartButton />
        </div>
      </div>
      <div className="border-t border-border px-4 py-2 sm:hidden">
        <SearchBar />
      </div>
      <nav className="flex items-center gap-2 overflow-x-auto border-t border-border px-4 py-2.5 lg:hidden">
        {NAV_LINKS.map((link) => (
          <ButtonLink key={link.href} href={link.href} variant="light" size="sm" className="shrink-0">
            {link.label}
          </ButtonLink>
        ))}
      </nav>
    </header>
  );
}
