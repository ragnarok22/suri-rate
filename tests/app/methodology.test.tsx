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
    render(<MethodologyPage />);
    expect(screen.getByText("Methodology")).toBeTruthy();
  });

  it("renders all methodology steps", () => {
    render(<MethodologyPage />);
    expect(screen.getByText("Scraping")).toBeTruthy();
    expect(screen.getByText("Normalization")).toBeTruthy();
    expect(screen.getByText("Caching")).toBeTruthy();
  });

  it("renders best-rate badge logic section", () => {
    render(<MethodologyPage />);
    expect(screen.getByText("Best-rate badge logic")).toBeTruthy();
  });

  it("has a back link to dashboard", () => {
    render(<MethodologyPage />);
    const backLink = screen.getByText(
      "← Back to dashboard",
    ) as HTMLAnchorElement;
    expect(backLink.getAttribute("href")).toBe("/");
  });
});
