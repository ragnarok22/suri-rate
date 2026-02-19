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

const apiMock = vi.fn(() => Promise.resolve({ html: "" }));
vi.mock("@/utils", () => ({
  api: (...args: unknown[]) => apiMock(...args),
}));

// Mock all providers to control which ones fail
const mockProviders = {
  getFinabankExchangeRates: vi.fn(),
  getCBVSExchangeRates: vi.fn(),
  getCMEExchangeRates: vi.fn(),
  getHakrinbankExchangeRates: vi.fn(),
  getDsbExchangeRates: vi.fn(),
  getRepublicBankExchangeRates: vi.fn(),
};

vi.mock("../utils/places/providers", () => mockProviders);

import { getCurrentRates } from "../utils/places";

describe("getCurrentRates error handling", () => {
  it("returns zeros for a bank that throws", async () => {
    const okRates = [
      { currency: "USD" as const, buy: "5.50", sell: "5.80" },
      { currency: "EUR" as const, buy: "6.10", sell: "6.40" },
    ];

    mockProviders.getFinabankExchangeRates.mockRejectedValue(
      new Error("Finabank down"),
    );
    mockProviders.getCBVSExchangeRates.mockResolvedValue(okRates);
    mockProviders.getCMEExchangeRates.mockResolvedValue(okRates);
    mockProviders.getHakrinbankExchangeRates.mockResolvedValue(okRates);
    mockProviders.getDsbExchangeRates.mockResolvedValue(okRates);
    mockProviders.getRepublicBankExchangeRates.mockResolvedValue(okRates);

    const result = await getCurrentRates();
    expect(result).toHaveLength(6);

    // Finabank should have zero rates
    const finabank = result.find((r) => r.name === "Finabank");
    expect(finabank).toBeDefined();
    expect(finabank!.rates).toEqual([
      { currency: "USD", buy: "0.00", sell: "0.00" },
      { currency: "EUR", buy: "0.00", sell: "0.00" },
    ]);

    // Other banks should have normal rates
    const cbvs = result.find((r) => r.name === "Central Bank");
    expect(cbvs!.rates).toEqual(okRates);
  });

  it("returns all zeros when every provider fails", async () => {
    mockProviders.getFinabankExchangeRates.mockRejectedValue(new Error("fail"));
    mockProviders.getCBVSExchangeRates.mockRejectedValue(new Error("fail"));
    mockProviders.getCMEExchangeRates.mockRejectedValue(new Error("fail"));
    mockProviders.getHakrinbankExchangeRates.mockRejectedValue(
      new Error("fail"),
    );
    mockProviders.getDsbExchangeRates.mockRejectedValue(new Error("fail"));
    mockProviders.getRepublicBankExchangeRates.mockRejectedValue(
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
