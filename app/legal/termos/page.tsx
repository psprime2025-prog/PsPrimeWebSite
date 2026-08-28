import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { STORE } from "@/lib/constants";

export const metadata: Metadata = { title: "Termos e Condições" };

export default function TermosPage() {
  return (
    <LegalPage title="Termos e Condições" updatedAt="23 de agosto de 2026">
      <div className="rounded-card border border-yellow-500/40 bg-yellow-500/10 p-4 text-yellow-200">
        <strong>Aviso:</strong> o NIF da {STORE.name} está por preencher (
        <code>{STORE.nif ?? "[A PREENCHER]"}</code>). Por lei, o NIF do vendedor é obrigatório
        numa loja online em Portugal — preenche este campo em <code>lib/constants.ts</code> antes
        do lançamento público.
      </div>

      <h2>1. Identificação do vendedor</h2>
      <p>
        <strong>{STORE.legalName}</strong>
        <br />
        NIF: {STORE.nif ?? "[A PREENCHER]"}
        <br />
        Morada: {STORE.address.street}, {STORE.address.postalCode} {STORE.address.city},{" "}
        {STORE.address.country}
        <br />
        Email: {STORE.supportEmail} · Telefone: {STORE.supportPhone}
      </p>

      <h2>2. Objeto</h2>
      <p>
        Os presentes Termos e Condições regulam a venda de produtos PlayStation seminovos
        (consolas, comandos, jogos e acessórios) através do site {STORE.name}, disponibilizados
        para venda ao público em Portugal.
      </p>

      <h2>3. Produtos seminovos</h2>
      <p>
        Todos os produtos comercializados são seminovos: foram previamente utilizados, testados e
        recondicionados pela nossa equipa antes de serem colocados à venda. Cada ficha de produto
        indica o grau de condição (Excelente, Muito Bom ou Bom) e, quando aplicável, a geração
        PlayStation correspondente.
      </p>

      <h2>4. Preços e pagamento</h2>
      <p>
        Os preços apresentados incluem IVA à taxa legal em vigor e portes de envio. Aceitamos
        pagamento por Cartão de Crédito/Débito, Multibanco e MB WAY, processados de forma segura
        através da Stripe. A referência Multibanco gerada é válida durante aproximadamente 7 dias.
      </p>

      <h2>5. Portes de envio</h2>
      <p>Envio grátis em todas as encomendas, em todo o território português.</p>

      <h2>6. Direito de livre resolução (devolução)</h2>
      <p>
        Nos termos da lei portuguesa, o cliente dispõe de 14 dias após a receção do produto para
        exercer o direito de livre resolução, sem necessidade de indicar motivo. Consulta a nossa{" "}
        <a href="/legal/devolucoes" className="text-primary-light hover:underline">
          Política de Devolução e Trocas
        </a>{" "}
        para mais detalhes.
      </p>

      <h2>7. Garantia</h2>
      <p>
        Os produtos seminovos beneficiam de garantia legal de conformidade nos termos aplicáveis à
        venda de bens em segunda mão em Portugal.
      </p>

      <h2>8. Contactos</h2>
      <p>
        Para qualquer questão relacionada com uma encomenda, contacta-nos em {STORE.supportEmail}{" "}
        ou {STORE.supportPhone}.
      </p>
    </LegalPage>
  );
}
