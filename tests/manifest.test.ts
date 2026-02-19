import { describe, it, expect } from "vitest";
import manifest from "../app/manifest";

describe("manifest", () => {
  it("returns valid web app manifest", () => {
    const result = manifest();
    expect(result.name).toContain("SuriRate");
    expect(result.short_name).toBe("SuriRate");
    expect(result.start_url).toBe("/");
    expect(result.display).toBe("standalone");
    expect(result.lang).toBe("en");
  });

  it("includes required icon sizes", () => {
    const result = manifest();
    const sizes = result.icons!.map((i) => i.sizes);
    expect(sizes).toContain("192x192");
    expect(sizes).toContain("512x512");
  });

  it("includes maskable icons", () => {
    const result = manifest();
    const maskable = result.icons!.filter((i) => i.purpose === "maskable");
    expect(maskable.length).toBeGreaterThan(0);
  });

  it("has finance category", () => {
    const result = manifest();
    expect(result.categories).toContain("finance");
  });
});
