import { ButtonLink } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-4 text-center sm:px-6">
      <span className="badge-condition border-primary/40 text-primary-light">404</span>
      <h1 className="mt-4 text-2xl font-bold">Página não encontrada</h1>
      <p className="mt-2 text-text-muted">
        A página que procuras pode ter sido removida ou o link está incorreto.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <ButtonLink href="/" variant="primary">
          Página inicial
        </ButtonLink>
        <ButtonLink href="/catalogo" variant="secondary">
          Ver catálogo
        </ButtonLink>
      </div>
    </div>
  );
}
