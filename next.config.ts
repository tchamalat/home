import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  turbopack: {
    resolveAlias: {
      '@': '../',
    },
  },
  serverExternalPackages: [
    'dockerode',
    'docker-modem',
    'ssh2',
    'cpu-features'
  ],
};

export default nextConfig;
