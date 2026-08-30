"use client";

import { usePathname } from "next/navigation";
import { ButtonLink } from "@/components/ui/Button";

const NAV_LINKS = [
  { href: "/catalogo", label: "Comprar" },
  { href: "/vender", label: "Vender" },
  { href: "/contactos", label: "Contacto" },
];

/** Navegação principal do header (desktop) — pills "glass" ao estilo Control Center. */
export function HeaderNav() {
  const pathname = usePathname();

  return (
    <>
      {NAV_LINKS.map((link) => {
        const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
        return (
          <ButtonLink
            key={link.href}
            href={link.href}
            variant="outline"
            size="sm"
            className={isActive ? "btn-glass--active" : ""}
          >
            {link.label}
          </ButtonLink>
        );
      })}
    </>
  );
}
