"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { CATEGORIES_SEED } from "@/lib/constants";
import { GENERATION_LABELS, CONDITION_LABELS } from "@/lib/format";

const GENERATIONS = ["PS1", "PS2", "PS3", "PS4", "PS5"];
const CONDITIONS = ["EXCELENTE", "MUITO_BOM", "BOM"];

export function CatalogFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function updateParam(key: string, value: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete("pagina");
    router.push(`${pathname}?${params.toString()}`);
  }

  const activeCategoria = searchParams.get("categoria");
  const activeGeracao = searchParams.get("geracao");
  const activeCondicao = searchParams.get("condicao");

  return (
    <aside className="space-y-6">
      <div>
        <h3 className="mb-3 text-sm font-semibold">Categoria</h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => updateParam("categoria", null)}
            className={`badge-condition ${!activeCategoria ? "border-primary text-primary-light" : ""}`}
          >
            Todas
          </button>
          {CATEGORIES_SEED.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => updateParam("categoria", cat.slug)}
              className={`badge-condition ${activeCategoria === cat.slug ? "border-primary text-primary-light" : ""}`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold">Geração PlayStation</h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => updateParam("geracao", null)}
            className={`badge-condition ${!activeGeracao ? "border-primary text-primary-light" : ""}`}
          >
            Todas
          </button>
          {GENERATIONS.map((gen) => (
            <button
              key={gen}
              onClick={() => updateParam("geracao", gen)}
              className={`badge-condition ${activeGeracao === gen ? "border-primary text-primary-light" : ""}`}
            >
              {GENERATION_LABELS[gen]}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold">Condição</h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => updateParam("condicao", null)}
            className={`badge-condition ${!activeCondicao ? "border-primary text-primary-light" : ""}`}
          >
            Todas
          </button>
          {CONDITIONS.map((c) => (
            <button
              key={c}
              onClick={() => updateParam("condicao", c)}
              className={`badge-condition ${activeCondicao === c ? "border-primary text-primary-light" : ""}`}
            >
              {CONDITION_LABELS[c]}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold">Ordenar por</h3>
        <select
          className="input text-sm"
          defaultValue={searchParams.get("ordenar") ?? "recentes"}
          onChange={(e) => updateParam("ordenar", e.target.value)}
        >
          <option value="recentes">Mais recentes</option>
          <option value="preco-asc">Preço: menor para maior</option>
          <option value="preco-desc">Preço: maior para menor</option>
        </select>
      </div>
    </aside>
  );
}
