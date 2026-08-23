export function formatPrice(value: number | string | { toString(): string }): string {
  const numeric = typeof value === "number" ? value : Number(value.toString());
  return new Intl.NumberFormat("pt-PT", {
    style: "currency",
    currency: "EUR",
  }).format(numeric);
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

export const GENERATION_LABELS: Record<string, string> = {
  PS1: "PlayStation 1",
  PS2: "PlayStation 2",
  PS3: "PlayStation 3",
  PS4: "PlayStation 4",
  PS5: "PlayStation 5",
  NA: "Geral",
};

export const ORDER_STATUS_LABELS: Record<string, string> = {
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
