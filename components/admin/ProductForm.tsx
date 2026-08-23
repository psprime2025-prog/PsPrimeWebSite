"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { CONDITION_LABELS, GENERATION_LABELS, STORAGE_LABELS, MODELS_BY_GENERATION } from "@/lib/format";

interface Category {
  id: string;
  name: string;
}

interface ProductFormData {
  id?: string;
  name: string;
  description: string;
  price: number | string;
  stock: number | string;
  condition: string;
  psGeneration: string;
  model: string | null;
  storageCapacity: string | null;
  categoryId: string;
  featured: boolean;
  active: boolean;
  images: { url: string }[];
}

export function ProductForm({
  categories,
  product,
  action,
}: {
  categories: Category[];
  product?: ProductFormData;
  action: (formData: FormData) => void;
}) {
  const [imageUrls, setImageUrls] = useState(product?.images.map((i) => i.url).join("\n") ?? "");
  const [psGeneration, setPsGeneration] = useState(product?.psGeneration ?? "NA");
  const modelOptions = MODELS_BY_GENERATION[psGeneration] ?? [];

  if (categories.length === 0) {
    return (
      <div className="card max-w-2xl space-y-3 p-6">
        <p className="font-medium text-yellow-200">Ainda não existem categorias.</p>
        <p className="text-sm text-text-muted">
          Precisas de criar pelo menos uma categoria (ex: Consolas, Comandos, Jogos, Acessórios)
          antes de conseguires adicionar produtos.
        </p>
        <Link href="/admin/categorias" className="text-sm text-primary-light hover:underline">
          Ir para Categorias →
        </Link>
      </div>
    );
  }

  return (
    <form action={action} className="card max-w-2xl space-y-4 p-6">
      <div>
        <label className="label">Nome</label>
        <input required name="name" defaultValue={product?.name} className="input" />
      </div>

      <div>
        <label className="label">Descrição</label>
        <textarea
          required
          name="description"
          rows={5}
          defaultValue={product?.description}
          className="input"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">Preço (€)</label>
          <input
            required
            type="number"
            step="0.01"
            min="0"
            name="price"
            defaultValue={product?.price}
            className="input"
          />
        </div>
        <div>
          <label className="label">Stock</label>
          <input
            required
            type="number"
            min="0"
            name="stock"
            defaultValue={product?.stock}
            className="input"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">Categoria</label>
          <select required name="categoryId" defaultValue={product?.categoryId} className="input">
            <option value="">Seleciona...</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">Geração PlayStation</label>
          <select
            required
            name="psGeneration"
            value={psGeneration}
            onChange={(e) => setPsGeneration(e.target.value)}
            className="input"
          >
            {Object.entries(GENERATION_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">Modelo</label>
          <select
            name="model"
            defaultValue={product?.model ?? ""}
            disabled={modelOptions.length === 0}
            className="input disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">
              {modelOptions.length === 0 ? "Não aplicável" : "Seleciona..."}
            </option>
            {modelOptions.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">Armazenamento</label>
          <select name="storageCapacity" defaultValue={product?.storageCapacity ?? ""} className="input">
            <option value="">Não aplicável</option>
            {Object.entries(STORAGE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="label">Condição</label>
        <select required name="condition" defaultValue={product?.condition ?? "BOM"} className="input">
          {Object.entries(CONDITION_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="label">URLs das imagens (uma por linha)</label>
        <textarea
          name="imageUrls"
          rows={4}
          value={imageUrls}
          onChange={(e) => setImageUrls(e.target.value)}
          placeholder="https://.../imagem1.jpg"
          className="input font-mono text-xs"
        />
        <p className="mt-1 text-xs text-text-muted">
          Carrega as imagens no Supabase Storage e cola aqui os URLs públicos.
        </p>
      </div>

      <div className="flex gap-6">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="featured" defaultChecked={product?.featured} />
          Produto em destaque
        </label>
        {product && (
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="active" defaultChecked={product?.active} />
            Ativo (visível na loja)
          </label>
        )}
      </div>

      <Button type="submit" variant="primary" className="w-full">
        Guardar produto
      </Button>
    </form>
  );
}
