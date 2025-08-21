import { describe, it, expect, vi } from "vitest";
import { getCurrentRates } from "../utils/places";
import { getDsbExchangeRates } from "../utils/places/providers";
import type { ExchangeRate } from "../utils/definitions";
import axios from "axios";

vi.mock("axios");
const mockedAxios = axios as unknown as { get: any; post: any };

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
