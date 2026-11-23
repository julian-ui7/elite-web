import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // CSS en línea: con Tailwind el CSS es pequeño (~13 KB) y así no bloquea el primer pintado.
  experimental: { inlineCss: true },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  images: {
    formats: ["image/avif", "image/webp"],
    // Next 16 exige declarar las calidades permitidas.
    qualities: [60, 75, 85],
    minimumCacheTTL: 31536000,
  },
};

export default nextConfig;
