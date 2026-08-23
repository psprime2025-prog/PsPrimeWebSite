import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { STORE } from "@/lib/constants";

export const metadata: Metadata = { title: "Política de Privacidade" };

export default function PrivacidadePage() {
  return (
    <LegalPage title="Política de Privacidade" updatedAt="23 de agosto de 2026">
      <h2>1. Responsável pelo tratamento</h2>
      <p>
        <strong>{STORE.legalName}</strong>, com morada em {STORE.address.street},{" "}
        {STORE.address.postalCode} {STORE.address.city}, é responsável pelo tratamento dos dados
        pessoais recolhidos através deste site. Contacto: {STORE.supportEmail}.
      </p>

      <h2>2. Dados recolhidos</h2>
      <p>
        No checkout como convidado, recolhemos: nome, email, telefone e morada de entrega. Estes
        dados são utilizados exclusivamente para processar e entregar a tua encomenda, e para
        comunicação relacionada com a mesma (confirmação, referência de pagamento, atualizações de
        envio).
      </p>

      <h2>3. Pagamentos</h2>
      <p>
        Os pagamentos são processados pela Stripe, que atua como subcontratante e cumpre os
        requisitos de segurança PCI-DSS. A {STORE.name} não armazena dados de cartões de crédito.
      </p>

      <h2>4. Base legal do tratamento</h2>
      <p>
        O tratamento dos dados baseia-se na execução do contrato de compra e venda (processar a
        encomenda) e no cumprimento de obrigações legais (faturação, garantias).
      </p>

      <h2>5. Conservação dos dados</h2>
      <p>
        Os dados relativos a encomendas são conservados pelo período exigido pela legislação
        fiscal e comercial aplicável em Portugal.
      </p>

      <h2>6. Direitos do titular dos dados</h2>
      <p>
        Nos termos do RGPD, tens direito de acesso, retificação, apagamento, limitação e
        portabilidade dos teus dados pessoais, bem como direito de oposição ao tratamento. Podes
        exercer estes direitos contactando {STORE.supportEmail}.
      </p>

      <h2>7. Cookies</h2>
      <p>
        Este site utiliza cookies essenciais e opcionais. Consulta a nossa{" "}
        <a href="/legal/cookies" className="text-primary-light hover:underline">
          Política de Cookies
        </a>{" "}
        para mais informação.
      </p>

      <h2>8. Autoridade de controlo</h2>
      <p>
        Tens o direito de apresentar reclamação junto da Comissão Nacional de Proteção de Dados
        (CNPD), caso consideres que o tratamento dos teus dados viola a legislação aplicável.
      </p>
    </LegalPage>
  );
}
