import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/components/admin/ProductForm";
import { updateProduct } from "@/app/admin/actions";

export const dynamic = "force-dynamic";

export default async function EditarProdutoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [product, categories] = await Promise.all([
    prisma.product.findUnique({ where: { id }, include: { images: { orderBy: { order: "asc" } } } }),
    prisma.category.findMany({ orderBy: { order: "asc" } }),
  ]);

  if (!product) notFound();

  const updateWithId = updateProduct.bind(null, product.id);

  return (
    <div>
      <h1 className="text-2xl font-bold">Editar produto</h1>
      <div className="mt-6">
        <ProductForm
          categories={categories}
          action={updateWithId}
          product={{
            ...product,
            price: product.price.toString(),
          }}
        />
      </div>
    </div>
  );
}
