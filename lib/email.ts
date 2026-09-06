import { Resend } from "resend";
import { prisma } from "@/lib/prisma";
import { formatPrice, PAYMENT_METHOD_LABELS } from "@/lib/format";
import { STORE } from "@/lib/constants";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const FROM_EMAIL = process.env.EMAIL_FROM ?? "PsPrime <suporte@psprime.shop>";

export async function sendOrderConfirmationEmail(orderId: string) {
  if (!resend) {
    console.warn("RESEND_API_KEY não configurada — email de confirmação não enviado.");
    return;
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true, address: true, payment: true },
  });
  if (!order) return;

  const itemsHtml = order.items
    .map(
      (item) =>
        `<tr><td style="padding:8px 0;">${item.productName} × ${item.quantity}</td><td style="padding:8px 0;text-align:right;">${formatPrice(item.subtotal)}</td></tr>`
    )
    .join("");

  const multibancoHtml =
    order.paymentMethod === "MULTIBANCO" && order.payment?.multibancoReference
      ? `
      <div style="margin-top:24px;padding:16px;border:1px solid #202733;border-radius:8px;">
        <p style="margin:0 0 8px;font-weight:600;">Referência Multibanco</p>
        <p style="margin:0;">Entidade: <strong>${order.payment.multibancoEntity}</strong></p>
        <p style="margin:0;">Referência: <strong>${order.payment.multibancoReference}</strong></p>
        <p style="margin:0;">Valor: <strong>${formatPrice(order.total)}</strong></p>
        <p style="margin:8px 0 0;font-size:13px;color:#666;">Válida durante aproximadamente 7 dias.</p>
      </div>`
      : "";

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;color:#111;">
      <h2>Obrigado pela tua encomenda, ${order.guestName}!</h2>
      <p>Recebemos a tua encomenda <strong>#${order.id.slice(-8).toUpperCase()}</strong>.</p>
      <table style="width:100%;border-collapse:collapse;margin-top:16px;">
        ${itemsHtml}
        <tr><td style="padding-top:12px;font-weight:600;">Portes</td><td style="padding-top:12px;text-align:right;">${formatPrice(order.shippingCost)}</td></tr>
        <tr><td style="padding-top:8px;font-weight:700;">Total</td><td style="padding-top:8px;text-align:right;font-weight:700;">${formatPrice(order.total)}</td></tr>
      </table>
      <p style="margin-top:16px;">Método de pagamento: ${PAYMENT_METHOD_LABELS[order.paymentMethod]}</p>
      ${multibancoHtml}
      <p style="margin-top:24px;">Morada de entrega: ${order.address?.street}, ${order.address?.postalCode} ${order.address?.city}</p>
      <p style="margin-top:24px;font-size:13px;color:#666;">
        Dúvidas? Contacta-nos em ${STORE.supportEmail} ou ${STORE.supportPhone}.
      </p>
    </div>
  `;

  const { error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: order.guestEmail,
    subject: `Encomenda PsPrime #${order.id.slice(-8).toUpperCase()} confirmada`,
    html,
  });

  if (error) {
    // O SDK do Resend não rejeita a promise em erros da API (ex: domínio de
    // envio não verificado) — só devolve { error }. Sem isto o envio falha
    // em silêncio e ninguém percebe.
    throw new Error(`Resend recusou o email de confirmação: ${error.name} — ${error.message}`);
  }
}

interface SellRequestData {
  nome: string;
  whatsapp: string;
  email: string;
  modelo: string;
  estado: string;
  mensagem: string;
  fotos: { filename: string; content: Buffer; contentType: string }[];
}

function sellRequestRow(label: string, value: string) {
  return `<tr><td style="padding:6px 12px 6px 0;font-weight:600;white-space:nowrap;vertical-align:top;">${label}</td><td style="padding:6px 0;">${value}</td></tr>`;
}

export async function sendSellRequestEmail(data: SellRequestData) {
  if (!resend) {
    console.warn("RESEND_API_KEY não configurada — pedido de avaliação não enviado.");
    return;
  }

  const rows = [
    sellRequestRow("Nome", data.nome),
    sellRequestRow("WhatsApp", data.whatsapp),
    ...(data.email ? [sellRequestRow("Email", data.email)] : []),
    sellRequestRow("Modelo", data.modelo),
    sellRequestRow("Estado (descrito pelo cliente)", data.estado),
  ].join("");

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;color:#111;">
      <h2>Nova proposta de avaliação</h2>
      <table style="border-collapse:collapse;margin-top:16px;">${rows}</table>
      ${data.mensagem ? `<p style="margin-top:16px;"><strong>Mensagem do cliente:</strong><br/>${data.mensagem.replace(/\n/g, "<br/>")}</p>` : ""}
      <p style="margin-top:16px;font-size:13px;color:#666;">
        ${data.fotos.length > 0 ? `${data.fotos.length} foto(s) em anexo a este email.` : "O cliente não anexou fotos."}
      </p>
    </div>
  `;

  const { error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: process.env.ADMIN_EMAIL ?? STORE.supportEmail,
    replyTo: data.email || undefined,
    subject: `Nova proposta de avaliação — ${data.nome}`,
    html,
    attachments: data.fotos.map((f) => ({
      filename: f.filename,
      content: f.content,
      contentType: f.contentType,
    })),
  });

  if (error) {
    throw new Error(`Resend recusou o email de avaliação: ${error.name} — ${error.message}`);
  }
}
