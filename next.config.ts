import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable image optimization for portability
  images: {
    unoptimized: true,
  },
  // Mark esbuild as external to prevent Turbopack from trying to bundle its binary
  serverExternalPackages: ['esbuild'],
};

export default nextConfig;
