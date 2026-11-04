import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: [
    '@lalbindu/api-client',
    '@lalbindu/business-rules',
    '@lalbindu/design-tokens',
    '@lalbindu/shared-types',
    '@lalbindu/validation'
  ],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
};

export default nextConfig;
