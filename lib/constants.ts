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

// Envio grátis em todas as encomendas — o custo de portes já está refletido no
// preço de cada artigo, por isso não é cobrado à parte no checkout.
export const SHIPPING = {
  flatRate: 0,
  freeShippingThreshold: 0,
} as const;

// Mantém o parâmetro para não obrigar a alterar todas as chamadas existentes.
export function calculateShippingCost(subtotal: number): number {
  void subtotal;
  return 0;
}

export const CATEGORIES_SEED = [
  { name: "Consolas", slug: "consolas", order: 1 },
  { name: "Comandos", slug: "comandos", order: 2 },
  { name: "Jogos", slug: "jogos", order: 3 },
  { name: "Acessórios", slug: "acessorios", order: 4 },
] as const;
