import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // images: {
  //   minimumCacheTTL: 86400 * 120,
  //   formats: ["image/webp", "image/avif"],
  // },
  async headers() {
    return [
      {
        source: '/images/flags/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },

};

export default nextConfig;
