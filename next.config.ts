import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    NEXT_API_BASE_URL: process.env.NEXT_API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || 'https://frontend-task-chatapp.onrender.com/api',
    NEXT_SOCKET_URL: process.env.NEXT_SOCKET_URL || process.env.NEXT_PUBLIC_SOCKET_URL || 'https://frontend-task-chatapp.onrender.com',
    NEXT_DOCS_URL: process.env.NEXT_DOCS_URL || process.env.NEXT_PUBLIC_DOCS_URL || 'https://frontend-task-chatapp.onrender.com/docs/',
  },
  async rewrites() {
    return [
      {
        source: '/backend-api/:path*',
        destination: `${process.env.NEXT_API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || 'https://frontend-task-chatapp.onrender.com/api'}/:path*`,
      },
    ];
  },
};

export default nextConfig;
