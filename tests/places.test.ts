import { describe, it, expect, vi } from "vitest";
import { getCurrentRates } from "../utils/places";
import {
  getCBVSExchangeRates,
  getCMEExchangeRates,
  getDsbExchangeRates,
  getFinabankExchangeRates,
  getHakrinbankExchangeRates,
  getRepublicBankExchangeRates,
} from "../utils/places/providers";
import type { ExchangeRate } from "../utils/definitions";
import axios from "axios";

vi.mock("axios");
const mockedAxios = axios as unknown as {
  get: ReturnType<typeof vi.fn>;
  post: ReturnType<typeof vi.fn>;
};

const mockRates: ExchangeRate[] = [
  { currency: "USD", buy: "1", sell: "2" },
  { currency: "EUR", buy: "3", sell: "4" },
];

vi.mock("../utils/places/providers", () => ({
  getFinabankExchangeRates: vi.fn(async () => mockRates),
  getCBVSExchangeRates: vi.fn(async () => mockRates),
  getCMEExchangeRates: vi.fn(async () => mockRates),
  getHakrinbankExchangeRates: vi.fn(async () => mockRates),
  getDsbExchangeRates: vi.fn(async () => mockRates),
  getRepublicBankExchangeRates: vi.fn(async () => mockRates),
}));

describe("getCurrentRates", () => {
  it("returns current rates from all banks", async () => {
    const result = await getCurrentRates();
    expect(result).toHaveLength(6);
    expect(result[0].rates).toEqual(mockRates);
  });

  it("fetches banks concurrently while preserving bank order and rate associations", async () => {
    vi.useFakeTimers();
    try {
      const providerCalls = [
        getFinabankExchangeRates,
        getCBVSExchangeRates,
        getCMEExchangeRates,
        getHakrinbankExchangeRates,
        getDsbExchangeRates,
        getRepublicBankExchangeRates,
      ];
      const delays = [60, 50, 40, 30, 20, 10];
      const expectedRates = delays.map((delay) => [
        {
          currency: "USD" as const,
          buy: String(delay),
          sell: String(delay + 1),
        },
      ]);

      providerCalls.forEach((provider, index) => {
        vi.mocked(provider).mockImplementationOnce(
          () =>
            new Promise((resolve) => {
              setTimeout(() => resolve(expectedRates[index]), delays[index]);
            }),
        );
      });

      const startedAt = Date.now();
      const pendingRates = getCurrentRates();
      await vi.runAllTimersAsync();
      const result = await pendingRates;

      expect(Date.now() - startedAt).toBe(Math.max(...delays));
      expect(result.map((bank) => bank.name)).toEqual([
        "Finabank",
        "Central Bank",
        "Central Money Exchange",
        "Hakrinbank",
        "De Surinaamsche Bank (DSB)",
        "Republic Bank",
      ]);
      expect(result.map((bank) => bank.rates)).toEqual(expectedRates);
    } finally {
      vi.useRealTimers();
    }
  });

  // Fallback behavior is covered in providers.test.ts (CBVS)
});

describe("getDsbExchangeRates", () => {
  it("parses response from DSB API", async () => {
    mockedAxios.get.mockResolvedValue({
      data: {
        valuta: { USD: { buy: "1", sell: "2" }, EUR: { buy: "3", sell: "4" } },
      },
    });
    const rates = await getDsbExchangeRates();
    expect(rates).toEqual([
      { currency: "USD", buy: "1", sell: "2" },
      { currency: "EUR", buy: "3", sell: "4" },
    ]);
  });
});
