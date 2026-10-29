const MINI_SERVIDOR_URL = 'http://localhost:3000';
const BACKEND_URL = 'http://localhost:3001';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${BACKEND_URL}/api/:path*`,
        source: '/mini-servidor/:path*',
        destination: `${MINI_SERVIDOR_URL}/mini-servidor/:path*`,
      },
    ];
  },
};

export default nextConfig;