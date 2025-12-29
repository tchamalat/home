import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  turbopack: {
    resolveAlias: {
      '@': '../',
    },
  },
};

export default nextConfig;
