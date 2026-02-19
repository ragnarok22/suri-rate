import { describe, it, expect, vi } from "vitest";
import React from "react";
import { render } from "@testing-library/react";

vi.mock("next/link", () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) =>
    React.createElement("a", { href }, children),
}));

vi.mock("next-themes", () => ({
  useTheme: () => ({ theme: "light", setTheme: vi.fn() }),
}));

vi.mock("lucide-react", () => ({
  Moon: () => React.createElement("span"),
  Sun: () => React.createElement("span"),
}));

import NotFound from "../../app/not-found";

describe("NotFound", () => {
  it("renders 404 heading", () => {
    const { container } = render(<NotFound />);
    expect(container.textContent).toContain("404");
    expect(container.textContent).toContain("Page Not Found");
  });

  it("has a link back to home", () => {
    const { container } = render(<NotFound />);
    expect(container.querySelector('a[href="/"]')).toBeTruthy();
  });

  it("has links to banks and about pages", () => {
    const { container } = render(<NotFound />);
    expect(container.querySelector('a[href="/banks"]')).toBeTruthy();
    expect(container.querySelector('a[href="/about"]')).toBeTruthy();
  });

  it("shows exchange rate suggestion section", () => {
    const { container } = render(<NotFound />);
    expect(container.textContent).toContain("Looking for exchange rates?");
  });
});
