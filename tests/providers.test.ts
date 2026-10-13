import { describe, it, expect, vi, beforeEach } from "vitest";
import type { ExchangeRate } from "../utils/definitions";

// Mock the api() helper used by provider functions to avoid network
const apiMock = vi.fn<
  (url: string | URL, init?: RequestInit) => Promise<{ html: string }>
>(() => Promise.resolve({ html: "" }));

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

  it.each(["before", "after"])(
    "parses the current Hakrinbank table with cross rates %s it",
    async (crossRatesPosition) => {
      // Rate tables captured from Hakrinbank's English pages on 2026-10-13.
      // The homepage and foreign-exchange page display them in different orders.
      const exchangeRates = `
        <h2 id="tablepress-13-name">Exchange, Checks and Transfers</h2>
        <table id="tablepress-13" class="tablepress tablepress-id-13" aria-labelledby="tablepress-13-name">
          <thead>
            <tr class="row-1">
              <th class="column-1"> </th><th class="column-2">Purchase</th><th class="column-3">Sale</th>
            </tr>
          </thead>
          <tbody class="row-striping row-hover">
            <tr class="row-2">
              <td class="column-1">USD</td><td class="column-2">37.3500</td><td class="column-3">37.9000</td>
            </tr>
            <tr class="row-3">
              <td class="column-1">EUR</td><td class="column-2">41.7500</td><td class="column-3">42.5800</td>
            </tr>
          </tbody>
        </table>`;
      const crossRates = `
        <h2 id="tablepress-12-name">(Spot) Cross Rates</h2>
        <table id="tablepress-12" class="tablepress tablepress-id-12" aria-labelledby="tablepress-12-name">
          <thead>
            <tr class="row-1">
              <th colspan="2" class="column-1">Foreign Exchange</th>
            </tr>
          </thead>
          <tbody class="row-striping row-hover">
            <tr class="row-2">
              <td class="column-1">EUR / USD</td><td class="column-2">1.0980</td>
            </tr>
            <tr class="row-3">
              <td class="column-1">USD / EUR</td><td class="column-2">1.1380</td>
            </tr>
          </tbody>
        </table>`;
      apiMock.mockResolvedValue({
        html:
          crossRatesPosition === "before"
            ? crossRates + exchangeRates
            : exchangeRates + crossRates,
      });

      await expect(getHakrinbankExchangeRates()).resolves.toEqual<
        ExchangeRate[]
      >([
        { currency: "USD", buy: "37.35", sell: "37.90" },
        { currency: "EUR", buy: "41.75", sell: "42.58" },
      ]);
    },
  );

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
