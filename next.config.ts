import type { NextConfig } from "next";
import withPWA from "next-pwa";

// Minimal types to avoid implicit any in runtimeCaching matchers
type UrlMatch = { request: Request; url: URL };

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

// Avoid wrapping with next-pwa in development so Turbopack stays enabled.
const isDev = process.env.NODE_ENV === "development";

const pwaPlugin = withPWA({
  dest: "public",
  disable: isDev,
  register: true,
  skipWaiting: false,
  clientsClaim: true,
  // Provide sensible runtime caching and an offline fallback in production
  fallbacks: {
    document: "/offline.html",
  },
  runtimeCaching: [
    // HTML navigations – try network first, fallback to cache/offline
    {
      urlPattern: ({ request }: UrlMatch) => request.mode === "navigate",
      handler: "NetworkFirst",
      options: {
        cacheName: "html-navigations",
        networkTimeoutSeconds: 10,
        expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 },
      },
    },
    // Static assets (JS/CSS) – SWR
    {
      urlPattern: ({ request }: UrlMatch) =>
        request.destination === "script" || request.destination === "style",
      handler: "StaleWhileRevalidate",
      options: {
        cacheName: "static-assets",
        expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 * 7 },
      },
    },
    // Images – SWR
    {
      urlPattern: ({ request }: UrlMatch) => request.destination === "image",
      handler: "StaleWhileRevalidate",
      options: {
        cacheName: "images",
        expiration: { maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 * 30 },
      },
    },
    // Fonts – CacheFirst (immutable)
    {
      urlPattern: ({ request, url }: UrlMatch) =>
        request.destination === "font" ||
        /\.(?:woff2?|ttf|otf)$/.test(url.pathname),
      handler: "CacheFirst",
      options: {
        cacheName: "fonts",
        expiration: { maxEntries: 30, maxAgeSeconds: 60 * 60 * 24 * 365 },
      },
    },
  ],
});

const config = isDev ? nextConfig : pwaPlugin(nextConfig);

export default config;
