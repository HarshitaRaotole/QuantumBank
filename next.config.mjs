/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },

  // Your existing Next.js configuration might be here

  async rewrites() {
    return [
      {
        source: '/api/:path*', // Intercepts requests to /api/ on your frontend domain
        // Proxies them to your backend URL, using the environment variable
        destination: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
