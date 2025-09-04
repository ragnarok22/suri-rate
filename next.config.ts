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
});

const config = isDev ? nextConfig : pwaPlugin(nextConfig);

export default config;
