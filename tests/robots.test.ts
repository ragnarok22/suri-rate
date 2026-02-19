import { describe, it, expect } from "vitest";
import robots from "../app/robots";

describe("robots", () => {
  it("returns valid robots config", () => {
    const result = robots();
    expect(result.rules).toBeDefined();
    expect(result.sitemap).toContain("sitemap.xml");
    expect(result.host).toContain("suri-rate");
  });

  it("allows all user agents", () => {
    const result = robots();
    const rules = Array.isArray(result.rules) ? result.rules[0] : result.rules;
    expect(rules.userAgent).toBe("*");
    expect(rules.allow).toBe("/");
  });
});
