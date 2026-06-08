import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    // Hardcoding the Render URL ensures Vercel knows exactly where to proxy,
    // even if Vercel environment variables are missing or a redeploy was skipped!
    const baseUrl = process.env.NODE_ENV === 'production' 
      ? 'https://project-petray-backend.onrender.com'
      : (process.env.NEXT_PUBLIC_API_URL 
          ? process.env.NEXT_PUBLIC_API_URL.replace(/\/api\/?$/, '') 
          : 'http://localhost:3001');

    return [
      {
        source: '/api/:path*',
        destination: `${baseUrl}/api/:path*`, // Proxy to Backend
      },
    ];
  },
};

export default nextConfig;
