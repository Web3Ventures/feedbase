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
  transpilePackages: ['ui'],
  images: {
    remotePatterns: [
      {
        protocol: hostPath[0],
        hostname: hostPath[1].replace('//', ''),
        port: hostPath[2],
        pathname: '/storage/v1/object/public/changelog-images/**',
      },
      {
        protocol: hostPath[0],
        hostname: hostPath[1].replace('//', ''),
        port: hostPath[2],
        pathname: '/storage/v1/object/public/projects/**',
      },
    ],
  },
};

module.exports = withPWA(nextConfig);
