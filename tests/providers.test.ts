import { describe, it, expect, vi, beforeEach } from "vitest";
import type { ExchangeRate } from "../utils/definitions";

// Mock the api() helper used by provider functions to avoid network
const apiMock = vi.fn<[string | URL, RequestInit?], Promise<{ html: string }>>(
  () => Promise.resolve({ html: "" }),
);

vi.mock("@/utils", () => ({
  api: (...args: [string | URL, RequestInit?]) => apiMock(...args),
}));

// Mock React cache to bypass caching in tests
vi.mock("react", async () => {
  const actual = await vi.importActual<typeof import("react")>("react");
  return {
    ...actual,
    cache: <T extends (...args: unknown[]) => unknown>(fn: T) => fn, // Return the function unwrapped
  };
});

// Mock axios for CME provider
vi.mock("axios", () => {
  return {
    default: {
      post: vi.fn(),
    },
  };
});

import axios from "axios";
import {
  getFinabankExchangeRates,
  getDsbExchangeRates,
  getCBVSExchangeRates,
  getCMEExchangeRates,
  getHakrinbankExchangeRates,
  getRepublicBankExchangeRates,
} from "../utils/places/providers";

beforeEach(() => {
  apiMock.mockReset();
});

describe("providers: parsing", () => {
  it("parses Finabank USD/EUR (giraal) values", async () => {
    apiMock.mockResolvedValue({
      html: `<body>
        Rates USD GIRAAL 5,23 5,67
        and EUR GIRAAL 6,10 6,20
      </body>`,
    });
    const rates = await getFinabankExchangeRates();
    expect(rates).toEqual<ExchangeRate[]>([
      { currency: "USD", buy: "5.23", sell: "5.67" },
      { currency: "EUR", buy: "6.10", sell: "6.20" },
    ]);
  });

  it("parses DSB JSON response", async () => {
    apiMock.mockResolvedValue({
      html: JSON.stringify({
        valuta: { USD: { buy: "1", sell: "2" }, EUR: { buy: "3", sell: "4" } },
      }),
    });
    const rates = await getDsbExchangeRates();
    expect(rates).toEqual<ExchangeRate[]>([
      { currency: "USD", buy: "1", sell: "2" },
      { currency: "EUR", buy: "3", sell: "4" },
    ]);
  });

  it("parses CBVS table with comma decimals", async () => {
    apiMock.mockResolvedValue({
      html: `<div class="rate-info">
        <table>
          <tr><td>USD</td><td>5,50</td><td>5,80</td></tr>
          <tr><td>EUR</td><td>6,10</td><td>6,40</td></tr>
        </table>
      </div>`,
    });
    const rates = await getCBVSExchangeRates();
    expect(rates).toEqual<ExchangeRate[]>([
      { currency: "USD", buy: "5.50", sell: "5.80" },
      { currency: "EUR", buy: "6.10", sell: "6.40" },
    ]);
  });

  it("returns zeros when CBVS page parse fails", async () => {
    apiMock.mockRejectedValue(new Error("network error"));
    const rates = await getCBVSExchangeRates();
    expect(rates).toEqual<ExchangeRate[]>([
      { currency: "USD", buy: "0.00", sell: "0.00" },
      { currency: "EUR", buy: "0.00", sell: "0.00" },
    ]);
  });

  it("parses CME JSON payload", async () => {
    // Mock axios.post to return successful response
    vi.spyOn(axios, "post").mockResolvedValue({
      status: 200,
      data: [
        {
          BuyUsdExchangeRate: 5.5,
          SaleUsdExchangeRate: 5.8,
          BuyEuroExchangeRate: 6.1,
          SaleEuroExchangeRate: 6.4,
        },
      ],
    });

    const rates = await getCMEExchangeRates();
    expect(rates).toEqual<ExchangeRate[]>([
      { currency: "USD", buy: "5.50", sell: "5.80" },
      { currency: "EUR", buy: "6.10", sell: "6.40" },
    ]);

    // Restore the mock
    vi.mocked(axios.post).mockRestore();
  });

  it("parses Hakrinbank table with headers", async () => {
    apiMock.mockResolvedValue({
      html: `
      <table>
        <thead>
          <tr><th>Foreign Exchange</th><th>Purchase</th><th>Sale</th></tr>
        </thead>
        <tbody>
          <tr><td>USD</td><td>5.25</td><td>5.65</td></tr>
          <tr><td>Euro</td><td>6.15</td><td>6.45</td></tr>
        </tbody>
      </table>`,
    });
    const rates = await getHakrinbankExchangeRates();
    expect(rates).toEqual<ExchangeRate[]>([
      { currency: "USD", buy: "5.25", sell: "5.65" },
      { currency: "EUR", buy: "6.15", sell: "6.45" },
    ]);
  });

  it("parses Republic Bank table with specific headers", async () => {
    apiMock.mockResolvedValue({
      html: `
      <table>
        <thead>
          <tr><th>Abbr.</th><th>Buy (Cash)</th><th>Other</th><th>Sell</th></tr>
        </thead>
        <tbody>
          <tr><td>USD</td><td>5.40</td><td>-</td><td>5.85</td></tr>
          <tr><td>EURO</td><td>6.05</td><td>-</td><td>6.50</td></tr>
        </tbody>
      </table>`,
    });
    const rates = await getRepublicBankExchangeRates();
    expect(rates).toEqual<ExchangeRate[]>([
      { currency: "USD", buy: "5.40", sell: "5.85" },
      { currency: "EUR", buy: "6.05", sell: "6.50" },
    ]);
  });
});
