"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { useCartStore } from "@/lib/cart-store";
import { CheckIcon } from "@/components/icons/InfoIcons";

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
    router.push("/checkout");
  }

  if (outOfStock) {
    return (
      <Button disabled variant="secondary" className="w-full">
        Produto esgotado
      </Button>
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
      <div className="flex flex-col items-stretch gap-2 sm:items-center">
        <Button onClick={handleBuyNow} variant="primary" size="lg" className="w-full">
          Comprar agora
        </Button>
        <Button onClick={handleAdd} variant="outline" size="sm" className="sm:self-center">
          {added ? (
            <span className="inline-flex items-center gap-1.5">
              <CheckIcon className="h-4 w-4 shrink-0" />
              Adicionado
            </span>
          ) : (
            "+ Adicionar ao carrinho"
          )}
        </Button>
      </div>
    </div>
  );
}
