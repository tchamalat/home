import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: process.env.DOCKER_BUILD ? 'standalone' : undefined,
  turbopack: {
    resolveAlias: {
      '@': '../',
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.googleusercontent.com',
      },
    ],
  },
  serverExternalPackages: [
    'dockerode',
    'docker-modem',
    'ssh2',
    'cpu-features'
  ],
};

export default nextConfig;
