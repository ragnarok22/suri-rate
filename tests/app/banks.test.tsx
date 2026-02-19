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
    render(<BanksPage />);
    expect(
      screen.getByText("Banks Offering USD & EUR Exchange Rates in Suriname"),
    ).toBeTruthy();
  });

  it("renders all 6 bank cards", () => {
    render(<BanksPage />);
    expect(screen.getByText("Finabank")).toBeTruthy();
    expect(screen.getByText("Central Bank")).toBeTruthy();
    expect(screen.getByText("Central Money Exchange")).toBeTruthy();
    expect(screen.getByText("Hakrinbank")).toBeTruthy();
    expect(screen.getByText("De Surinaamsche Bank (DSB)")).toBeTruthy();
    expect(screen.getByText("Republic Bank")).toBeTruthy();
  });

  it("has detail links for each bank", () => {
    render(<BanksPage />);
    const detailLinks = screen.getAllByText("Details");
    expect(detailLinks).toHaveLength(6);
  });

  it("renders back link to dashboard", () => {
    render(<BanksPage />);
    const backLink = screen.getByText(
      "← Back to dashboard",
    ) as HTMLAnchorElement;
    expect(backLink.getAttribute("href")).toBe("/");
  });

  it("renders JSON-LD scripts", () => {
    const { container } = render(<BanksPage />);
    const scripts = container.querySelectorAll(
      'script[type="application/ld+json"]',
    );
    expect(scripts.length).toBe(2);
  });
});
