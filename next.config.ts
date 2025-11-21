import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_API_BASE_URL: 'https://dev-api.mmfans.rs',
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // Fix for Turbopack build manifest errors
  experimental: {
    turbo: {
      // Suppress build manifest errors in development
      resolveAlias: {},
    },
  },
  // Suppress ENOENT errors for build manifest files
  webpack: (config, { dev, isServer }) => {
    if (dev) {
      // Ignore build manifest errors in development
      config.ignoreWarnings = [
        ...(config.ignoreWarnings || []),
        {
          module: /app-build-manifest/,
        },
        {
          file: /_buildManifest/,
        },
      ];
    }
    return config;
  },
};

export default nextConfig;
