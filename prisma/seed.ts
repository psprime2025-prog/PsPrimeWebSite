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
      categorySlug: "consolas",
      featured: true,
      image: "PS5",
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
      categorySlug: "consolas",
      featured: true,
      image: "PS4",
    },
    {
      name: "PlayStation 3 Super Slim 500GB",
      slug: "playstation-3-super-slim-500gb",
      description: "PS3 Super Slim seminova, ideal para reviver os clássicos da geração.",
      price: 99.99,
      stock: 3,
      condition: "BOM",
      psGeneration: "PS3",
      categorySlug: "consolas",
      featured: false,
      image: "PS3",
    },
    {
      name: "PlayStation 2 Slim",
      slug: "playstation-2-slim",
      description: "A lendária PS2 Slim, seminova e testada, com um dos maiores catálogos de sempre.",
      price: 69.99,
      stock: 2,
      condition: "BOM",
      psGeneration: "PS2",
      categorySlug: "consolas",
      featured: false,
      image: "PS2",
    },
    {
      name: "Comando DualSense PS5",
      slug: "comando-dualsense-ps5",
      description: "Comando DualSense original seminovo, testado (vibração, gatilhos adaptativos e botões).",
      price: 44.99,
      stock: 10,
      condition: "EXCELENTE",
      psGeneration: "PS5",
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
