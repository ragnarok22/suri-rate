import { describe, it, expect, vi } from "vitest";

vi.mock("react", async () => {
  const actual = await vi.importActual<typeof import("react")>("react");
  return {
    ...actual,
    cache: <T extends (...args: unknown[]) => unknown>(fn: T) => fn,
  };
});

vi.mock("axios", () => ({
  default: { post: vi.fn(), isAxiosError: vi.fn(() => false) },
}));

vi.mock("@/utils", () => ({
  api: vi.fn(() => Promise.resolve({ html: "" })),
}));

vi.mock("../utils/places/providers", () => ({
  getFinabankExchangeRates: vi.fn(),
  getCBVSExchangeRates: vi.fn(),
  getCMEExchangeRates: vi.fn(),
  getHakrinbankExchangeRates: vi.fn(),
  getDsbExchangeRates: vi.fn(),
  getRepublicBankExchangeRates: vi.fn(),
}));

import { getCurrentRates } from "../utils/places";
import * as providers from "../utils/places/providers";

describe("getCurrentRates error handling", () => {
  it("returns zeros for a bank that throws", async () => {
    const okRates = [
      { currency: "USD" as const, buy: "5.50", sell: "5.80" },
      { currency: "EUR" as const, buy: "6.10", sell: "6.40" },
    ];

    vi.mocked(providers.getFinabankExchangeRates).mockRejectedValue(
      new Error("Finabank down"),
    );
    vi.mocked(providers.getCBVSExchangeRates).mockResolvedValue(okRates);
    vi.mocked(providers.getCMEExchangeRates).mockResolvedValue(okRates);
    vi.mocked(providers.getHakrinbankExchangeRates).mockResolvedValue(okRates);
    vi.mocked(providers.getDsbExchangeRates).mockResolvedValue(okRates);
    vi.mocked(providers.getRepublicBankExchangeRates).mockResolvedValue(
      okRates,
    );

    const result = await getCurrentRates();
    expect(result).toHaveLength(6);

    const finabank = result.find((r) => r.name === "Finabank");
    expect(finabank).toBeDefined();
    expect(finabank!.rates).toEqual([
      { currency: "USD", buy: "0.00", sell: "0.00" },
      { currency: "EUR", buy: "0.00", sell: "0.00" },
    ]);

    const cbvs = result.find((r) => r.name === "Central Bank");
    expect(cbvs!.rates).toEqual(okRates);
  });

  it("returns all zeros when every provider fails", async () => {
    vi.mocked(providers.getFinabankExchangeRates).mockRejectedValue(
      new Error("fail"),
    );
    vi.mocked(providers.getCBVSExchangeRates).mockRejectedValue(
      new Error("fail"),
    );
    vi.mocked(providers.getCMEExchangeRates).mockRejectedValue(
      new Error("fail"),
    );
    vi.mocked(providers.getHakrinbankExchangeRates).mockRejectedValue(
      new Error("fail"),
    );
    vi.mocked(providers.getDsbExchangeRates).mockRejectedValue(
      new Error("fail"),
    );
    vi.mocked(providers.getRepublicBankExchangeRates).mockRejectedValue(
      new Error("fail"),
    );

    const result = await getCurrentRates();
    expect(result).toHaveLength(6);
    for (const bank of result) {
      expect(bank.rates).toEqual([
        { currency: "USD", buy: "0.00", sell: "0.00" },
        { currency: "EUR", buy: "0.00", sell: "0.00" },
      ]);
    }
  });
});
