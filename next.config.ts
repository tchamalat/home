import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: process.env.DOCKER_BUILD ? 'standalone' : undefined,
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
