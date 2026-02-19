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

  it("renders the back link to dashboard", () => {
    const { container } = render(<AboutPage />);
    const links = container.querySelectorAll('a[href="/"]');
    expect(links.length).toBeGreaterThan(0);
  });

  it("renders data transparency and built for humans sections", () => {
    const { container } = render(<AboutPage />);
    expect(container.textContent).toContain("Data transparency");
    expect(container.textContent).toContain("Built for humans");
  });

  it("has links to methodology and bank directory", () => {
    const { container } = render(<AboutPage />);
    expect(container.querySelector('a[href="/methodology"]')).toBeTruthy();
    expect(container.querySelector('a[href="/banks"]')).toBeTruthy();
  });
});
