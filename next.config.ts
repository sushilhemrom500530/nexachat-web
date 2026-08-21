import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/backend-api/:path*',
        destination: 'https://frontend-task-chatapp.onrender.com/api/:path*',
      },
    ];
  },
};

export default nextConfig;
