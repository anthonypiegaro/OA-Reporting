import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    serverActions: {
      allowedOrigins: [
        'localhost:3000'
      ]
    }
  },
  eslint: {
    ignoreDuringBuilds: true, // Disables ESLint during builds
  },
  typescript: {
    ignoreBuildErrors: true, // Skip type checking during builds
  },
};

export default nextConfig;
