import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatDate, SELL_REQUEST_STATUS_LABELS } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function AdminAvaliacoesPage() {
  const sellRequests = await prisma.sellRequest.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <div>
      <h1 className="text-2xl font-bold">Avaliações</h1>
      <p className="mt-1 text-sm text-text-muted">Pedidos de venda recebidos em /vender.</p>

      <div className="card mt-6 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-text-muted">
              <th className="p-3">Nome</th>
              <th className="p-3">Contacto</th>
              <th className="p-3">Modelo</th>
              <th className="p-3">Estado</th>
              <th className="p-3">Data</th>
              <th className="p-3">Status</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {sellRequests.map((r) => (
              <tr key={r.id} className="border-b border-border last:border-0">
                <td className="p-3">{r.name}</td>
                <td className="p-3 text-text-muted">{r.email ?? r.phone}</td>
                <td className="p-3">{r.consoleModel}</td>
                <td className="p-3 text-text-muted">{r.condition}</td>
                <td className="p-3 text-text-muted">{formatDate(r.createdAt)}</td>
                <td className="p-3">
                  <span className="badge-condition">{SELL_REQUEST_STATUS_LABELS[r.status]}</span>
                </td>
                <td className="p-3 text-right">
                  <Link href={`/admin/avaliacoes/${r.id}`} className="text-primary-light hover:underline">
                    Ver
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {sellRequests.length === 0 && (
          <p className="p-6 text-center text-text-muted">Ainda não há pedidos de avaliação.</p>
        )}
      </div>
    </div>
  );
}
