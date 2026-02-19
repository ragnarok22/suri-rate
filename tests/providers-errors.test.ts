import { describe, it, expect, vi, beforeEach } from "vitest";

const apiMock = vi.fn<
  (url: string | URL, init?: RequestInit) => Promise<{ html: string }>
>(() => Promise.resolve({ html: "" }));

vi.mock("@/utils", () => ({
  api: (...args: [string | URL, RequestInit?]) => apiMock(...args),
}));

vi.mock("react", async () => {
  const actual = await vi.importActual<typeof import("react")>("react");
  return {
    ...actual,
    cache: <T extends (...args: unknown[]) => unknown>(fn: T) => fn,
  };
});

vi.mock("axios", () => ({
  default: {
    post: vi.fn(),
    isAxiosError: vi.fn(() => false),
  },
}));

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
  vi.mocked(axios.post).mockReset();
});

describe("Finabank error paths", () => {
  it("throws when api call fails", async () => {
    apiMock.mockRejectedValue(new Error("network error"));
    await expect(getFinabankExchangeRates()).rejects.toThrow("network error");
  });

  it("returns empty array when no USD/EUR matches found", async () => {
    apiMock.mockResolvedValue({ html: "<body>No rates here</body>" });
    const rates = await getFinabankExchangeRates();
    expect(rates).toEqual([]);
  });

  it("parses only USD when EUR is missing", async () => {
    apiMock.mockResolvedValue({
      html: "<body>USD GIRAAL 5,23 5,67</body>",
    });
    const rates = await getFinabankExchangeRates();
    expect(rates).toHaveLength(1);
    expect(rates[0].currency).toBe("USD");
  });
});

describe("DSB error paths", () => {
  it("throws when no valuta key in response", async () => {
    apiMock.mockResolvedValue({ html: JSON.stringify({}) });
    await expect(getDsbExchangeRates()).rejects.toThrow(
      "No exchange rate data received from DSB",
    );
  });

  it("throws when api call fails", async () => {
    apiMock.mockRejectedValue(new Error("timeout"));
    await expect(getDsbExchangeRates()).rejects.toThrow("timeout");
  });
});

describe("CBVS edge cases", () => {
  it("skips rows that are not USD or EUR", async () => {
    apiMock.mockResolvedValue({
      html: `<div class="rate-info"><table>
        <tr><td>GBP</td><td>7,00</td><td>7,50</td></tr>
        <tr><td>USD</td><td>5,50</td><td>5,80</td></tr>
      </table></div>`,
    });
    const rates = await getCBVSExchangeRates();
    expect(rates).toHaveLength(1);
    expect(rates[0].currency).toBe("USD");
  });

  it("returns empty when table has no matching rows", async () => {
    apiMock.mockResolvedValue({
      html: '<div class="rate-info"><table><tr><td>GBP</td><td>1</td><td>2</td></tr></table></div>',
    });
    const rates = await getCBVSExchangeRates();
    expect(rates).toEqual([]);
  });
});

describe("CME error paths", () => {
  it("throws on non-200 status", async () => {
    vi.spyOn(axios, "post").mockResolvedValue({
      status: 403,
      statusText: "Forbidden",
      data: "Just a moment...",
    });
    await expect(getCMEExchangeRates()).rejects.toThrow(
      "CME API returned status 403",
    );
    vi.mocked(axios.post).mockRestore();
  });

  it("throws on non-JSON string response", async () => {
    vi.spyOn(axios, "post").mockResolvedValue({
      status: 200,
      data: "  <html>Not JSON</html>  ",
    });
    await expect(getCMEExchangeRates()).rejects.toThrow(
      "Unexpected CME response",
    );
    vi.mocked(axios.post).mockRestore();
  });

  it("throws when response is empty array", async () => {
    vi.spyOn(axios, "post").mockResolvedValue({
      status: 200,
      data: [],
    });
    await expect(getCMEExchangeRates()).rejects.toThrow(
      "No exchange rate data received from CME",
    );
    vi.mocked(axios.post).mockRestore();
  });

  it("parses stringified JSON response", async () => {
    vi.spyOn(axios, "post").mockResolvedValue({
      status: 200,
      data: JSON.stringify([
        {
          BuyUsdExchangeRate: 5.5,
          SaleUsdExchangeRate: 5.8,
          BuyEuroExchangeRate: 6.1,
          SaleEuroExchangeRate: 6.4,
        },
      ]),
    });
    const rates = await getCMEExchangeRates();
    expect(rates[0].buy).toBe("5.50");
    vi.mocked(axios.post).mockRestore();
  });
});

describe("Hakrinbank error paths", () => {
  it("throws when no exchange rate data found", async () => {
    apiMock.mockResolvedValue({
      html: "<table><thead><tr><th>Other</th></tr></thead></table>",
    });
    await expect(getHakrinbankExchangeRates()).rejects.toThrow(
      "No exchange rate data found on Hakrinbank page",
    );
  });

  it("throws when api call fails", async () => {
    apiMock.mockRejectedValue(new Error("connection reset"));
    await expect(getHakrinbankExchangeRates()).rejects.toThrow(
      "connection reset",
    );
  });
});

describe("Republic Bank error paths", () => {
  it("throws when no exchange rate data found", async () => {
    apiMock.mockResolvedValue({
      html: "<table><thead><tr><th>Other</th></tr></thead></table>",
    });
    await expect(getRepublicBankExchangeRates()).rejects.toThrow(
      "No exchange rate data found on Republic Bank page",
    );
  });

  it("throws when api call fails", async () => {
    apiMock.mockRejectedValue(new Error("DNS error"));
    await expect(getRepublicBankExchangeRates()).rejects.toThrow("DNS error");
  });
});
