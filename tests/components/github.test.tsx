import { describe, it, expect, vi } from "vitest";
import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";

const captureMock = vi.fn();
vi.mock("posthog-js/react", () => ({
  usePostHog: () => ({ capture: captureMock }),
}));

vi.mock("../../components/github.module.css", () => ({
  default: {
    "github-corner": "github-corner",
    "github-box": "github-box",
    "octo-arm": "octo-arm",
  },
}));

import GitHubLink from "../../components/github";

describe("GitHubLink", () => {
  it("renders a link with aria-label", async () => {
    await act(async () => {
      render(<GitHubLink />);
    });
    const link = screen.getByLabelText("View source on GitHub");
    expect(link).toBeTruthy();
    expect(link.tagName).toBe("A");
  });

  it("includes UTM parameters in href", async () => {
    await act(async () => {
      render(<GitHubLink />);
    });
    const link = screen.getByLabelText(
      "View source on GitHub",
    ) as HTMLAnchorElement;
    expect(link.href).toContain("utm_source=surirate");
  });

  it("tracks click with posthog", async () => {
    await act(async () => {
      render(<GitHubLink />);
    });
    const link = screen.getByLabelText("View source on GitHub");
    fireEvent.click(link);
    expect(captureMock).toHaveBeenCalledWith(
      "outbound_click",
      expect.objectContaining({ type: "github" }),
    );
  });

  it("renders an SVG icon", async () => {
    let container: HTMLElement;
    await act(async () => {
      const result = render(<GitHubLink />);
      container = result.container;
    });
    expect(container!.querySelector("svg")).toBeTruthy();
  });
});
