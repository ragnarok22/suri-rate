import { describe, it, expect, vi } from "vitest";
import React from "react";
import { render, screen } from "@testing-library/react";

// Mock next-themes
vi.mock("next-themes", () => ({
  ThemeProvider: ({ children }: { children: React.ReactNode }) =>
    React.createElement("div", { "data-testid": "theme-provider" }, children),
}));

// Mock posthog-js
vi.mock("posthog-js", () => ({
  default: { init: vi.fn() },
}));

// Mock posthog-js/react
vi.mock("posthog-js/react", () => ({
  PostHogProvider: ({ children }: { children: React.ReactNode }) =>
    React.createElement("div", { "data-testid": "posthog-provider" }, children),
  usePostHog: () => ({ capture: vi.fn() }),
}));

// Mock next/navigation
vi.mock("next/navigation", () => ({
  usePathname: () => "/",
  useSearchParams: () => ({
    toString: () => "",
  }),
}));

import { ThemeProvider, PostHogProvider } from "../../app/providers";

describe("ThemeProvider", () => {
  it("renders children", () => {
    render(
      <ThemeProvider>
        <span>child</span>
      </ThemeProvider>,
    );
    expect(screen.getByText("child")).toBeTruthy();
  });
});

describe("PostHogProvider", () => {
  it("renders children within PostHog context", () => {
    render(
      <PostHogProvider>
        <span>content</span>
      </PostHogProvider>,
    );
    expect(screen.getByText("content")).toBeTruthy();
  });
});
