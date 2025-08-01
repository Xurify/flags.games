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
      {
        source: '/ingest/static/(web-vitals.js|dead-clicks-autocapture.js|recorder.js|exception-autocapture.js|surveys.js)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=15768000, immutable', // 6 months,
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
    ]
  },

  async rewrites() {
    return [
      {
        source: '/ingest/static/:path*',
        destination: 'https://eu-assets.i.posthog.com/static/:path*',
      },
      {
        source: '/ingest/:path*',
        destination: 'https://eu.i.posthog.com/:path*',
      },
      {
        source: '/ingest/decide',
        destination: 'https://eu.i.posthog.com/decide',
      },
    ]
  },

  // This is required to support PostHog trailing slash API requests
  skipTrailingSlashRedirect: true,
};

export default nextConfig;
