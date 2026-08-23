import type { Metadata } from "next";

export const metadata: Metadata = { title: "Sobre Nós" };

export default function SobrePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold">Sobre a PsPrime</h1>
      <div className="mt-6 space-y-4 text-text-muted">
        <p>
          A PsPrime nasceu de uma paixão simples: dar uma segunda vida a consolas, comandos, jogos
          e acessórios PlayStation, tornando o universo PlayStation mais acessível sem abdicar da
          qualidade.
        </p>
        <p>
          Cada produto que vendemos passa por um processo de testes e recondicionamento antes de
          chegar até ti — por isso preferimos chamar-lhes <strong className="text-text">seminovos</strong>{" "}
          em vez de simplesmente &ldquo;usados&rdquo;. Verificamos o funcionamento, limpamos,
          reparamos o que for necessário e classificamos cada produto com um grau de condição
          claro (Excelente, Muito Bom ou Bom), para que saibas exatamente o que estás a comprar.
        </p>
        <p>
          Trabalhamos com todas as gerações PlayStation — de PS1 a PS5 — porque acreditamos que
          cada geração tem o seu valor e os seus fãs.
        </p>
        <p>
          Se tiveres alguma dúvida sobre um produto antes ou depois da compra, a nossa equipa está
          disponível através da página de{" "}
          <a href="/contactos" className="text-primary-light hover:underline">
            Contactos
          </a>
          .
        </p>
      </div>
    </div>
  );
}
