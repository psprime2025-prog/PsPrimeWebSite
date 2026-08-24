"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { STORE } from "@/lib/constants";
import { ControllerIcon, PackageIcon, CheckIcon } from "@/components/icons/InfoIcons";
import { FloatingSymbolsCompact } from "@/components/FloatingSymbols";

const CONSOLE_OPTIONS = ["PS4", "PS4 Slim", "PS4 Pro", "PS5", "PS5 Slim", "PS5 Digital", "PS5 Pro", "Outra"];

const ESTADO_OPTIONS: { value: string; dot: string }[] = [
  { value: "Excelente", dot: "bg-success" },
  { value: "Muito bom", dot: "bg-success" },
  { value: "Bom", dot: "bg-yellow-500" },
  { value: "Com marcas", dot: "bg-orange-500" },
];

const ACOMPANHA_OPTIONS = [
  { value: "1 comando", icon: ControllerIcon },
  { value: "2 comandos", icon: ControllerIcon },
  { value: "Jogos", icon: ControllerIcon },
  { value: "Caixa", icon: PackageIcon },
];

const TOTAL_STEPS = 5;

const HOW_IT_WORKS = ["Envias os dados", "Analisamos", "Recebes a proposta", "Decides sem compromisso"];

interface WizardData {
  consola: string;
  consolaOutra: string;
  estado: string;
  acompanha: string[];
  fotos: File[];
  nome: string;
  contacto: string;
}

function StepShell({
  step,
  title,
  subtitle,
  children,
  onBack,
}: {
  step: number;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  onBack?: () => void;
}) {
  return (
    <div className="card space-y-5 p-6">
      <div>
        <p className="text-xs font-medium text-text-muted">
          Passo {step} de {TOTAL_STEPS}
        </p>
        <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-surface">
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
          />
        </div>
      </div>
      <div>
        <h2 className="text-lg font-bold">{title}</h2>
        {subtitle && <p className="mt-1 text-sm text-text-muted">{subtitle}</p>}
      </div>
      {children}
      {onBack && (
        <button type="button" onClick={onBack} className="text-sm text-text-muted hover:text-text">
          ← Voltar
        </button>
      )}
    </div>
  );
}

function ChoiceButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`card flex items-center gap-2.5 p-4 text-left text-sm font-medium transition-colors hover:border-primary/50 ${
        active ? "border-primary" : ""
      }`}
    >
      {children}
    </button>
  );
}

export default function VenderPage() {
  const [step, setStep] = useState(1);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<WizardData>({
    consola: "",
    consolaOutra: "",
    estado: "",
    acompanha: [],
    fotos: [],
    nome: "",
    contacto: "",
  });

  function toggleAcompanha(value: string) {
    setData((d) => ({
      ...d,
      acompanha: d.acompanha.includes(value)
        ? d.acompanha.filter((v) => v !== value)
        : [...d.acompanha, value],
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!data.nome.trim() || !data.contacto.trim()) return;

    setStatus("loading");
    setError(null);

    const modelo = data.consola === "Outra" ? data.consolaOutra.trim() : data.consola;
    const mensagem = data.acompanha.length > 0 ? `Acompanha: ${data.acompanha.join(", ")}.` : "";

    const formData = new FormData();
    formData.set("nome", data.nome.trim());
    formData.set("contacto", data.contacto.trim());
    formData.set("modelo", modelo);
    formData.set("estado", data.estado);
    formData.set("mensagem", mensagem);
    data.fotos.forEach((file) => formData.append("fotos", file));

    try {
      const res = await fetch("/api/vender", { method: "POST", body: formData });
      const resData = await res.json();
      if (!res.ok) {
        setError(resData.error ?? "Não foi possível enviar o pedido.");
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
          <CheckIcon className="h-6 w-6" />
        </div>
        <h1 className="mt-4 text-2xl font-bold">Pedido enviado!</h1>
        <p className="mt-2 text-text-muted">
          Recebemos o teu pedido de avaliação. A nossa equipa entra em contacto brevemente com
          uma proposta personalizada.
        </p>
      </div>
    );
  }

  return (
    <div className="relative mx-auto max-w-2xl overflow-hidden px-4 py-12 sm:px-6">
      <FloatingSymbolsCompact />
      <h1 className="relative text-3xl font-bold">Descobre quanto vale a tua PlayStation.</h1>
      <p className="mt-2 text-lg text-primary-light">
        Envia-nos alguns dados e recebe uma avaliação sem compromisso.
      </p>
      <p className="mt-3 text-text-muted">
        Não damos um preço automático porque queremos considerar o estado real da tua consola.
      </p>

      <div className="card relative mt-8 p-5">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-text-muted">
          Como funciona?
        </h2>
        <ol className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {HOW_IT_WORKS.map((step, i) => (
            <li key={step} className="flex flex-col items-center gap-2 text-center text-sm">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/15 text-sm font-bold text-primary-light">
                {i + 1}
              </span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </div>

      <div className="mt-8">
        {step === 1 && (
          <StepShell step={1} title="Que consola tens?">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {CONSOLE_OPTIONS.map((option) => (
                <ChoiceButton
                  key={option}
                  active={data.consola === option}
                  onClick={() => {
                    setData((d) => ({ ...d, consola: option }));
                    if (option !== "Outra") setStep(2);
                  }}
                >
                  {option}
                </ChoiceButton>
              ))}
            </div>
            {data.consola === "Outra" && (
              <div className="space-y-3">
                <input
                  autoFocus
                  className="input"
                  placeholder="Qual consola/produto?"
                  value={data.consolaOutra}
                  onChange={(e) => setData((d) => ({ ...d, consolaOutra: e.target.value }))}
                />
                <Button
                  type="button"
                  variant="primary"
                  disabled={!data.consolaOutra.trim()}
                  onClick={() => setStep(2)}
                  className="w-full"
                >
                  Seguinte
                </Button>
              </div>
            )}
          </StepShell>
        )}

        {step === 2 && (
          <StepShell step={2} title="Qual o estado?" onBack={() => setStep(1)}>
            <div className="grid grid-cols-2 gap-3">
              {ESTADO_OPTIONS.map((option) => (
                <ChoiceButton
                  key={option.value}
                  active={data.estado === option.value}
                  onClick={() => {
                    setData((d) => ({ ...d, estado: option.value }));
                    setStep(3);
                  }}
                >
                  <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${option.dot}`} />
                  {option.value}
                </ChoiceButton>
              ))}
            </div>
          </StepShell>
        )}

        {step === 3 && (
          <StepShell
            step={3}
            title="O que acompanha?"
            subtitle="Escolhe tudo o que se aplica (opcional)."
            onBack={() => setStep(2)}
          >
            <div className="grid grid-cols-2 gap-3">
              {ACOMPANHA_OPTIONS.map((option) => (
                <ChoiceButton
                  key={option.value}
                  active={data.acompanha.includes(option.value)}
                  onClick={() => toggleAcompanha(option.value)}
                >
                  <option.icon className="h-4 w-4 shrink-0 text-primary-light" />
                  {option.value}
                </ChoiceButton>
              ))}
            </div>
            <Button type="button" variant="primary" onClick={() => setStep(4)} className="w-full">
              Seguinte
            </Button>
          </StepShell>
        )}

        {step === 4 && (
          <StepShell
            step={4}
            title="Fotos"
            subtitle="Adiciona fotos para uma avaliação mais precisa (opcional, máx. 5)."
            onBack={() => setStep(3)}
          >
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) =>
                setData((d) => ({ ...d, fotos: Array.from(e.target.files ?? []).slice(0, 5) }))
              }
              className="input file:mr-3 file:rounded-full file:border-0 file:bg-primary/20 file:px-3 file:py-1.5 file:text-sm file:text-primary-light"
            />
            {data.fotos.length > 0 && (
              <p className="text-xs text-text-muted">{data.fotos.length} foto(s) selecionada(s).</p>
            )}
            <Button type="button" variant="primary" onClick={() => setStep(5)} className="w-full">
              Seguinte
            </Button>
          </StepShell>
        )}

        {step === 5 && (
          <StepShell step={5} title="Contacto" subtitle="Para te enviarmos a proposta." onBack={() => setStep(4)}>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">Nome</label>
                <input
                  required
                  className="input"
                  value={data.nome}
                  onChange={(e) => setData((d) => ({ ...d, nome: e.target.value }))}
                />
              </div>
              <div>
                <label className="label">WhatsApp ou email</label>
                <input
                  required
                  className="input"
                  placeholder="email@exemplo.com ou 9XXXXXXXX"
                  value={data.contacto}
                  onChange={(e) => setData((d) => ({ ...d, contacto: e.target.value }))}
                />
              </div>

              {error && <p className="text-sm text-red-400">{error}</p>}

              <Button type="submit" disabled={status === "loading"} variant="primary" className="w-full">
                {status === "loading" ? "A enviar..." : "Pedir avaliação"}
              </Button>

              <p className="text-center text-xs text-text-muted">
                Também podes contactar-nos diretamente em {STORE.supportEmail} ou {STORE.supportPhone}.
              </p>
            </form>
          </StepShell>
        )}
      </div>
    </div>
  );
}
