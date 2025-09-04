import type { NextConfig } from "next";
import withPWA from "next-pwa";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [new URL("https://finabanknv.com/**")],
  },
};

// Avoid wrapping with next-pwa in development so Turbopack stays enabled.
const isDev = process.env.NODE_ENV === "development";

const pwaPlugin = withPWA({
  dest: "public",
  disable: isDev,
  register: true,
  skipWaiting: true,
  // Provide sensible runtime caching and an offline fallback in production
  fallbacks: {
    document: "/offline.html",
  },
  runtimeCaching: [
    // HTML navigations – try network first, fallback to cache/offline
    {
      urlPattern: ({ request }) => request.mode === "navigate",
      handler: "NetworkFirst",
      options: {
        cacheName: "html-navigations",
        networkTimeoutSeconds: 10,
        expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 },
      },
    },
    // Static assets (JS/CSS) – SWR
    {
      urlPattern: ({ request }) =>
        request.destination === "script" || request.destination === "style",
      handler: "StaleWhileRevalidate",
      options: {
        cacheName: "static-assets",
        expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 * 7 },
      },
    },
    // Images – SWR
    {
      urlPattern: ({ request }) => request.destination === "image",
      handler: "StaleWhileRevalidate",
      options: {
        cacheName: "images",
        expiration: { maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 * 30 },
      },
    },
    // Fonts – CacheFirst (immutable)
    {
      urlPattern: ({ request, url }) =>
        request.destination === "font" || /\.(?:woff2?|ttf|otf)$/.test(url.pathname),
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
