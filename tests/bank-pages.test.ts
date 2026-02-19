import { describe, it, expect } from "vitest";
import { bankPages, findBankPageBySlug, bankSlugs } from "../utils/bank-pages";

describe("bankPages", () => {
  it("contains all 6 banks", () => {
    expect(bankPages).toHaveLength(6);
  });

  it("each entry has required fields", () => {
    for (const bank of bankPages) {
      expect(bank.name).toBeTruthy();
      expect(bank.slug).toBeTruthy();
      expect(bank.summary).toBeTruthy();
      expect(bank.website).toMatch(/^https?:\/\//);
      expect(bank.headquarters).toBeTruthy();
      expect(bank.founded).toBeTruthy();
      expect(bank.highlights.length).toBeGreaterThan(0);
      expect(bank.services.length).toBeGreaterThan(0);
    }
  });

  it("slugs are unique", () => {
    const slugs = bankPages.map((b) => b.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });
});

describe("findBankPageBySlug", () => {
  it("returns the correct bank for a known slug", () => {
    const bank = findBankPageBySlug("finabank");
    expect(bank).toBeDefined();
    expect(bank!.name).toBe("Finabank");
  });

  it("returns undefined for an unknown slug", () => {
    expect(findBankPageBySlug("nonexistent")).toBeUndefined();
  });

  it("finds each bank by its slug", () => {
    for (const bank of bankPages) {
      expect(findBankPageBySlug(bank.slug)).toBe(bank);
    }
  });
});

describe("bankSlugs", () => {
  it("returns all slugs as an array of strings", () => {
    const slugs = bankSlugs();
    expect(slugs).toHaveLength(6);
    expect(slugs).toEqual(bankPages.map((b) => b.slug));
  });
});
