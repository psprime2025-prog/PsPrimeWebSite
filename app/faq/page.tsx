import type { Metadata } from "next";
import { STORE, SHIPPING } from "@/lib/constants";

export const metadata: Metadata = { title: "FAQ" };

const FAQS = [
  {
    q: "O que significa \"produto seminovo\"?",
    a: "É um produto usado que passou por um processo de testes e recondicionamento pela nossa equipa antes de ser colocado à venda, garantindo que funciona corretamente.",
  },
  {
    q: "Como sei o estado de conservação de um produto?",
    a: "Cada produto tem um grau de condição indicado na ficha: Excelente, Muito Bom ou Bom, além de uma descrição detalhada do estado.",
  },
  {
    q: "Quais os métodos de pagamento disponíveis?",
    a: "Cartão de Crédito/Débito, Multibanco e MB WAY, processados de forma segura através da Stripe.",
  },
  {
    q: "Quanto tempo é válida a referência Multibanco?",
    a: "Aproximadamente 7 dias após a geração da referência.",
  },
  {
    q: "Quais são os custos de envio?",
    a: `Portes fixos de ${SHIPPING.flatRate.toFixed(2)} €, com envio gratuito a partir de ${SHIPPING.freeShippingThreshold.toFixed(2)} €.`,
  },
  {
    q: "Posso devolver um produto?",
    a: "Sim, tens 14 dias após a receção para exercer o direito de livre resolução. Consulta a Política de Devolução e Trocas para mais detalhes.",
  },
  {
    q: "Os produtos têm garantia?",
    a: "Sim, todos os produtos seminovos beneficiam de garantia legal de conformidade.",
  },
];

export default function FaqPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold">Perguntas Frequentes</h1>
      <div className="mt-8 divide-y divide-border">
        {FAQS.map((item) => (
          <details key={item.q} className="group py-4">
            <summary className="cursor-pointer list-none font-medium marker:content-none">
              {item.q}
            </summary>
            <p className="mt-2 text-sm text-text-muted">{item.a}</p>
          </details>
        ))}
      </div>
      <p className="mt-8 text-sm text-text-muted">
        Não encontraste resposta à tua dúvida? Contacta-nos em {STORE.supportEmail}.
      </p>
    </div>
  );
}
