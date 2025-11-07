import type { MetadataRoute } from "next";

const siteUrl = "https://suri-rate.ragnarok22.dev";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      crawlDelay: 2,
    },
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
