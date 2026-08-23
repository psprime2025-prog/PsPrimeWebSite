import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatPrice, formatDate, ORDER_STATUS_LABELS, PAYMENT_METHOD_LABELS } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function AdminEncomendasPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <div>
      <h1 className="text-2xl font-bold">Encomendas</h1>

      <div className="card mt-6 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-text-muted">
              <th className="p-3">Encomenda</th>
              <th className="p-3">Cliente</th>
              <th className="p-3">Data</th>
              <th className="p-3">Pagamento</th>
              <th className="p-3">Total</th>
              <th className="p-3">Estado</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-b border-border last:border-0">
                <td className="p-3 font-mono text-xs">#{o.id.slice(-8).toUpperCase()}</td>
                <td className="p-3">{o.guestName}</td>
                <td className="p-3 text-text-muted">{formatDate(o.createdAt)}</td>
                <td className="p-3 text-text-muted">{PAYMENT_METHOD_LABELS[o.paymentMethod]}</td>
                <td className="p-3">{formatPrice(o.total)}</td>
                <td className="p-3">
                  <span className="badge-condition">{ORDER_STATUS_LABELS[o.status]}</span>
                </td>
                <td className="p-3 text-right">
                  <Link href={`/admin/encomendas/${o.id}`} className="text-primary-light hover:underline">
                    Ver
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && (
          <p className="p-6 text-center text-text-muted">Ainda não há encomendas.</p>
        )}
      </div>
    </div>
  );
}
