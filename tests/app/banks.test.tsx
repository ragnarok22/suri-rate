import { describe, it, expect, vi } from "vitest";
import React from "react";
import { render, screen } from "@testing-library/react";

vi.mock("next/link", () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) =>
    React.createElement("a", { href }, children),
}));

import BanksPage from "../../app/banks/page";

describe("BanksPage", () => {
  it("renders the page heading", () => {
    const { container } = render(<BanksPage />);
    expect(container.textContent).toContain(
      "Banks Offering USD & EUR Exchange Rates in Suriname",
    );
  });

  it("renders all 6 bank names", () => {
    const { container } = render(<BanksPage />);
    const text = container.textContent!;
    expect(text).toContain("Finabank");
    expect(text).toContain("Central Bank");
    expect(text).toContain("Central Money Exchange");
    expect(text).toContain("Hakrinbank");
    expect(text).toContain("De Surinaamsche Bank (DSB)");
    expect(text).toContain("Republic Bank");
  });

  it("has detail links for each bank", () => {
    render(<BanksPage />);
    const detailLinks = screen.getAllByText("Details");
    expect(detailLinks).toHaveLength(6);
  });

  it("renders back link to dashboard", () => {
    const { container } = render(<BanksPage />);
    expect(container.querySelector('a[href="/"]')).toBeTruthy();
  });

  it("renders JSON-LD scripts", () => {
    const { container } = render(<BanksPage />);
    const scripts = container.querySelectorAll(
      'script[type="application/ld+json"]',
    );
    expect(scripts.length).toBe(2);
  });
});
