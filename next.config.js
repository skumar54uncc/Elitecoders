/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Blog & careers temporarily disabled for visitors — old links go home
  async redirects() {
    return [
      { source: "/resources", destination: "/", permanent: false },
      { source: "/resources/:path*", destination: "/", permanent: false },
      { source: "/careers", destination: "/", permanent: false },
      { source: "/careers/:path*", destination: "/", permanent: false },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-DNS-Prefetch-Control", value: "on" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
        ],
      },
    ];
  },
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

