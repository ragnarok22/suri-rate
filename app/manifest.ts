import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Suri Rate",
    short_name: "Suri Rate",
    description:
      "SuriRate helps you find the best exchange rates in Suriname by comparing USD and EUR rates from Finabank, the Central Bank, and CME – all in one place, updated daily.",
    start_url: "/",
    display: "standalone",
    background_color: "#FFFFFF",
    theme_color: "#000000",
    icons: [
      {
        src: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
