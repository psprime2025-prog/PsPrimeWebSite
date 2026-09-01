"use client";

import Link from "next/link";
import Image from "next/image";
import { Suspense, useState } from "react";
import { CartButton } from "@/components/CartButton";
import { SellButton } from "@/components/SellButton";
import { SearchBar } from "@/components/SearchBar";
import { HeaderNav } from "@/components/HeaderNav";
import { HamburgerMenu } from "@/components/HamburgerMenu";
import { SearchIcon } from "@/components/icons/InfoIcons";

export function Header() {
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-background/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-6 lg:grid lg:grid-cols-[auto_1fr_auto] lg:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <Image src="/logo.png" alt="PsPrime" width={40} height={40} priority className="rounded-full" />
          <span className="hidden text-lg font-bold tracking-tight sm:block">PsPrime</span>
        </Link>

        <nav className="hidden items-center justify-center gap-2 lg:flex">
          <Suspense fallback={null}>
            <HeaderNav />
          </Suspense>
        </nav>

        <div className="ml-auto flex flex-1 items-center justify-end gap-2 sm:flex-initial sm:gap-3">
          <div className="hidden flex-1 sm:block sm:max-w-xs">
            <SearchBar />
          </div>

          <CartButton />

          {/* Ações rápidas mobile — Vender e Pesquisar (Comprar/Contacto ficam no menu ☰) */}
          <div className="flex items-center gap-2 sm:hidden">
            <SellButton />
            <button
              type="button"
              onClick={() => setMobileSearchOpen((v) => !v)}
              aria-label="Pesquisar"
              aria-expanded={mobileSearchOpen}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] backdrop-blur-md transition-colors hover:bg-white/[0.06]"
            >
              <SearchIcon className="h-5 w-5" />
            </button>
          </div>

          <Suspense fallback={null}>
            <HamburgerMenu />
          </Suspense>
        </div>
      </div>

      {mobileSearchOpen && (
        <div className="border-t border-border px-4 py-2 sm:hidden">
          <SearchBar />
        </div>
      )}
    </header>
  );
}
