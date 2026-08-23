import type { Metadata } from "next";
import { STORE } from "@/lib/constants";
import { FAQS } from "@/lib/faq";

export const metadata: Metadata = { title: "FAQ" };

export default function FaqPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold">Perguntas Frequentes</h1>
      <div className="mt-8 divide-y divide-border">
        {FAQS.map((item) => (
          <details key={item.q} className="group py-4">
            <summary className="cursor-pointer list-none font-medium marker:content-none">
              {item.q}
            </summary>
            <p className="mt-2 text-sm text-text-muted">{item.a}</p>
          </details>
        ))}
      </div>
      <p className="mt-8 text-sm text-text-muted">
        Não encontraste resposta à tua dúvida? Contacta-nos em {STORE.supportEmail}.
      </p>
    </div>
  );
}
