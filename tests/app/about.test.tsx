import { describe, it, expect, vi } from "vitest";
import React from "react";
import { render, screen } from "@testing-library/react";

vi.mock("next/link", () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) =>
    React.createElement("a", { href }, children),
}));

import AboutPage from "../../app/about/page";

describe("AboutPage", () => {
  it("renders the page heading", () => {
    render(<AboutPage />);
    expect(screen.getByText("Why SuriRate exists")).toBeTruthy();
  });

  it("renders the back link", () => {
    render(<AboutPage />);
    const backLink = screen.getByText(
      "← Back to dashboard",
    ) as HTMLAnchorElement;
    expect(backLink.getAttribute("href")).toBe("/");
  });

  it("renders data transparency and built for humans sections", () => {
    render(<AboutPage />);
    expect(screen.getByText("Data transparency")).toBeTruthy();
    expect(screen.getByText("Built for humans")).toBeTruthy();
  });

  it("has links to methodology and bank directory", () => {
    render(<AboutPage />);
    expect(screen.getByText("methodology page")).toBeTruthy();
    expect(screen.getByText("bank directory")).toBeTruthy();
  });
});
