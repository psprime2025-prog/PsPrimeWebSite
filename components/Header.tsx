import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";
import { CartButton } from "@/components/CartButton";
import { SearchBar } from "@/components/SearchBar";
import { CatalogMenu } from "@/components/CatalogMenu";
import { MobileMenu } from "@/components/MobileMenu";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <Image src="/logo.png" alt="PsPrime" width={40} height={40} priority className="rounded-full" />
          <span className="hidden text-lg font-bold tracking-tight sm:block">PsPrime</span>
        </Link>

        <nav className="hidden lg:flex">
          <Suspense fallback={null}>
            <CatalogMenu />
          </Suspense>
        </nav>

        <div className="ml-auto flex flex-1 items-center justify-end gap-3 sm:flex-initial">
          <div className="hidden flex-1 sm:block sm:max-w-xs">
            <SearchBar />
          </div>
          <CartButton />
          <Suspense fallback={null}>
            <MobileMenu />
          </Suspense>
        </div>
      </div>
      <div className="border-t border-border px-4 py-2 sm:hidden">
        <SearchBar />
      </div>
    </header>
  );
}
