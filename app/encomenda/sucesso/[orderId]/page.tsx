import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatPrice, ORDER_STATUS_LABELS, PAYMENT_METHOD_LABELS } from "@/lib/format";
import { ClearCartOnMount } from "@/components/checkout/ClearCartOnMount";

export const dynamic = "force-dynamic";

export default async function OrderSuccessPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true, address: true, payment: true },
  });

  if (!order) notFound();

  const showMultibanco =
    order.paymentMethod === "MULTIBANCO" &&
    order.status === "PENDENTE" &&
    order.payment?.multibancoReference;

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <ClearCartOnMount />
      <div className="text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-success/10 text-success">
          ✓
        </div>
        <h1 className="mt-4 text-2xl font-bold">Encomenda recebida!</h1>
        <p className="mt-2 text-text-muted">
          Encomenda <strong>#{order.id.slice(-8).toUpperCase()}</strong> — enviámos um email de
          confirmação para {order.guestEmail}.
        </p>
      </div>

      {showMultibanco && (
        <div className="card mt-8 space-y-3 p-6">
          <h2 className="font-semibold">Referência Multibanco</h2>
          <div className="grid grid-cols-3 gap-3 rounded-card border border-border bg-background p-4 text-center">
            <div>
              <p className="text-xs text-text-muted">Entidade</p>
              <p className="font-mono text-lg font-semibold">{order.payment?.multibancoEntity}</p>
            </div>
            <div>
              <p className="text-xs text-text-muted">Referência</p>
              <p className="font-mono text-lg font-semibold">{order.payment?.multibancoReference}</p>
            </div>
            <div>
              <p className="text-xs text-text-muted">Valor</p>
              <p className="font-mono text-lg font-semibold">{formatPrice(order.total)}</p>
            </div>
          </div>
          <p className="text-xs text-text-muted">
            Válida durante aproximadamente 7 dias. O estado da encomenda atualiza-se
            automaticamente após o pagamento.
          </p>
        </div>
      )}

      <div className="card mt-8 space-y-3 p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Detalhes da encomenda</h2>
          <span className="badge-condition">{ORDER_STATUS_LABELS[order.status]}</span>
        </div>
        {order.items.map((item) => (
          <div key={item.id} className="flex justify-between text-sm text-text-muted">
            <span>
              {item.productName} × {item.quantity}
            </span>
            <span>{formatPrice(item.subtotal)}</span>
          </div>
        ))}
        <div className="flex justify-between border-t border-border pt-3 text-sm text-text-muted">
          <span>Portes</span>
          <span>{formatPrice(order.shippingCost)}</span>
        </div>
        <div className="flex justify-between border-t border-border pt-3 text-lg font-bold">
          <span>Total</span>
          <span>{formatPrice(order.total)}</span>
        </div>
        <p className="text-sm text-text-muted">
          Pagamento: {PAYMENT_METHOD_LABELS[order.paymentMethod]}
        </p>
        <p className="text-sm text-text-muted">
          Entrega: {order.address?.street}, {order.address?.postalCode} {order.address?.city}
        </p>
      </div>

      <div className="mt-8 text-center">
        <Link href="/catalogo" className="btn-secondary">
          Continuar a comprar
        </Link>
      </div>
    </div>
  );
}
