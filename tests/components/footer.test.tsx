import { describe, it, expect, vi } from "vitest";
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";

const captureMock = vi.fn();
vi.mock("posthog-js/react", () => ({
  usePostHog: () => ({ capture: captureMock }),
}));

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

import Footer from "../../components/footer";

describe("Footer", () => {
  it("renders 'Not yet updated' when no lastUpdated", () => {
    render(<Footer lastUpdated={undefined} />);
    expect(screen.getByText("Last updated: Not yet updated")).toBeTruthy();
  });

  it("renders formatted date when lastUpdated is provided", () => {
    render(<Footer lastUpdated="2024-06-15T12:00:00Z" />);
    const text = screen.getByText(/Last updated:/).textContent!;
    expect(text).toContain("Jun");
    expect(text).toContain("2024");
  });

  it("renders creator link", () => {
    render(<Footer lastUpdated={undefined} />);
    expect(screen.getByText("Reinier Hernández")).toBeTruthy();
  });

  it("renders navigation links", () => {
    render(<Footer lastUpdated={undefined} />);
    expect(screen.getByText("About")).toBeTruthy();
    expect(screen.getByText("Methodology")).toBeTruthy();
    expect(screen.getByText("Bank profiles")).toBeTruthy();
  });

  it("tracks outbound click on personal site", () => {
    render(<Footer lastUpdated={undefined} />);
    const link = screen.getByText("Reinier Hernández");
    fireEvent.click(link);
    expect(captureMock).toHaveBeenCalledWith(
      "outbound_click",
      expect.objectContaining({ type: "personal_website" }),
    );
  });
});
