import type { MetadataRoute } from "next";
import { getRates } from "@/utils/data";
import { bankPages } from "@/utils/bank-pages";

const siteUrl = "https://suri-rate.ragnarok22.dev";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const data = await getRates();
  const lastModified = data?.updatedAt ? new Date(data.updatedAt) : new Date();

  const staticRoutes: Array<{
    path: string;
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
    priority: number;
    modified?: Date;
  }> = [
    {
      path: "/",
      changeFrequency: "daily",
      priority: 1,
      modified: lastModified,
    },
    { path: "/about", changeFrequency: "monthly", priority: 0.6 },
    { path: "/methodology", changeFrequency: "monthly", priority: 0.6 },
    { path: "/banks", changeFrequency: "weekly", priority: 0.7 },
    { path: "/offline.html", changeFrequency: "yearly", priority: 0.1 },
    { path: "/manifest.webmanifest", changeFrequency: "yearly", priority: 0.4 },
  ];

  const bankRoutes = bankPages.map((bank) => ({
    url: `${siteUrl}/banks/${bank.slug}`,
    lastModified,
    changeFrequency: "weekly" as const,
    priority: 0.5,
  }));

  const mappedStatics = staticRoutes.map((route) => ({
    url: `${siteUrl}${route.path}`,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
    lastModified: route.modified ?? new Date(),
  }));

  return [...mappedStatics, ...bankRoutes];
}
