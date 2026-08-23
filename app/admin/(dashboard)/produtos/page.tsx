import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatPrice, CONDITION_LABELS, GENERATION_LABELS } from "@/lib/format";
import { deleteProduct } from "@/app/admin/actions";
import { ButtonLink } from "@/components/ui/Button";

export const dynamic = "force-dynamic";

export default async function AdminProdutosPage() {
  const products = await prisma.product.findMany({
    include: { category: true, images: { take: 1, orderBy: { order: "asc" } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Produtos</h1>
        <ButtonLink href="/admin/produtos/novo" variant="primary">
          Novo produto
        </ButtonLink>
      </div>

      <div className="card mt-6 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-text-muted">
              <th className="p-3">Nome</th>
              <th className="p-3">Categoria</th>
              <th className="p-3">Geração</th>
              <th className="p-3">Condição</th>
              <th className="p-3">Preço</th>
              <th className="p-3">Stock</th>
              <th className="p-3">Estado</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b border-border last:border-0">
                <td className="p-3">{p.name}</td>
                <td className="p-3 text-text-muted">{p.category.name}</td>
                <td className="p-3 text-text-muted">{GENERATION_LABELS[p.psGeneration]}</td>
                <td className="p-3 text-text-muted">{CONDITION_LABELS[p.condition]}</td>
                <td className="p-3">{formatPrice(p.price)}</td>
                <td className="p-3">{p.stock}</td>
                <td className="p-3">
                  <span className={`badge-condition ${p.active ? "text-success border-success/40" : ""}`}>
                    {p.active ? "Ativo" : "Inativo"}
                  </span>
                </td>
                <td className="space-x-3 p-3 text-right">
                  <Link href={`/admin/produtos/${p.id}`} className="text-primary-light hover:underline">
                    Editar
                  </Link>
                  <form action={deleteProduct.bind(null, p.id)} className="inline">
                    <button type="submit" className="text-red-400 hover:underline">
                      Eliminar
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {products.length === 0 && (
          <p className="p-6 text-center text-text-muted">Ainda não há produtos.</p>
        )}
      </div>
    </div>
  );
}
