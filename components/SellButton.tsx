import Link from "next/link";
import { TagIcon } from "@/components/icons/InfoIcons";

/** Ação "Vender" no header mobile — ver Bloco I. */
export function SellButton() {
  return (
    <Link
      href="/vender"
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] backdrop-blur-md transition-all duration-200 ease-out hover:border-primary/40 hover:bg-white/[0.06] active:scale-[0.97]"
      aria-label="Vender consola"
    >
      <TagIcon className="h-5 w-5" />
    </Link>
  );
}
