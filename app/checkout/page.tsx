"use client";

import { useMemo, useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { Button, ButtonLink } from "@/components/ui/Button";
import { useCartStore } from "@/lib/cart-store";
import { useMounted } from "@/lib/use-mounted";
import { getStripe } from "@/lib/stripe-client";
import { formatPrice } from "@/lib/format";
import { calculateShippingCost } from "@/lib/constants";
import { PaymentStep } from "@/components/checkout/PaymentStep";
import { CheckoutSteps } from "@/components/checkout/CheckoutSteps";
import { CardIcon } from "@/components/icons/InfoIcons";

type PaymentMethod = "CARTAO" | "MULTIBANCO" | "MBWAY";
type Step = "dados" | "pagamento" | "confirmar";

interface FormState {
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  street: string;
  postalCode: string;
  city: string;
  paymentMethod: PaymentMethod;
}

const PAYMENT_OPTIONS: { value: PaymentMethod; label: string; description: string }[] = [
  { value: "CARTAO", label: "Cartão", description: "Crédito ou débito" },
  { value: "MULTIBANCO", label: "Multibanco", description: "Referência para pagar em ATM/homebanking" },
  { value: "MBWAY", label: "MB WAY", description: "Aprovação pela app no telemóvel" },
];

export default function CheckoutPage() {
  const { items, subtotal } = useCartStore();
  const mounted = useMounted();
  const [step, setStep] = useState<Step>("dados");
  const [form, setForm] = useState<FormState>({
    guestName: "",
    guestEmail: "",
    guestPhone: "",
    street: "",
    postalCode: "",
    city: "",
    paymentMethod: "CARTAO",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);

  const sub = subtotal();
  const shipping = calculateShippingCost(sub);
  const total = sub + shipping;

  const stripePromise = useMemo(() => getStripe(), []);

  function handleDadosSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStep("pagamento");
  }

  async function handlePagamentoSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Não foi possível iniciar o checkout.");
        setLoading(false);
        return;
      }
      setClientSecret(data.clientSecret);
      setOrderId(data.orderId);
      setStep("confirmar");
    } catch {
      setError("Erro de rede. Tenta novamente.");
    } finally {
      setLoading(false);
    }
  }

  if (!mounted) return null;

  if (items.length === 0 && step === "dados") {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6">
        <h1 className="text-2xl font-bold">O teu carrinho está vazio</h1>
        <ButtonLink href="/catalogo" className="mt-6">
          Ver catálogo
        </ButtonLink>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold">Checkout</h1>
      <p className="mt-2 flex items-center gap-1.5 text-sm text-text-muted">
        <CardIcon className="h-4 w-4 shrink-0 text-primary-light" />
        Podes pagar com: Cartão · MB WAY · Multibanco
      </p>

      <div className="mt-8">
        <CheckoutSteps current={step} />
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_320px]">
        <div>
          {step === "dados" && (
            <form onSubmit={handleDadosSubmit} className="card space-y-5 p-6">
              <div>
                <h2 className="mb-3 font-semibold">Dados de entrega</h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className="label">Nome completo</label>
                    <input
                      required
                      className="input"
                      value={form.guestName}
                      onChange={(e) => setForm({ ...form, guestName: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="label">Email</label>
                    <input
                      required
                      type="email"
                      className="input"
                      value={form.guestEmail}
                      onChange={(e) => setForm({ ...form, guestEmail: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="label">Telemóvel</label>
                    <input
                      required
                      type="tel"
                      placeholder="9XXXXXXXX"
                      className="input"
                      value={form.guestPhone}
                      onChange={(e) => setForm({ ...form, guestPhone: e.target.value })}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="label">Morada</label>
                    <input
                      required
                      className="input"
                      value={form.street}
                      onChange={(e) => setForm({ ...form, street: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="label">Código postal</label>
                    <input
                      required
                      placeholder="0000-000"
                      className="input"
                      value={form.postalCode}
                      onChange={(e) => setForm({ ...form, postalCode: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="label">Cidade</label>
                    <input
                      required
                      className="input"
                      value={form.city}
                      onChange={(e) => setForm({ ...form, city: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <Button type="submit" variant="primary" className="w-full">
                Continuar para pagamento
              </Button>
            </form>
          )}

          {step === "pagamento" && (
            <form onSubmit={handlePagamentoSubmit} className="card space-y-5 p-6">
              <div>
                <h2 className="mb-3 font-semibold">Método de pagamento</h2>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  {PAYMENT_OPTIONS.map((opt) => (
                    <label
                      key={opt.value}
                      className={`card cursor-pointer p-4 text-sm ${
                        form.paymentMethod === opt.value ? "border-primary" : ""
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={opt.value}
                        checked={form.paymentMethod === opt.value}
                        onChange={() => setForm({ ...form, paymentMethod: opt.value })}
                        className="sr-only"
                      />
                      <p className="font-medium">{opt.label}</p>
                      <p className="text-xs text-text-muted">{opt.description}</p>
                    </label>
                  ))}
                </div>
              </div>

              {error && <p className="text-sm text-red-400">{error}</p>}

              <div className="flex gap-3">
                <Button type="button" variant="secondary" onClick={() => setStep("dados")}>
                  Voltar
                </Button>
                <Button type="submit" disabled={loading} variant="primary" className="flex-1">
                  {loading ? "A processar..." : "Continuar para confirmação"}
                </Button>
              </div>
            </form>
          )}

          {step === "confirmar" && clientSecret && orderId && (
            <div className="space-y-4">
              <div className="card p-6">
                <h2 className="font-semibold">Confirmar e pagar</h2>
                <p className="mt-1 text-sm text-text-muted">
                  Revê o total e finaliza a tua compra.
                </p>
                <p className="mt-3 text-2xl font-bold text-primary-light">{formatPrice(total)}</p>
              </div>
              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <PaymentStep orderId={orderId} paymentMethod={form.paymentMethod} total={total} />
              </Elements>
            </div>
          )}
        </div>

        <div className="card h-fit space-y-3 p-6">
          <h2 className="font-semibold">Resumo</h2>
          {items.map((item) => (
            <div key={item.productId} className="flex justify-between text-sm text-text-muted">
              <span className="truncate pr-2">
                {item.name} × {item.quantity}
              </span>
              <span>{formatPrice(item.price * item.quantity)}</span>
            </div>
          ))}
          <div className="flex justify-between border-t border-border pt-3 text-sm text-text-muted">
            <span>Subtotal</span>
            <span>{formatPrice(sub)}</span>
          </div>
          <div className="flex justify-between text-sm text-text-muted">
            <span>Portes</span>
            <span>Grátis</span>
          </div>
          <div className="flex justify-between border-t border-border pt-3 text-lg font-bold">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
