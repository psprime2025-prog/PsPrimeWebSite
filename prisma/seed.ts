import { PrismaClient } from "@prisma/client";
import { CATEGORIES_SEED } from "../lib/constants";

const prisma = new PrismaClient();

function placeholder(label: string) {
  return `https://placehold.co/600x600/0B0F16/1677FF?text=${encodeURIComponent(label)}`;
}

async function main() {
  console.log("A criar categorias...");
  const categories: Record<string, string> = {};
  for (const cat of CATEGORIES_SEED) {
    const created = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: { name: cat.name, slug: cat.slug, order: cat.order },
    });
    categories[cat.slug] = created.id;
  }

  console.log("A criar produtos de exemplo...");

  const products = [
    {
      name: "PlayStation 5 Standard 825GB",
      slug: "playstation-5-standard-825gb",
      description:
        "Consola PlayStation 5 seminova, testada e recondicionada pela nossa equipa. Inclui comando DualSense e cabos originais.",
      price: 379.99,
      stock: 4,
      condition: "EXCELENTE",
      psGeneration: "PS5",
      model: "Standard",
      storageCapacity: null,
      categorySlug: "consolas",
      featured: true,
      image: "PS5",
    },
    {
      name: "PlayStation 5 Digital Edition 1TB",
      slug: "playstation-5-digital-edition-1tb",
      description: "PS5 Digital Edition seminova, sem leitor de discos, testada e recondicionada.",
      price: 349.99,
      stock: 3,
      condition: "EXCELENTE",
      psGeneration: "PS5",
      model: "Digital Edition",
      storageCapacity: "TB1",
      categorySlug: "consolas",
      featured: false,
      image: "PS5+Digital",
    },
    {
      name: "PlayStation 4 Slim 1TB",
      slug: "playstation-4-slim-1tb",
      description:
        "PS4 Slim seminova com 1TB de armazenamento. Testada e recondicionada, pronta a jogar.",
      price: 189.99,
      stock: 6,
      condition: "MUITO_BOM",
      psGeneration: "PS4",
      model: "Slim",
      storageCapacity: "TB1",
      categorySlug: "consolas",
      featured: true,
      image: "PS4",
    },
    {
      name: "PlayStation 4 Pro 1TB",
      slug: "playstation-4-pro-1tb",
      description: "PS4 Pro seminova, ideal para jogar em 4K. Testada e recondicionada.",
      price: 229.99,
      stock: 3,
      condition: "MUITO_BOM",
      psGeneration: "PS4",
      model: "Pro",
      storageCapacity: "TB1",
      categorySlug: "consolas",
      featured: false,
      image: "PS4+Pro",
    },
    {
      name: "Comando DualSense PS5",
      slug: "comando-dualsense-ps5",
      description: "Comando DualSense original seminovo, testado (vibração, gatilhos adaptativos e botões).",
      price: 44.99,
      stock: 10,
      condition: "EXCELENTE",
      psGeneration: "PS5",
      model: null,
      storageCapacity: null,
      categorySlug: "comandos",
      featured: true,
      image: "DualSense",
    },
    {
      name: "Comando DualShock 4 PS4",
      slug: "comando-dualshock-4-ps4",
      description: "Comando DualShock 4 original seminovo, testado e em bom estado de funcionamento.",
      price: 29.99,
      stock: 12,
      condition: "MUITO_BOM",
      psGeneration: "PS4",
      model: null,
      storageCapacity: null,
      categorySlug: "comandos",
      featured: false,
      image: "DS4",
    },
    {
      name: "God of War Ragnarök (PS5)",
      slug: "god-of-war-ragnarok-ps5",
      description: "Jogo em disco para PS5, seminovo, testado e em bom estado.",
      price: 34.99,
      stock: 5,
      condition: "EXCELENTE",
      psGeneration: "PS5",
      model: null,
      storageCapacity: null,
      categorySlug: "jogos",
      featured: true,
      image: "GoW+Ragnarok",
    },
    {
      name: "The Last of Us Part II (PS4)",
      slug: "the-last-of-us-part-ii-ps4",
      description: "Jogo em disco para PS4, seminovo, testado e em bom estado.",
      price: 19.99,
      stock: 7,
      condition: "MUITO_BOM",
      psGeneration: "PS4",
      model: null,
      storageCapacity: null,
      categorySlug: "jogos",
      featured: false,
      image: "TLOU+2",
    },
    {
      name: "Cabo HDMI 2.1 para PS5",
      slug: "cabo-hdmi-21-ps5",
      description: "Cabo HDMI 2.1 compatível com PS5, suporta 4K a 120Hz.",
      price: 12.99,
      stock: 20,
      condition: "EXCELENTE",
      psGeneration: "PS5",
      model: null,
      storageCapacity: null,
      categorySlug: "acessorios",
      featured: false,
      image: "HDMI+2.1",
    },
    {
      name: "Base de Carregamento DualSense",
      slug: "base-carregamento-dualsense",
      description: "Base de carregamento dupla para comandos DualSense, seminova e testada.",
      price: 17.99,
      stock: 8,
      condition: "MUITO_BOM",
      psGeneration: "PS5",
      model: null,
      storageCapacity: null,
      categorySlug: "acessorios",
      featured: false,
      image: "Charging+Station",
    },
  ] as const;

  for (const p of products) {
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        name: p.name,
        slug: p.slug,
        description: p.description,
        price: p.price,
        stock: p.stock,
        condition: p.condition,
        psGeneration: p.psGeneration,
        model: p.model,
        storageCapacity: p.storageCapacity,
        categoryId: categories[p.categorySlug],
        featured: p.featured,
        images: {
          create: [{ url: placeholder(p.image), alt: p.name, order: 0 }],
        },
      },
    });
  }

  console.log("Seed concluído.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
