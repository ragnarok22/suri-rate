import type { NextConfig } from "next";

// Configure cache duration for exchange rates (in hours)
const CACHE_HOURS = 12;
const CACHE_SECONDS = CACHE_HOURS * 60 * 60;

const nextConfig: NextConfig = {
  // Enable Cache Components for 'use cache' directive
  cacheComponents: true,
  // Custom cache profile for exchange rates
  cacheLife: {
    exchangeRates: {
      stale: 300, // 5 minutes - client can use cached data
      revalidate: CACHE_SECONDS, // 12 hours - background refresh interval
      expire: CACHE_SECONDS * 2, // 24 hours - hard expiration
    },
  },
  images: {
    remotePatterns: [new URL("https://finabanknv.com/**")],
  },
  // Empty turbopack config to silence webpack/turbopack warning in Next.js 16
  turbopack: {},
};

export default nextConfig;
