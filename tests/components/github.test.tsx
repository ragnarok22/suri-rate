import { describe, it, expect, vi } from "vitest";
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";

const captureMock = vi.fn();
vi.mock("posthog-js/react", () => ({
  usePostHog: () => ({ capture: captureMock }),
}));

// Mock CSS modules
vi.mock("../../components/github.module.css", () => ({
  default: {
    "github-corner": "github-corner",
    "github-box": "github-box",
    "octo-arm": "octo-arm",
  },
}));

import GitHubLink from "../../components/github";

describe("GitHubLink", () => {
  it("renders a link with aria-label", () => {
    render(<GitHubLink />);
    const link = screen.getByLabelText("View source on GitHub");
    expect(link).toBeTruthy();
    expect(link.tagName).toBe("A");
  });

  it("includes UTM parameters in href", () => {
    render(<GitHubLink />);
    const link = screen.getByLabelText(
      "View source on GitHub",
    ) as HTMLAnchorElement;
    expect(link.href).toContain("utm_source=surirate");
    expect(link.href).toContain("utm_medium=github_corner");
  });

  it("tracks click with posthog", () => {
    render(<GitHubLink />);
    const link = screen.getByLabelText("View source on GitHub");
    fireEvent.click(link);
    expect(captureMock).toHaveBeenCalledWith(
      "outbound_click",
      expect.objectContaining({ type: "github" }),
    );
  });

  it("renders an SVG icon", () => {
    const { container } = render(<GitHubLink />);
    expect(container.querySelector("svg")).toBeTruthy();
  });
});
