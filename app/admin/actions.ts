"use server";

import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type {
  OrderStatus,
  ProductCondition,
  PsGeneration,
  StorageCapacity,
  SellRequestStatus,
} from "@prisma/client";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as { role?: string })?.role !== "admin") {
    redirect("/admin/login");
  }
}

const DIACRITICS_RANGE_START = 0x0300;
const DIACRITICS_RANGE_END = 0x036f;

function parseLines(value: FormDataEntryValue | null) {
  return String(value ?? "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function slugify(text: string) {
  const withoutDiacritics = Array.from(text.normalize("NFD"))
    .filter((char) => {
      const code = char.codePointAt(0)!;
      return code < DIACRITICS_RANGE_START || code > DIACRITICS_RANGE_END;
    })
    .join("");

  return withoutDiacritics
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function createProduct(formData: FormData) {
  await requireAdmin();

  const name = String(formData.get("name"));
  const description = String(formData.get("description"));
  const price = Number(formData.get("price"));
  const stock = Number(formData.get("stock"));
  const condition = String(formData.get("condition")) as ProductCondition;
  const psGeneration = String(formData.get("psGeneration")) as PsGeneration;
  const model = String(formData.get("model") ?? "").trim() || null;
  const storageCapacity = (String(formData.get("storageCapacity") ?? "").trim() ||
    null) as StorageCapacity | null;
  const categoryId = String(formData.get("categoryId"));
  const featured = formData.get("featured") === "on";
  const imageUrls = String(formData.get("imageUrls") ?? "")
    .split("\n")
    .map((u) => u.trim())
    .filter(Boolean);
  const includedItems = parseLines(formData.get("includedItems"));
  const notIncludedItems = parseLines(formData.get("notIncludedItems"));
  const testedChecks = parseLines(formData.get("testedChecks"));

  await prisma.product.create({
    data: {
      name,
      slug: `${slugify(name)}-${Date.now().toString(36)}`,
      description,
      price,
      stock,
      condition,
      psGeneration,
      model,
      storageCapacity,
      categoryId,
      featured,
      includedItems,
      notIncludedItems,
      testedChecks,
      images: {
        create: imageUrls.map((url, i) => ({ url, order: i })),
      },
    },
  });

  revalidatePath("/admin/produtos");
  redirect("/admin/produtos");
}

export async function updateProduct(productId: string, formData: FormData) {
  await requireAdmin();

  const name = String(formData.get("name"));
  const description = String(formData.get("description"));
  const price = Number(formData.get("price"));
  const stock = Number(formData.get("stock"));
  const condition = String(formData.get("condition")) as ProductCondition;
  const psGeneration = String(formData.get("psGeneration")) as PsGeneration;
  const model = String(formData.get("model") ?? "").trim() || null;
  const storageCapacity = (String(formData.get("storageCapacity") ?? "").trim() ||
    null) as StorageCapacity | null;
  const categoryId = String(formData.get("categoryId"));
  const featured = formData.get("featured") === "on";
  const active = formData.get("active") === "on";
  const imageUrls = String(formData.get("imageUrls") ?? "")
    .split("\n")
    .map((u) => u.trim())
    .filter(Boolean);
  const includedItems = parseLines(formData.get("includedItems"));
  const notIncludedItems = parseLines(formData.get("notIncludedItems"));
  const testedChecks = parseLines(formData.get("testedChecks"));

  await prisma.$transaction([
    prisma.productImage.deleteMany({ where: { productId } }),
    prisma.product.update({
      where: { id: productId },
      data: {
        name,
        description,
        price,
        stock,
        condition,
        psGeneration,
        model,
        storageCapacity,
        categoryId,
        featured,
        active,
        includedItems,
        notIncludedItems,
        testedChecks,
        images: {
          create: imageUrls.map((url, i) => ({ url, order: i })),
        },
      },
    }),
  ]);

  revalidatePath("/admin/produtos");
  redirect("/admin/produtos");
}

export async function deleteProduct(productId: string) {
  await requireAdmin();
  await prisma.product.delete({ where: { id: productId } });
  revalidatePath("/admin/produtos");
}

export async function createCategory(formData: FormData) {
  await requireAdmin();
  const name = String(formData.get("name"));
  const order = Number(formData.get("order")) || 0;
  await prisma.category.create({ data: { name, slug: slugify(name), order } });
  revalidatePath("/admin/categorias");
}

export async function deleteCategory(categoryId: string) {
  await requireAdmin();
  await prisma.category.delete({ where: { id: categoryId } });
  revalidatePath("/admin/categorias");
}

export async function updateOrderStatus(orderId: string, formData: FormData) {
  await requireAdmin();
  const status = String(formData.get("status")) as OrderStatus;
  await prisma.order.update({ where: { id: orderId }, data: { status } });
  revalidatePath("/admin/encomendas");
  revalidatePath(`/admin/encomendas/${orderId}`);
}

export async function updateSellRequestStatus(sellRequestId: string, formData: FormData) {
  await requireAdmin();
  const status = String(formData.get("status")) as SellRequestStatus;
  await prisma.sellRequest.update({ where: { id: sellRequestId }, data: { status } });
  revalidatePath("/admin/avaliacoes");
  revalidatePath(`/admin/avaliacoes/${sellRequestId}`);
}
