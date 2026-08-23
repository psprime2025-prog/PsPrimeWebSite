import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = { title: "Política de Cookies" };

export default function CookiesPage() {
  return (
    <LegalPage title="Política de Cookies" updatedAt="23 de agosto de 2026">
      <h2>1. O que são cookies</h2>
      <p>
        Cookies são pequenos ficheiros de texto guardados no teu dispositivo quando visitas um
        site, utilizados para o site funcionar corretamente e para melhorar a tua experiência.
      </p>

      <h2>2. Cookies que utilizamos</h2>
      <p>
        <strong>Essenciais (sempre ativos):</strong> necessários para o funcionamento da loja,
        como manter o carrinho de compras entre visitas (armazenado no teu navegador via
        localStorage) e a sessão de administração.
      </p>
      <p>
        <strong>Opcionais:</strong> poderão ser utilizados no futuro para análise de tráfego e
        melhoria da experiência de utilização. Só são ativados com o teu consentimento explícito
        através do banner de cookies.
      </p>

      <h2>3. Como gerir as tuas preferências</h2>
      <p>
        Podes aceitar ou rejeitar os cookies opcionais através do banner apresentado na primeira
        visita ao site. Também podes limpar os dados guardados a qualquer momento nas definições
        do teu navegador.
      </p>

      <h2>4. Alterações a esta política</h2>
      <p>
        Esta política pode ser atualizada periodicamente. Recomendamos que a consultes
        regularmente.
      </p>
    </LegalPage>
  );
}
