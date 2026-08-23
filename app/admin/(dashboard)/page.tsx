import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const [monthlySales, pendingOrders, lowStockProducts, totalProducts] = await Promise.all([
    prisma.order.aggregate({
      where: { status: "PAGO", createdAt: { gte: startOfMonth } },
      _sum: { total: true },
      _count: true,
    }),
    prisma.order.count({ where: { status: "PENDENTE" } }),
    prisma.product.findMany({
      where: { active: true, stock: { lte: 3 } },
      orderBy: { stock: "asc" },
      take: 5,
    }),
    prisma.product.count({ where: { active: true } }),
  ]);

  const stats = [
    { label: "Vendas do mês", value: formatPrice(monthlySales._sum.total ?? 0) },
    { label: "Encomendas pagas (mês)", value: monthlySales._count },
    { label: "Encomendas pendentes", value: pendingOrders },
    { label: "Produtos ativos", value: totalProducts },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="card p-5">
            <p className="text-sm text-text-muted">{s.label}</p>
            <p className="mt-1 text-2xl font-bold">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="card mt-8 p-5">
        <h2 className="font-semibold">Produtos com pouco stock</h2>
        {lowStockProducts.length === 0 ? (
          <p className="mt-2 text-sm text-text-muted">Nenhum produto com stock baixo.</p>
        ) : (
          <ul className="mt-3 divide-y divide-border">
            {lowStockProducts.map((p) => (
              <li key={p.id} className="flex justify-between py-2 text-sm">
                <span>{p.name}</span>
                <span className="text-text-muted">{p.stock} em stock</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
