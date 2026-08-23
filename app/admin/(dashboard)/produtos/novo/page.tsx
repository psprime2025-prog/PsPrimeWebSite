import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/components/admin/ProductForm";
import { createProduct } from "@/app/admin/actions";

export const dynamic = "force-dynamic";

export default async function NovoProdutoPage() {
  const categories = await prisma.category.findMany({ orderBy: { order: "asc" } });

  return (
    <div>
      <h1 className="text-2xl font-bold">Novo produto</h1>
      <div className="mt-6">
        <ProductForm categories={categories} action={createProduct} />
      </div>
    </div>
  );
}
