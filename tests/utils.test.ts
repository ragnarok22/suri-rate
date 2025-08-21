import { describe, it, expect, beforeEach, vi } from "vitest";
import { cn, findBestRates } from "../utils";
import { saveRates, getRates } from "../utils/data";
import type { BankRates } from "../utils/definitions";

vi.mock("../utils/redis", () => {
  const store = new Map<string, string>();
  return {
    getRedisClient: async () => ({
      isOpen: true,
      connect: vi.fn(),
      set: vi.fn((key: string, value: string) => {
        store.set(key, value);
      }),
      get: vi.fn((key: string) => store.get(key)),
    }),
  };
});

describe("cn", () => {
  it("joins truthy class names with spaces", () => {
    expect(cn("foo", "", "bar", "", "baz")).toBe("foo bar baz");
  });

  it("returns empty string when all values are falsy", () => {
    expect(cn("", "")).toBe("");
  });
});

describe("findBestRates", () => {
  const sampleRates: BankRates[] = [
    {
      name: "Finabank",
      logo: "",
      link: "",
      rates: [
        { currency: "USD", buy: "5.00", sell: "6.00" },
        { currency: "EUR", buy: "5.50", sell: "6.50" },
      ],
    },
    {
      name: "Central Bank",
      logo: "",
      link: "",
      rates: [
        { currency: "USD", buy: "5.50", sell: "5.80" },
        { currency: "EUR", buy: "5.60", sell: "6.40" },
      ],
    },
  ];

  it("calculates best buy and sell values for USD and EUR", () => {
    const result = findBestRates(sampleRates);
    expect(result).toEqual({
      bestBuyUSD: "5.50",
      bestSellUSD: "5.80",
      bestBuyEUR: "5.60",
      bestSellEUR: "6.40",
    });
  });
});

describe("saveRates and getRates", () => {
  const rates: BankRates[] = [
    {
      name: "Finabank",
      logo: "",
      link: "",
      rates: [
        { currency: "USD", buy: "1", sell: "2" },
        { currency: "EUR", buy: "3", sell: "4" },
      ],
    },
  ];

  it("persists and retrieves rates using redis client", async () => {
    await saveRates(rates);
    const result = await getRates();
    expect(result?.rates).toEqual(rates);
    expect(result?.updatedAt).toBeDefined();
  });
});
