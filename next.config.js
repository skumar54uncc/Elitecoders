/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'sffpmadbaghimelsuaym.supabase.co',
        pathname: '/**',
      },
    ],
  },
  // Ensure Prisma client is generated during build
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Exclude Prisma from webpack bundling
      config.externals.push('@prisma/client');
    }
    return config;
  },
}

module.exports = nextConfig

