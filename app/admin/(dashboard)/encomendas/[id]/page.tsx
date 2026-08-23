import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import {
  formatPrice,
  formatDate,
  ORDER_STATUS_LABELS,
  PAYMENT_METHOD_LABELS,
} from "@/lib/format";
import { updateOrderStatus } from "@/app/admin/actions";

export const dynamic = "force-dynamic";

export default async function AdminEncomendaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true, address: true, payment: true },
  });

  if (!order) notFound();

  const updateStatusWithId = updateOrderStatus.bind(null, order.id);

  return (
    <div>
      <h1 className="text-2xl font-bold">Encomenda #{order.id.slice(-8).toUpperCase()}</h1>
      <p className="text-sm text-text-muted">{formatDate(order.createdAt)}</p>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <div className="card p-6">
            <h2 className="mb-3 font-semibold">Itens</h2>
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between border-b border-border py-2 text-sm last:border-0">
                <span>
                  {item.productName} × {item.quantity}
                </span>
                <span>{formatPrice(item.subtotal)}</span>
              </div>
            ))}
            <div className="mt-3 flex justify-between text-sm text-text-muted">
              <span>Portes</span>
              <span>{formatPrice(order.shippingCost)}</span>
            </div>
            <div className="mt-2 flex justify-between text-lg font-bold">
              <span>Total</span>
              <span>{formatPrice(order.total)}</span>
            </div>
          </div>

          <div className="card p-6">
            <h2 className="mb-3 font-semibold">Cliente</h2>
            <p className="text-sm">{order.guestName}</p>
            <p className="text-sm text-text-muted">{order.guestEmail}</p>
            <p className="text-sm text-text-muted">{order.guestPhone}</p>
          </div>

          {order.address && (
            <div className="card p-6">
              <h2 className="mb-3 font-semibold">Entrega</h2>
              <p className="text-sm text-text-muted">
                {order.address.street}, {order.address.postalCode} {order.address.city},{" "}
                {order.address.country}
              </p>
            </div>
          )}

          <div className="card p-6">
            <h2 className="mb-3 font-semibold">Pagamento</h2>
            <p className="text-sm text-text-muted">
              Método: {PAYMENT_METHOD_LABELS[order.paymentMethod]}
            </p>
            {order.payment && (
              <>
                <p className="text-sm text-text-muted">Estado Stripe: {order.payment.status}</p>
                {order.payment.multibancoReference && (
                  <p className="text-sm text-text-muted">
                    Multibanco: Entidade {order.payment.multibancoEntity} / Referência{" "}
                    {order.payment.multibancoReference}
                  </p>
                )}
              </>
            )}
          </div>
        </div>

        <div className="card h-fit space-y-4 p-6">
          <h2 className="font-semibold">Estado da encomenda</h2>
          <form action={updateStatusWithId} className="space-y-3">
            <select name="status" defaultValue={order.status} className="input">
              {Object.entries(ORDER_STATUS_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
            <button type="submit" className="btn-primary w-full">
              Atualizar estado
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
