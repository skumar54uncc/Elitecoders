/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
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

