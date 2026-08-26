"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SessionProvider, signOut } from "next-auth/react";

const NAV = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/produtos", label: "Produtos" },
  { href: "/admin/categorias", label: "Categorias" },
  { href: "/admin/encomendas", label: "Encomendas" },
  { href: "/admin/avaliacoes", label: "Avaliações" },
];

function AdminNav() {
  const pathname = usePathname();
  return (
    <aside className="w-full shrink-0 border-b border-border bg-surface p-4 lg:w-56 lg:border-b-0 lg:border-r lg:p-6">
      <Link href="/" className="mb-6 hidden text-lg font-bold lg:block">
        PsPrime
      </Link>
      <nav className="flex gap-2 overflow-x-auto lg:flex-col lg:gap-1">
        {NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`shrink-0 rounded-full px-3 py-2 text-sm transition-colors ${
              pathname === item.href
                ? "bg-primary/10 text-primary-light"
                : "text-text-muted hover:text-text"
            }`}
          >
            {item.label}
          </Link>
        ))}
        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="shrink-0 rounded-full px-3 py-2 text-left text-sm text-text-muted transition-colors hover:text-text"
        >
          Terminar sessão
        </button>
      </nav>
    </aside>
  );
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <div className="flex min-h-[70vh] flex-col lg:flex-row">
        <AdminNav />
        <div className="flex-1 p-4 lg:p-8">{children}</div>
      </div>
    </SessionProvider>
  );
}
