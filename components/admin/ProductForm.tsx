"use client";

import { useState } from "react";
import { CONDITION_LABELS, GENERATION_LABELS } from "@/lib/format";

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
          <select required name="psGeneration" defaultValue={product?.psGeneration ?? "NA"} className="input">
            {Object.entries(GENERATION_LABELS).map(([value, label]) => (
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

      <button type="submit" className="btn-primary w-full">
        Guardar produto
      </button>
    </form>
  );
}
