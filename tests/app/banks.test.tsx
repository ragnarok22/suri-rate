import { describe, it, expect, vi } from "vitest";
import React from "react";
import { renderToString } from "react-dom/server";
import { render, screen } from "@testing-library/react";

vi.mock("next/link", () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) =>
    React.createElement("a", { href }, children),
}));

import BanksPage from "../../app/banks/page";
import { bankPages } from "@/utils/bank-pages";

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

  it("keeps bank descriptions inside JSON-LD when server HTML is parsed", () => {
    const payload =
      "</script><img data-json-breakout src=x onerror=alert(1)> & < >";
    const originalSummary = bankPages[0].summary;
    bankPages[0].summary = payload;

    try {
      const document = new DOMParser().parseFromString(
        renderToString(<BanksPage />),
        "text/html",
      );
      expect(document.querySelector("[data-json-breakout]")).toBeNull();

      const scripts = document.querySelectorAll(
        'script[type="application/ld+json"]',
      );
      expect(scripts).toHaveLength(2);
      const schemas = Array.from(scripts, (script) => {
        expect(script.textContent).not.toMatch(/[<>&]/);
        return JSON.parse(script.textContent || "{}");
      });
      const itemList = schemas.find((schema) => schema["@type"] === "ItemList");
      expect(itemList.itemListElement[0].item.description).toBe(payload);
    } finally {
      bankPages[0].summary = originalSummary;
    }
  });
});
