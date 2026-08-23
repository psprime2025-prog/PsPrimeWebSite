"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

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
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-surface px-4 py-4 shadow-2xl sm:px-6">
      <div className="mx-auto flex max-w-7xl flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-text-muted">
          Usamos cookies essenciais para o funcionamento da loja (carrinho, sessão) e cookies
          opcionais para melhorar a sua experiência. Saiba mais na nossa{" "}
          <Link href="/legal/cookies" className="text-primary-light hover:underline">
            Política de Cookies
          </Link>
          .
        </p>
        <div className="flex shrink-0 gap-2">
          <button onClick={reject} className="btn-secondary text-sm">
            Rejeitar opcionais
          </button>
          <button onClick={accept} className="btn-primary text-sm">
            Aceitar todos
          </button>
        </div>
      </div>
    </div>
  );
}
