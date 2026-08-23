"use client";

import { Button, ButtonLink } from "@/components/ui/Button";

// O Next.js regista o erro real (stack, digest) nos logs do servidor —
// esta página propositadamente não lê nem mostra `error` ao cliente.
export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-4 text-center sm:px-6">
      <span className="badge-condition border-primary/40 text-primary-light">Ups</span>
      <h1 className="mt-4 text-2xl font-bold">Algo correu mal</h1>
      <p className="mt-2 text-text-muted">
        Não foi possível carregar esta página. Tenta novamente dentro de instantes.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button onClick={reset} variant="primary">
          Tentar novamente
        </Button>
        <ButtonLink href="/" variant="secondary">
          Página inicial
        </ButtonLink>
      </div>
    </div>
  );
}
