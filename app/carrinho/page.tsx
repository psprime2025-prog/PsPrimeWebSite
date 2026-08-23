"use client";

import Image from "next/image";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";
import { useCartStore } from "@/lib/cart-store";
import { useMounted } from "@/lib/use-mounted";
import { formatPrice, CONDITION_LABELS } from "@/lib/format";
import { calculateShippingCost, SHIPPING } from "@/lib/constants";
import { CheckoutSteps } from "@/components/checkout/CheckoutSteps";

export default function CarrinhoPage() {
  const { items, updateQuantity, removeItem, subtotal } = useCartStore();
  const mounted = useMounted();

  if (!mounted) return null;

  const sub = subtotal();
  const shipping = calculateShippingCost(sub);
  const total = sub + shipping;

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6">
        <h1 className="text-2xl font-bold">O teu carrinho está vazio</h1>
        <p className="mt-2 text-text-muted">Explora o nosso catálogo e encontra o teu próximo produto PlayStation.</p>
        <ButtonLink href="/catalogo" className="mt-6">
          Ver catálogo
        </ButtonLink>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold">Carrinho de compras</h1>

      <div className="mt-8">
        <CheckoutSteps current="carrinho" />
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.productId} className="card flex gap-4 p-4">
              <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-card bg-background">
                {item.image ? (
                  <Image src={item.image} alt={item.name} fill className="object-contain p-2" />
                ) : null}
              </div>
              <div className="flex flex-1 flex-col">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <Link href={`/produto/${item.slug}`} className="font-medium hover:text-primary-light">
                      {item.name}
                    </Link>
                    <p className="text-xs text-text-muted">{CONDITION_LABELS[item.condition]}</p>
                  </div>
                  <button
                    onClick={() => removeItem(item.productId)}
                    className="text-xs text-text-muted hover:text-text"
                    aria-label="Remover item"
                  >
                    Remover
                  </button>
                </div>
                <div className="mt-auto flex items-center justify-between">
                  <select
                    value={item.quantity}
                    onChange={(e) => updateQuantity(item.productId, Number(e.target.value))}
                    className="input w-20 py-1.5 text-sm"
                  >
                    {Array.from({ length: Math.min(item.stock, 10) }, (_, i) => i + 1).map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                  <span className="font-semibold">{formatPrice(item.price * item.quantity)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="card h-fit space-y-3 p-6">
          <h2 className="font-semibold">Resumo</h2>
          <div className="flex justify-between text-sm text-text-muted">
            <span>Subtotal</span>
            <span>{formatPrice(sub)}</span>
          </div>
          <div className="flex justify-between text-sm text-text-muted">
            <span>Portes de envio</span>
            <span>{shipping === 0 ? "Grátis" : formatPrice(shipping)}</span>
          </div>
          {shipping > 0 && (
            <p className="text-xs text-text-muted">
              Envio grátis a partir de {formatPrice(SHIPPING.freeShippingThreshold)}.
            </p>
          )}
          <div className="flex justify-between border-t border-border pt-3 text-lg font-bold">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
          <ButtonLink href="/checkout" className="mt-2 w-full">
            Continuar para o checkout
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}
