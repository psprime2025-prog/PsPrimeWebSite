import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

// Alguns painéis de hosting cortam/alteram o valor de variáveis de ambiente que
// contenham "$" (interpretam como expansão de shell), o que parte um hash bcrypt
// (formato "$2b$10$..."). Para evitar isso, ADMIN_PASSWORD_HASH pode ser guardado
// em base64 (sem "$") — descodificamos aqui antes de comparar. Continua a aceitar
// o hash bcrypt "cru" para quem preferir configurar assim.
function resolveAdminPasswordHash(value: string): string {
  if (value.startsWith("$2")) return value;
  try {
    const decoded = Buffer.from(value, "base64").toString("utf8");
    return decoded.startsWith("$2") ? decoded : value;
  } catch {
    return value;
  }
}

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  pages: {
    signIn: "/admin/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credenciais",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Palavra-passe", type: "password" },
      },
      async authorize(credentials) {
        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;

        if (!adminEmail || !adminPasswordHash) {
          throw new Error(
            "Login de administração não configurado (ADMIN_EMAIL / ADMIN_PASSWORD_HASH em falta)."
          );
        }

        if (!credentials?.email || !credentials?.password) return null;

        if (credentials.email.toLowerCase() !== adminEmail.toLowerCase()) return null;

        const valid = await bcrypt.compare(
          credentials.password,
          resolveAdminPasswordHash(adminPasswordHash)
        );
        if (!valid) return null;

        return { id: "admin", email: adminEmail, name: "Administrador", role: "admin" };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as { role?: string }).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { role?: string }).role = token.role as string | undefined;
      }
      return session;
    },
  },
};
