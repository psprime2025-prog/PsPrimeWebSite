"use client";

// Só dispara se o próprio layout raiz falhar (caso extremo). Por isso tem
// de desenhar a própria <html>/<body> — nunca lê nem mostra `error` ao cliente.
export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="pt-PT">
      <body
        style={{
          display: "flex",
          minHeight: "100vh",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "1rem",
          padding: "1.5rem",
          textAlign: "center",
          background: "#05070B",
          color: "#F5F7FA",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <h1 style={{ fontSize: "1.5rem", fontWeight: 700 }}>Algo correu mal</h1>
        <p style={{ color: "#A7AFBC", maxWidth: "28rem" }}>
          Não foi possível carregar o PsPrime. Tenta novamente dentro de instantes.
        </p>
        <button
          onClick={reset}
          style={{
            borderRadius: "9999px",
            padding: "0.625rem 1.5rem",
            background: "#1677FF",
            color: "#fff",
            border: "none",
            fontWeight: 500,
            cursor: "pointer",
          }}
        >
          Tentar novamente
        </button>
      </body>
    </html>
  );
}
