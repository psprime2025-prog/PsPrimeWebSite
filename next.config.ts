import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
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
