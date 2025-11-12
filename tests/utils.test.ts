import { describe, it, expect, vi } from "vitest";
import { cn, findBestRates } from "../utils";
import { getRates } from "../utils/data";
import type { BankRates, ExchangeRate } from "../utils/definitions";

vi.mock("next/cache", () => ({
  unstable_cache: <T extends (...args: unknown[]) => unknown>(cb: T) => cb,
}));

// Mock places to keep tests offline and deterministic
const mockRatesList: ExchangeRate[] = [
  { currency: "USD", buy: "1", sell: "2" },
  { currency: "EUR", buy: "3", sell: "4" },
];

vi.mock("../utils/places", () => ({
  getCurrentRates: vi.fn(
    async () =>
      [
        { name: "Finabank", logo: "", link: "", rates: mockRatesList },
      ] satisfies BankRates[],
  ),
}));

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

  it("ignores zero rates when determining best values", () => {
    const result = findBestRates([
      {
        name: "Zero Bank",
        logo: "",
        link: "",
        rates: [
          { currency: "USD", buy: "0", sell: "0" },
          { currency: "EUR", buy: "0", sell: "0" },
        ],
      },
      ...sampleRates,
    ]);

    expect(result).toEqual({
      bestBuyUSD: "5.50",
      bestSellUSD: "5.80",
      bestBuyEUR: "5.60",
      bestSellEUR: "6.40",
    });
  });
});

describe("getRates", () => {
  it("returns current rates aggregated from providers", async () => {
    const result = await getRates();
    expect(result?.rates).toEqual([
      { name: "Finabank", logo: "", link: "", rates: mockRatesList },
    ]);
  });
});
