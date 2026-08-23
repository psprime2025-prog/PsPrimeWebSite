"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import type Stripe from "stripe";
import { Button } from "@/components/ui/Button";

interface Props {
  orderId: string;
  paymentMethod: "CARTAO" | "MULTIBANCO" | "MBWAY";
  total: number;
}

interface MultibancoDetails {
  entity?: string | null;
  reference?: string | null;
  amount_remaining?: number | null;
}

export function PaymentStep({ orderId, paymentMethod, total }: Props) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [multibanco, setMultibanco] = useState<MultibancoDetails | null>(null);
  const [awaitingMbWay, setAwaitingMbWay] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) return;

    setSubmitting(true);
    setError(null);

    const { error: submitError } = await elements.submit();
    if (submitError) {
      setError(submitError.message ?? "Não foi possível validar os dados de pagamento.");
      setSubmitting(false);
      return;
    }

    const returnUrl = `${window.location.origin}/encomenda/sucesso/${orderId}`;

    const { error: confirmError, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: returnUrl },
      redirect: "if_required",
    });

    setSubmitting(false);

    if (confirmError) {
      setError(confirmError.message ?? "Não foi possível confirmar o pagamento.");
      return;
    }

    if (!paymentIntent) return;

    if (paymentIntent.status === "succeeded") {
      router.push(`/encomenda/sucesso/${orderId}`);
      return;
    }

    const nextAction = paymentIntent.next_action as unknown as
      | Stripe.PaymentIntent.NextAction
      | undefined;

    if (nextAction?.type === "multibanco_display_details" && nextAction.multibanco_display_details) {
      setMultibanco(nextAction.multibanco_display_details);
      return;
    }

    if (paymentMethod === "MBWAY") {
      setAwaitingMbWay(true);
      pollOrderStatus();
      return;
    }

    router.push(`/encomenda/sucesso/${orderId}`);
  }

  function pollOrderStatus() {
    const interval = setInterval(async () => {
      const res = await fetch(`/api/orders/${orderId}/status`);
      if (!res.ok) return;
      const data = await res.json();
      if (data.status === "PAGO") {
        clearInterval(interval);
        router.push(`/encomenda/sucesso/${orderId}`);
      }
    }, 3000);
    setTimeout(() => clearInterval(interval), 5 * 60 * 1000);
  }

  if (multibanco) {
    return (
      <div className="card space-y-3 p-6">
        <h2 className="text-lg font-semibold">Referência Multibanco gerada</h2>
        <p className="text-sm text-text-muted">
          Usa os dados abaixo para pagar num terminal Multibanco ou homebanking. A referência é
          válida durante aproximadamente 7 dias.
        </p>
        <div className="grid grid-cols-3 gap-3 rounded-card border border-border bg-background p-4 text-center">
          <div>
            <p className="text-xs text-text-muted">Entidade</p>
            <p className="font-mono text-lg font-semibold">{multibanco.entity}</p>
          </div>
          <div>
            <p className="text-xs text-text-muted">Referência</p>
            <p className="font-mono text-lg font-semibold">{multibanco.reference}</p>
          </div>
          <div>
            <p className="text-xs text-text-muted">Valor</p>
            <p className="font-mono text-lg font-semibold">{total.toFixed(2)} €</p>
          </div>
        </div>
        <p className="text-sm text-text-muted">
          Enviámos também esta referência para o teu email. Assim que o pagamento for confirmado,
          a tua encomenda passa automaticamente a &ldquo;Pago&rdquo;.
        </p>
      </div>
    );
  }

  if (awaitingMbWay) {
    return (
      <div className="card space-y-3 p-6 text-center">
        <h2 className="text-lg font-semibold">A aguardar confirmação no teu telemóvel</h2>
        <p className="text-sm text-text-muted">
          Enviámos um pedido de pagamento para a app MB WAY. Abre a app e aprova o pagamento de{" "}
          {total.toFixed(2)} €.
        </p>
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="card space-y-4 p-6">
      <PaymentElement />
      {error && <p className="text-sm text-red-400">{error}</p>}
      <Button type="submit" disabled={!stripe || submitting} variant="primary" className="w-full">
        {submitting ? "A processar..." : "Finalizar compra"}
      </Button>
    </form>
  );
}
