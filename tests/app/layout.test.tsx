import { describe, it, expect, vi } from "vitest";
import React from "react";
import { render } from "@testing-library/react";

vi.mock("next/cache", () => ({
  cacheLife: vi.fn(),
}));

vi.mock("../../utils/places", () => ({
  getCurrentRates: vi.fn(async () => [
    {
      name: "Finabank",
      logo: "",
      link: "",
      rates: [{ currency: "USD", buy: "5", sell: "6" }],
    },
  ]),
}));

vi.mock("next-themes", () => ({
  ThemeProvider: ({ children }: { children: React.ReactNode }) =>
    React.createElement("div", null, children),
  useTheme: () => ({ theme: "light", setTheme: vi.fn() }),
}));

vi.mock("posthog-js", () => ({
  default: { init: vi.fn() },
}));

vi.mock("posthog-js/react", () => ({
  PostHogProvider: ({ children }: { children: React.ReactNode }) =>
    React.createElement("div", null, children),
  usePostHog: () => ({ capture: vi.fn() }),
}));

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
  useSearchParams: () => ({
    toString: () => "",
  }),
}));

vi.mock("lucide-react", () => ({
  Moon: () => React.createElement("span"),
  Sun: () => React.createElement("span"),
}));

vi.mock("../../components/github.module.css", () => ({
  default: {
    "github-corner": "github-corner",
    "github-box": "github-box",
    "octo-arm": "octo-arm",
  },
}));

import RootLayout, { generateMetadata, viewport } from "../../app/layout";

describe("RootLayout", () => {
  it("renders children", () => {
    const { container } = render(
      <RootLayout>
        <div data-testid="child">Test content</div>
      </RootLayout>,
    );
    expect(container.textContent).toContain("Test content");
  });
});

describe("generateMetadata", () => {
  it("returns metadata with title and description", async () => {
    const metadata = await generateMetadata();
    expect(metadata.title).toContain("SuriRate");
    expect(metadata.description).toBeTruthy();
    expect(metadata.manifest).toBe("/manifest.webmanifest");
  });

  it("includes keywords", async () => {
    const metadata = await generateMetadata();
    expect(metadata.keywords).toBeInstanceOf(Array);
    expect((metadata.keywords as string[]).length).toBeGreaterThan(0);
  });

  it("includes openGraph metadata", async () => {
    const metadata = await generateMetadata();
    expect(metadata.openGraph).toBeDefined();
  });
});

describe("viewport", () => {
  it("has theme color", () => {
    expect(viewport.themeColor).toBe("#1e40af");
  });
});
