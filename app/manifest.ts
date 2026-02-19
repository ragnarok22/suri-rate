import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "SuriRate \u2013 Compare Suriname's Exchange Rates",
    short_name: "SuriRate",
    description:
      "Compare USD and EUR exchange rates from Suriname's major banks in one place",
    start_url: "/",
    display: "standalone",
    display_override: ["standalone", "browser"],
    background_color: "#1e3a8a",
    theme_color: "#1e40af",
    orientation: "portrait-primary",
    lang: "en",
    scope: "/",
    categories: ["finance", "business"],
    icons: [
      {
        src: "/icon-144x144.png",
        sizes: "144x144",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-256x256.png",
        sizes: "256x256",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-384x384.png",
        sizes: "384x384",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/android-chrome-512x512.png",
        sizes: "512x512",
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
        purpose: "maskable",
      },
    ],
  };
}
