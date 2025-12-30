import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
  // Enable compression for better performance
  compress: true,
  // Generate ETags for better caching
  generateEtags: true,
  // Optimize production builds
  poweredByHeader: false,
  // Trailing slash for better SEO
  trailingSlash: false,
};

export default nextConfig;
