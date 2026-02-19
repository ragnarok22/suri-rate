import { describe, it, expect, vi } from "vitest";
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";

const captureMock = vi.fn();
vi.mock("posthog-js/react", () => ({
  usePostHog: () => ({ capture: captureMock }),
}));

import OutboundLink from "../../components/outbound-link";

describe("OutboundLink", () => {
  it("renders children", () => {
    render(
      <OutboundLink href="https://example.com" bankName="Finabank">
        Visit site
      </OutboundLink>,
    );
    expect(screen.getByText("Visit site")).toBeTruthy();
  });

  it("builds UTM url and sets it as href", () => {
    render(
      <OutboundLink href="https://example.com" bankName="Finabank">
        Link
      </OutboundLink>,
    );
    const link = screen.getByText("Link") as HTMLAnchorElement;
    expect(link.href).toContain("utm_source=surirate");
    expect(link.href).toContain("finabank");
  });

  it("defaults to target=_blank and rel=noopener noreferrer", () => {
    render(
      <OutboundLink href="https://example.com" bankName="Test">
        Link
      </OutboundLink>,
    );
    const link = screen.getByText("Link") as HTMLAnchorElement;
    expect(link.target).toBe("_blank");
    expect(link.rel).toBe("noopener noreferrer");
  });

  it("accepts custom target, rel, className", () => {
    render(
      <OutboundLink
        href="https://example.com"
        bankName="Test"
        target="_self"
        rel="nofollow"
        className="custom"
      >
        Link
      </OutboundLink>,
    );
    const link = screen.getByText("Link") as HTMLAnchorElement;
    expect(link.target).toBe("_self");
    expect(link.rel).toBe("nofollow");
    expect(link.className).toBe("custom");
  });

  it("tracks click with posthog including currency and lang", () => {
    render(
      <OutboundLink
        href="https://example.com"
        bankName="Finabank"
        currency="usd"
        lang="nl"
      >
        Link
      </OutboundLink>,
    );
    fireEvent.click(screen.getByText("Link"));
    expect(captureMock).toHaveBeenCalledWith(
      "outbound_click",
      expect.objectContaining({
        bank: "Finabank",
        currency: "usd",
        lang: "nl",
      }),
    );
  });
});
