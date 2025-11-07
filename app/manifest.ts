import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "SuriRate",
    short_name: "SuriRate",
    description:
      "Compare USD and EUR exchange rates in Suriname from Finabank, Central Bank, and CME.",
    start_url: "/",
    display: "standalone",
    display_override: ["standalone", "browser"],
    background_color: "#f8fafc",
    theme_color: "#f8fafc",
    orientation: "portrait",
    lang: "en",
    scope: "/",
    categories: ["finance", "productivity"],
    icons: [
      {
        src: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
