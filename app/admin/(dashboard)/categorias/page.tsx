import { prisma } from "@/lib/prisma";
import { createCategory, deleteCategory } from "@/app/admin/actions";
import { Button } from "@/components/ui/Button";

export const dynamic = "force-dynamic";

export default async function AdminCategoriasPage() {
  const categories = await prisma.category.findMany({
    orderBy: { order: "asc" },
    include: { _count: { select: { products: true } } },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold">Categorias</h1>

      <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_320px]">
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-text-muted">
                <th className="p-3">Nome</th>
                <th className="p-3">Slug</th>
                <th className="p-3">Produtos</th>
                <th className="p-3"></th>
              </tr>
            </thead>
            <tbody>
              {categories.map((c) => (
                <tr key={c.id} className="border-b border-border last:border-0">
                  <td className="p-3">{c.name}</td>
                  <td className="p-3 text-text-muted">{c.slug}</td>
                  <td className="p-3">{c._count.products}</td>
                  <td className="p-3 text-right">
                    <form action={deleteCategory.bind(null, c.id)}>
                      <button type="submit" className="text-red-400 hover:underline">
                        Eliminar
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <form action={createCategory} className="card h-fit space-y-4 p-6">
          <h2 className="font-semibold">Nova categoria</h2>
          <div>
            <label className="label">Nome</label>
            <input required name="name" className="input" />
          </div>
          <div>
            <label className="label">Ordem</label>
            <input type="number" name="order" defaultValue={0} className="input" />
          </div>
          <Button type="submit" variant="primary" className="w-full">
            Adicionar
          </Button>
        </form>
      </div>
    </div>
  );
}
