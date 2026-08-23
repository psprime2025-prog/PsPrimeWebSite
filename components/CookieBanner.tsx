"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";

const CONSENT_KEY = "psprime-cookie-consent";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Lê o consentimento guardado no cliente (localStorage não existe no servidor).
    if (!localStorage.getItem(CONSENT_KEY)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- sincroniza com localStorage, não há alternativa sem efeito
      setVisible(true);
    }
  }, []);

  function accept() {
    localStorage.setItem(CONSENT_KEY, "aceite");
    setVisible(false);
  }

  function reject() {
    localStorage.setItem(CONSENT_KEY, "rejeitado");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-x-4 bottom-4 z-50 sm:inset-x-6 sm:bottom-6">
      <div className="card mx-auto flex max-w-4xl flex-col items-start gap-4 p-5 shadow-2xl sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-text-muted">
          Usamos cookies essenciais para o funcionamento da loja (carrinho, sessão) e cookies
          opcionais para melhorar a sua experiência. Saiba mais na nossa{" "}
          <Link href="/legal/cookies" className="text-primary-light hover:underline">
            Política de Cookies
          </Link>
          .
        </p>
        <div className="flex shrink-0 gap-2">
          <Button onClick={reject} variant="outline" className="text-sm">
            Rejeitar opcionais
          </Button>
          <Button onClick={accept} variant="primary" className="text-sm">
            Aceitar todos
          </Button>
        </div>
      </div>
    </div>
  );
}
