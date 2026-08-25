import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // 75 é o valor por omissão do Next.js; 95 é usado nas imagens do Hero
    // (produto em destaque) para evitar a perda de qualidade visível em
    // fotografia de produto com gradientes subtis.
    qualities: [75, 95],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        // Apenas para imagens de exemplo do seed — remover quando os produtos reais
        // estiverem no Supabase Storage.
        protocol: "https",
        hostname: "placehold.co",
      },
    ],
  },
};

export default nextConfig;
