/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Allow local uploads
    domains: ['localhost'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // Required for SQLite on Vercel - use edge-compatible approach
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client', 'prisma'],
  },
};

module.exports = nextConfig;
