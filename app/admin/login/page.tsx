"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/Button";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    // DEBUG TEMPORÁRIO — mostra o erro real do NextAuth em vez da mensagem
    // genérica, para diagnosticar a falha de login em produção. Remover depois.
    console.log("[admin-login-debug] signIn result:", result);

    if (result?.error) {
      setError(
        `Credenciais inválidas. [debug: error=${result.error} status=${result.status} ok=${result.ok}]`
      );
      return;
    }

    router.push(searchParams.get("callbackUrl") ?? "/admin");
    router.refresh();
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-sm flex-col justify-center px-4">
      <h1 className="text-2xl font-bold">Administração PsPrime</h1>
      <form onSubmit={handleSubmit} className="card mt-6 space-y-4 p-6">
        <div>
          <label className="label">Email</label>
          <input
            required
            type="email"
            className="input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label className="label">Palavra-passe</label>
          <input
            required
            type="password"
            className="input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error && <p className="text-sm text-red-400">{error}</p>}
        <Button type="submit" disabled={loading} variant="primary" className="w-full">
          {loading ? "A entrar..." : "Entrar"}
        </Button>
      </form>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
