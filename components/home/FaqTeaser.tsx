import Link from "next/link";
import { FAQS } from "@/lib/faq";

export function FaqTeaser() {
  const preview = FAQS.slice(0, 4);

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold">Perguntas frequentes</h2>
        <Link href="/faq" className="text-sm text-primary-light hover:underline">
          Ver todas
        </Link>
      </div>
      <div className="card divide-y divide-border px-5">
        {preview.map((item) => (
          <details key={item.q} className="group py-4">
            <summary className="cursor-pointer list-none font-medium marker:content-none">
              {item.q}
            </summary>
            <p className="mt-2 text-sm text-text-muted">{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
