/** @type {import('next').NextConfig} */

let hostPath = ['http', 'localhost', '3000'];
if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
  hostPath = process.env.NEXT_PUBLIC_SUPABASE_URL.split(':');
}

const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
});

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['avatars.githubusercontent.com'],
  },
  // Add this to ensure proper hostname handling in Docker
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
        ],
      },
    ];
  },
};

module.exports = withPWA(nextConfig);
