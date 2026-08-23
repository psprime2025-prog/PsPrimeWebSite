import type { Metadata } from "next";
import { STORE } from "@/lib/constants";

export const metadata: Metadata = { title: "Contactos" };

export default function ContactosPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold">Contactos</h1>
      <p className="mt-4 text-text-muted">
        Tens uma dúvida sobre um produto, uma encomenda ou queres saber mais sobre a PsPrime?
        Estamos disponíveis através de:
      </p>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="card p-6">
          <h2 className="font-semibold">Email</h2>
          <a href={`mailto:${STORE.supportEmail}`} className="mt-1 block text-primary-light hover:underline">
            {STORE.supportEmail}
          </a>
        </div>
        <div className="card p-6">
          <h2 className="font-semibold">Telefone</h2>
          <p className="mt-1 text-text-muted">{STORE.supportPhone}</p>
        </div>
        <div className="card p-6 sm:col-span-2">
          <h2 className="font-semibold">Morada</h2>
          <p className="mt-1 text-text-muted">
            {STORE.address.street}, {STORE.address.postalCode} {STORE.address.city},{" "}
            {STORE.address.country}
          </p>
        </div>
      </div>
    </div>
  );
}
