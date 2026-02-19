import { describe, it, expect, vi } from "vitest";
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";

// Mock posthog
const captureMock = vi.fn();
vi.mock("posthog-js/react", () => ({
  usePostHog: () => ({ capture: captureMock }),
}));

// Mock next/image
vi.mock("next/image", () => ({
  default: (props: Record<string, unknown>) =>
    React.createElement("img", { ...props }),
}));

// Mock next/link
vi.mock("next/link", () => ({
  default: ({
    children,
    href,
    ...props
  }: {
    children: React.ReactNode;
    href: string;
    [key: string]: unknown;
  }) => React.createElement("a", { href, ...props }, children),
}));

import ExchangeRateCard from "../../components/exchange-rate-card";

const bestRates = {
  bestBuyUSD: "5.50",
  bestSellUSD: "5.80",
  bestBuyEUR: "6.10",
  bestSellEUR: "6.40",
};

const bankRates = {
  name: "Finabank" as const,
  logo: "/logos/finabank.jpg",
  link: "https://finabanknv.com",
  rates: [
    { currency: "USD" as const, buy: "5.50", sell: "5.80" },
    { currency: "EUR" as const, buy: "6.10", sell: "6.40" },
  ],
};

describe("ExchangeRateCard", () => {
  it("renders the bank name", () => {
    render(<ExchangeRateCard bankRates={bankRates} bestRates={bestRates} />);
    expect(screen.getByText("Finabank")).toBeTruthy();
  });

  it("renders USD and EUR rates", () => {
    render(<ExchangeRateCard bankRates={bankRates} bestRates={bestRates} />);
    expect(screen.getByText("5.50")).toBeTruthy();
    expect(screen.getByText("5.80")).toBeTruthy();
    expect(screen.getByText("6.10")).toBeTruthy();
    expect(screen.getByText("6.40")).toBeTruthy();
  });

  it("shows Best badges when rates match best rates", () => {
    render(<ExchangeRateCard bankRates={bankRates} bestRates={bestRates} />);
    const bestBadges = screen.getAllByText("Best");
    expect(bestBadges.length).toBe(4); // all rates are best
  });

  it("does not show Best badges when rates do not match", () => {
    const otherBest = {
      bestBuyUSD: "9.99",
      bestSellUSD: "1.00",
      bestBuyEUR: "9.99",
      bestSellEUR: "1.00",
    };
    render(<ExchangeRateCard bankRates={bankRates} bestRates={otherBest} />);
    expect(screen.queryAllByText("Best")).toHaveLength(0);
  });

  it("returns null when USD rate is missing", () => {
    const noUsd = {
      ...bankRates,
      rates: [{ currency: "EUR" as const, buy: "6.10", sell: "6.40" }],
    };
    const { container } = render(
      <ExchangeRateCard bankRates={noUsd} bestRates={bestRates} />,
    );
    expect(container.innerHTML).toBe("");
  });

  it("returns null when EUR rate is missing", () => {
    const noEur = {
      ...bankRates,
      rates: [{ currency: "USD" as const, buy: "5.50", sell: "5.80" }],
    };
    const { container } = render(
      <ExchangeRateCard bankRates={noEur} bestRates={bestRates} />,
    );
    expect(container.innerHTML).toBe("");
  });

  it("tracks outbound clicks with posthog", () => {
    render(<ExchangeRateCard bankRates={bankRates} bestRates={bestRates} />);
    const link = screen.getByText("Finabank").closest("a")!;
    fireEvent.click(link);
    expect(captureMock).toHaveBeenCalledWith(
      "outbound_click",
      expect.objectContaining({
        bank: "Finabank",
      }),
    );
  });
});
