import { describe, it, expect, vi } from "vitest";
import React from "react";
import { render } from "@testing-library/react";

const captureMock = vi.fn();
vi.mock("posthog-js/react", () => ({
  usePostHog: () => ({ capture: captureMock }),
}));

vi.mock("next/image", () => ({
  default: (props: Record<string, unknown>) =>
    React.createElement("img", { ...props }),
}));

vi.mock("next/link", () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) =>
    React.createElement("a", { href }, children),
}));

vi.mock("lucide-react", () => ({
  ExternalLink: () => React.createElement("span"),
}));

import ExchangeRateGrid from "../../components/exchange-rate-grid";
import type { BankRates } from "../../utils/definitions";

const sampleRates: BankRates[] = [
  {
    name: "Finabank",
    logo: "/logos/finabank.jpg",
    link: "https://finabanknv.com",
    rates: [
      { currency: "USD", buy: "5.50", sell: "5.80" },
      { currency: "EUR", buy: "6.10", sell: "6.40" },
    ],
  },
  {
    name: "Central Bank",
    logo: "/logos/central-bank.jpg",
    link: "https://www.cbvs.sr",
    rates: [
      { currency: "USD", buy: "5.40", sell: "5.90" },
      { currency: "EUR", buy: "6.00", sell: "6.50" },
    ],
  },
];

describe("ExchangeRateGrid", () => {
  it("renders cards for each bank", async () => {
    const page = await ExchangeRateGrid({ rates: sampleRates });
    const { container } = render(page);
    expect(container.textContent).toContain("Finabank");
    expect(container.textContent).toContain("Central Bank");
  });

  it("renders with empty rates array", async () => {
    const page = await ExchangeRateGrid({ rates: [] });
    const { container } = render(page);
    expect(container.querySelector(".grid")).toBeTruthy();
  });
});
