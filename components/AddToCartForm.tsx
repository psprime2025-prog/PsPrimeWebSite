"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/lib/cart-store";

interface Props {
  productId: string;
  name: string;
  slug: string;
  price: number;
  image: string | null;
  condition: string;
  stock: number;
}

export function AddToCartForm(props: Props) {
  const router = useRouter();
  const addItem = useCartStore((s) => s.addItem);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const outOfStock = props.stock <= 0;

  function handleAdd() {
    addItem(props, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  function handleBuyNow() {
    addItem(props, quantity);
    router.push("/carrinho");
  }

  if (outOfStock) {
    return (
      <button disabled className="btn-secondary w-full cursor-not-allowed opacity-60">
        Produto esgotado
      </button>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <label className="label mb-0" htmlFor="quantity">
          Quantidade
        </label>
        <select
          id="quantity"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          className="input w-20 py-1.5"
        >
          {Array.from({ length: Math.min(props.stock, 10) }, (_, i) => i + 1).map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
        <span className="text-xs text-text-muted">{props.stock} em stock</span>
      </div>
      <div className="flex flex-col gap-2 sm:flex-row">
        <button onClick={handleAdd} className="btn-secondary flex-1">
          {added ? "Adicionado ✓" : "Adicionar ao carrinho"}
        </button>
        <button onClick={handleBuyNow} className="btn-primary flex-1">
          Comprar agora
        </button>
      </div>
    </div>
  );
}
