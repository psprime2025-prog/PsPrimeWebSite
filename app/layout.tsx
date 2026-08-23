import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CookieBanner } from "@/components/CookieBanner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "PsPrime — Consolas e produtos PlayStation seminovos",
    template: "%s | PsPrime",
  },
  description:
    "PsPrime: consolas, comandos, jogos e acessórios PlayStation seminovos, testados e recondicionados. Envio para todo Portugal.",
  keywords: [
    "PlayStation",
    "PS5",
    "PS4",
    "PS3",
    "PS2",
    "PS1",
    "consolas seminovas",
    "comandos PlayStation",
    "jogos PlayStation",
  ],
  openGraph: {
    title: "PsPrime — Consolas e produtos PlayStation seminovos",
    description:
      "Consolas, comandos, jogos e acessórios PlayStation seminovos, testados e recondicionados.",
    locale: "pt_PT",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-PT" className={geistSans.variable}>
      <body className="flex min-h-screen flex-col font-sans">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <CookieBanner />
      </body>
    </html>
  );
}
