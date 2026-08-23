import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { STORE } from "@/lib/constants";

export const metadata: Metadata = { title: "Política de Devolução e Trocas" };

export default function DevolucoesPage() {
  return (
    <LegalPage title="Política de Devolução e Trocas" updatedAt="23 de agosto de 2026">
      <h2>1. Direito de livre resolução</h2>
      <p>
        Nos termos do Decreto-Lei n.º 24/2014, tens direito a resolver o contrato de compra sem
        necessidade de indicar motivo, no prazo de 14 dias corridos após a receção do produto.
      </p>

      <h2>2. Como solicitar uma devolução</h2>
      <p>
        Envia um email para {STORE.supportEmail} ou contacta-nos por telefone ({STORE.supportPhone}
        ) indicando o número da encomenda e o motivo da devolução. Enviaremos as instruções para
        devolução do produto.
      </p>

      <h2>3. Condições do produto devolvido</h2>
      <p>
        O produto deve ser devolvido na embalagem e com os acessórios com que foi enviado, sem
        sinais de utilização para além dos necessários para verificar a natureza e funcionamento
        do produto. Sendo produtos seminovos, pequenas marcas de uso normal já presentes no momento
        da compra não constituem motivo de recusa.
      </p>

      <h2>4. Reembolso</h2>
      <p>
        Após receção e verificação do produto devolvido, o reembolso é processado através do
        mesmo método de pagamento utilizado na compra, no prazo máximo de 14 dias.
      </p>

      <h2>5. Portes de devolução</h2>
      <p>
        Os portes de devolução são suportados pelo cliente, exceto em caso de produto com defeito
        ou não conforme com o anunciado, situação em que a {STORE.name} assume os custos de
        devolução.
      </p>

      <h2>6. Produtos com defeito</h2>
      <p>
        Caso recebas um produto com defeito ou danificado no transporte, contacta-nos nas primeiras
        48 horas após a receção para procedermos à substituição ou reparação, sem custos
        adicionais.
      </p>
    </LegalPage>
  );
}
