import { describe, it, expect, vi } from "vitest";
import React from "react";
import { render } from "@testing-library/react";

vi.mock("next/link", () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) =>
    React.createElement("a", { href }, children),
}));

vi.mock("next/cache", () => ({
  cacheLife: vi.fn(),
}));

vi.mock("../../utils/places", () => ({
  getCurrentRates: vi.fn(async () => [
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
  ]),
}));

// Mock child components that have complex dependencies
const captureMock = vi.fn();
vi.mock("posthog-js/react", () => ({
  usePostHog: () => ({ capture: captureMock }),
}));

vi.mock("next/image", () => ({
  default: (props: Record<string, unknown>) =>
    React.createElement("img", { ...props }),
}));

vi.mock("next-themes", () => ({
  useTheme: () => ({ theme: "light", setTheme: vi.fn() }),
}));

vi.mock("lucide-react", () => ({
  Moon: () => React.createElement("span"),
  Sun: () => React.createElement("span"),
  ExternalLink: () => React.createElement("span"),
}));

import Home from "../../app/page";

describe("Home page", () => {
  it("renders the main heading", async () => {
    const page = await Home();
    const { container } = render(page);
    expect(container.textContent).toContain("SuriRate");
    expect(container.textContent).toContain("Suriname Exchange Rate");
  });

  it("renders navigation links", async () => {
    const page = await Home();
    const { container } = render(page);
    expect(container.querySelector('a[href="/methodology"]')).toBeTruthy();
    expect(container.querySelector('a[href="/about"]')).toBeTruthy();
    expect(container.querySelector('a[href="/banks"]')).toBeTruthy();
  });

  it("renders rates section heading", async () => {
    const page = await Home();
    const { container } = render(page);
    expect(container.textContent).toContain("Today");
    expect(container.textContent).toContain("Exchange Rates");
  });

  it("renders how-to section", async () => {
    const page = await Home();
    const { container } = render(page);
    expect(container.textContent).toContain("Scan the dashboard");
    expect(container.textContent).toContain("Check the source");
    expect(container.textContent).toContain("Plan with context");
  });

  it("renders FAQ section", async () => {
    const page = await Home();
    const { container } = render(page);
    expect(container.textContent).toContain("Frequently asked questions");
    expect(container.textContent).toContain(
      "How often does SuriRate update Suriname exchange rates?",
    );
  });

  it("renders JSON-LD structured data scripts", async () => {
    const page = await Home();
    const { container } = render(page);
    const scripts = container.querySelectorAll(
      'script[type="application/ld+json"]',
    );
    expect(scripts.length).toBeGreaterThan(0);
  });
});
