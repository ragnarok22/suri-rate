import { describe, it, expect, vi } from "vitest";

vi.mock("next/cache", () => ({
  cacheLife: vi.fn(),
}));

vi.mock("../utils/places", () => ({
  getCurrentRates: vi.fn(),
}));

import { getRates } from "../utils/data";
import { getCurrentRates } from "../utils/places";

describe("getRates", () => {
  it("returns rates and updatedAt on success", async () => {
    const mockRates = [
      {
        name: "Finabank" as const,
        logo: "",
        link: "",
        rates: [{ currency: "USD" as const, buy: "5", sell: "6" }],
      },
    ];
    vi.mocked(getCurrentRates).mockResolvedValue(mockRates);

    const result = await getRates();
    expect(result).not.toBeNull();
    expect(result!.rates).toEqual(mockRates);
    expect(result!.updatedAt).toBeTruthy();
  });

  it("returns null when getCurrentRates throws", async () => {
    vi.mocked(getCurrentRates).mockRejectedValue(new Error("network down"));

    const result = await getRates();
    expect(result).toBeNull();
  });
});
