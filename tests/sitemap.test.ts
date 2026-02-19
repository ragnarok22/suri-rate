import { describe, it, expect, vi } from "vitest";

vi.mock("next/cache", () => ({
  cacheLife: vi.fn(),
}));

vi.mock("../utils/places", () => ({
  getCurrentRates: vi.fn(async () => []),
}));

import sitemap from "../app/sitemap";

describe("sitemap", () => {
  it("returns an array of sitemap entries", async () => {
    const entries = await sitemap();
    expect(Array.isArray(entries)).toBe(true);
    expect(entries.length).toBeGreaterThan(0);
  });

  it("includes the homepage with priority 1", async () => {
    const entries = await sitemap();
    const home = entries.find((e) => e.url.endsWith("/"));
    expect(home).toBeDefined();
    expect(home!.priority).toBe(1);
  });

  it("includes static routes", async () => {
    const entries = await sitemap();
    const urls = entries.map((e) => e.url);
    expect(urls.some((u) => u.includes("/about"))).toBe(true);
    expect(urls.some((u) => u.includes("/methodology"))).toBe(true);
    expect(urls.some((u) => u.includes("/banks"))).toBe(true);
  });

  it("includes bank detail pages", async () => {
    const entries = await sitemap();
    const urls = entries.map((e) => e.url);
    expect(urls.some((u) => u.includes("/banks/finabank"))).toBe(true);
    expect(urls.some((u) => u.includes("/banks/dsb"))).toBe(true);
  });

  it("all entries have url and changeFrequency", async () => {
    const entries = await sitemap();
    for (const entry of entries) {
      expect(entry.url).toBeTruthy();
      expect(entry.changeFrequency).toBeTruthy();
    }
  });
});
