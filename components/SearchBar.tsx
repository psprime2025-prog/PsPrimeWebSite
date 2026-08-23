"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

interface SearchResult {
  id: string;
  name: string;
  slug: string;
  price: string;
  image: string | null;
}

export function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (query.trim().length < 2) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- limpa resultados ao apagar a pesquisa
      setResults([]);
      return;
    }
    const timeout = setTimeout(async () => {
      try {
        const res = await fetch(`/api/products/search?q=${encodeURIComponent(query)}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data.results ?? []);
          setOpen(true);
        }
      } catch {
        // pesquisa falhou silenciosamente — utilizador pode tentar de novo
      }
    }, 250);
    return () => clearTimeout(timeout);
  }, [query]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/catalogo?q=${encodeURIComponent(query.trim())}`);
      setOpen(false);
    }
  }

  return (
    <div ref={containerRef} className="relative w-full">
      <form onSubmit={handleSubmit}>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results.length > 0 && setOpen(true)}
          placeholder="Pesquisar produtos..."
          className="input py-2 text-sm"
          aria-label="Pesquisar produtos"
        />
      </form>
      {open && results.length > 0 && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 max-h-96 overflow-auto rounded-card border border-border bg-surface shadow-xl">
          {results.map((r) => (
            <Link
              key={r.id}
              href={`/produto/${r.slug}`}
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 border-b border-border px-3 py-2 last:border-b-0 hover:bg-background"
            >
              <span className="flex-1 truncate text-sm">{r.name}</span>
              <span className="text-sm font-medium text-primary-light">{r.price}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
