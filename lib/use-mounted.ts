"use client";

import { useEffect, useState } from "react";

/**
 * Sinaliza quando o componente já hidratou no cliente.
 * Usado para evitar mismatches de hidratação em componentes que dependem
 * de localStorage (carrinho, consentimento de cookies).
 */
export function useMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- flag de hidratação, não sincronização de estado externo
    setMounted(true);
  }, []);
  return mounted;
}
