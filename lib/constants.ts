// Dados legais e de negócio da PsPrime.
// NIF em falta — TODO obrigatório antes do lançamento público (ver /legal/termos).
export const STORE = {
  name: "PsPrime",
  legalName: "PsPrime — venda em nome individual",
  nif: null as string | null, // TODO: preencher NIF antes do lançamento (obrigatório por lei em PT)
  address: {
    street: "Rua Cesário Verde 35",
    postalCode: "1170-158",
    city: "Lisboa",
    country: "Portugal",
  },
  supportEmail: "psprime2025@gmail.com",
  supportPhone: "961 916 668",
  whatsappUrl: "https://wa.me/351961916668",
} as const;

// Portes de envio — valor fixo inicial (ajustável mais tarde por escalões de peso/valor).
export const SHIPPING = {
  flatRate: 4.99,
  freeShippingThreshold: 75,
} as const;

export function calculateShippingCost(subtotal: number): number {
  if (subtotal >= SHIPPING.freeShippingThreshold) return 0;
  return SHIPPING.flatRate;
}

export const CATEGORIES_SEED = [
  { name: "Consolas", slug: "consolas", order: 1 },
  { name: "Comandos", slug: "comandos", order: 2 },
  { name: "Jogos", slug: "jogos", order: 3 },
  { name: "Acessórios", slug: "acessorios", order: 4 },
] as const;
