"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { CONDITION_LABELS } from "@/lib/format";
import { STORE } from "@/lib/constants";

export default function VenderPage() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setError(null);

    const formData = new FormData(e.currentTarget);

    try {
      const res = await fetch("/api/vender", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Não foi possível enviar o pedido.");
        setStatus("error");
        return;
      }
      setStatus("success");
    } catch {
      setError("Erro de rede. Tenta novamente.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-success/10 text-success">
          ✓
        </div>
        <h1 className="mt-4 text-2xl font-bold">Pedido enviado!</h1>
        <p className="mt-2 text-text-muted">
          Recebemos o teu pedido de avaliação. A nossa equipa entra em contacto brevemente com
          uma proposta.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold">Vender a tua consola</h1>
      <p className="mt-3 text-text-muted">
        Diz-nos o que tens para vender e enviamos-te uma proposta de avaliação. Sem compromisso —
        esta é apenas a primeira etapa, não há preço automático.
      </p>

      <form onSubmit={handleSubmit} className="card mt-8 space-y-4 p-6">
        <div>
          <label className="label">Nome</label>
          <input required name="nome" className="input" />
        </div>
        <div>
          <label className="label">Contacto (email ou telefone)</label>
          <input required name="contacto" className="input" placeholder="email@exemplo.com ou 9XXXXXXXX" />
        </div>
        <div>
          <label className="label">Modelo da consola</label>
          <input required name="modelo" className="input" placeholder="ex: PlayStation 5 Standard 825GB" />
        </div>
        <div>
          <label className="label">Estado / condição</label>
          <select required name="estado" className="input" defaultValue="">
            <option value="" disabled>
              Seleciona...
            </option>
            {Object.entries(CONDITION_LABELS).map(([value, label]) => (
              <option key={value} value={label}>
                {label}
              </option>
            ))}
            <option value="Com avarias/defeitos">Com avarias/defeitos</option>
          </select>
        </div>
        <div>
          <label className="label">Detalhes adicionais (opcional)</label>
          <textarea
            name="mensagem"
            rows={4}
            className="input"
            placeholder="Acessórios incluídos, avarias conhecidas, etc."
          />
        </div>
        <div>
          <label className="label">Fotos (opcional, máx. 5)</label>
          <input type="file" name="fotos" accept="image/*" multiple className="input file:mr-3 file:rounded-full file:border-0 file:bg-primary/20 file:px-3 file:py-1.5 file:text-sm file:text-primary-light" />
        </div>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <Button type="submit" disabled={status === "loading"} variant="primary" className="w-full">
          {status === "loading" ? "A enviar..." : "Pedir avaliação"}
        </Button>

        <p className="text-center text-xs text-text-muted">
          Também podes contactar-nos diretamente em {STORE.supportEmail} ou {STORE.supportPhone}.
        </p>
      </form>
    </div>
  );
}
