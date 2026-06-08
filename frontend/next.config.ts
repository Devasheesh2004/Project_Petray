import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    // Determine the backend URL. Fallback to localhost if not set.
    // We strip any trailing '/api' because the destination already adds it.
    const baseUrl = process.env.NEXT_PUBLIC_API_URL 
      ? process.env.NEXT_PUBLIC_API_URL.replace(/\/api\/?$/, '') 
      : 'http://localhost:3001';

    return [
      {
        source: '/api/:path*',
        destination: `${baseUrl}/api/:path*`, // Proxy to Backend
      },
    ];
  },
};

export default nextConfig;
