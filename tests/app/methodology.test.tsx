import { describe, it, expect, vi } from "vitest";
import React from "react";
import { render, screen } from "@testing-library/react";

vi.mock("next/link", () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) =>
    React.createElement("a", { href }, children),
}));

import MethodologyPage from "../../app/methodology/page";

describe("MethodologyPage", () => {
  it("renders the page heading", () => {
    const { container } = render(<MethodologyPage />);
    expect(container.textContent).toContain("Methodology");
  });

  it("renders all methodology steps", () => {
    const { container } = render(<MethodologyPage />);
    expect(container.textContent).toContain("Scraping");
    expect(container.textContent).toContain("Normalization");
    expect(container.textContent).toContain("Caching");
  });

  it("renders best-rate badge logic section", () => {
    const { container } = render(<MethodologyPage />);
    expect(container.textContent).toContain("Best-rate badge logic");
  });

  it("has a back link to dashboard", () => {
    const { container } = render(<MethodologyPage />);
    expect(container.querySelector('a[href="/"]')).toBeTruthy();
  });
});
