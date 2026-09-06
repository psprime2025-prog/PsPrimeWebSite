export function formatPrice(value: number | string | { toString(): string }): string {
  const numeric = typeof value === "number" ? value : Number(value.toString());
  return new Intl.NumberFormat("pt-PT", {
    style: "currency",
    currency: "EUR",
  }).format(numeric);
}

export function shippingMessage(): string {
  return "Envio grátis";
}

export function formatDate(value: Date | string): string {
  const date = typeof value === "string" ? new Date(value) : value;
  return new Intl.DateTimeFormat("pt-PT", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

export const CONDITION_LABELS: Record<string, string> = {
  EXCELENTE: "Excelente",
  MUITO_BOM: "Muito Bom",
  BOM: "Bom",
};

export const CONDITION_DESCRIPTIONS: Record<string, string> = {
  EXCELENTE: "Como novo. Sem marcas visíveis de utilização.",
  MUITO_BOM: "Pequenas marcas de utilização. Sem problemas funcionais.",
  BOM: "Sinais visíveis de utilização. Totalmente funcional e testado.",
};

export const GENERATION_LABELS: Record<string, string> = {
  PS4: "PlayStation 4",
  PS5: "PlayStation 5",
  NA: "Geral",
};

export const STORAGE_LABELS: Record<string, string> = {
  GB500: "500GB",
  TB1: "1TB",
  TB2: "2TB",
};

export const MODELS_BY_GENERATION: Record<string, string[]> = {
  PS4: ["Fat", "Slim", "Pro"],
  PS5: ["Standard", "Digital Edition", "Slim", "Pro"],
};

export const ORDER_STATUS_LABELS: Record<string, string> = {
  LEAD: "Lead (sem pagamento)",
  PENDENTE: "Pendente",
  PAGO: "Pago",
  ENVIADO: "Enviado",
  ENTREGUE: "Entregue",
  CANCELADO: "Cancelado",
};

export const PAYMENT_METHOD_LABELS: Record<string, string> = {
  CARTAO: "Cartão de Crédito/Débito",
  MULTIBANCO: "Multibanco",
  MBWAY: "MB WAY",
};

export const SELL_REQUEST_STATUS_LABELS: Record<string, string> = {
  NOVO: "Novo",
  CONTACTADO: "Contactado",
  FECHADO: "Fechado",
};
