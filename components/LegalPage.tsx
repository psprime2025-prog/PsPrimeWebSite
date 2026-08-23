export function LegalPage({
  title,
  updatedAt,
  children,
}: {
  title: string;
  updatedAt: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold">{title}</h1>
      <p className="mt-1 text-sm text-text-muted">Última atualização: {updatedAt}</p>
      <div className="prose-legal mt-8 space-y-4 text-sm leading-relaxed text-text-muted [&_h2]:mt-6 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-text [&_strong]:text-text">
        {children}
      </div>
    </div>
  );
}
