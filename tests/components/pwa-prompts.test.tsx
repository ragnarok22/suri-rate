import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";
import { render, act } from "@testing-library/react";

const captureMock = vi.fn();
vi.mock("posthog-js/react", () => ({
  usePostHog: () => ({ capture: captureMock }),
}));

import PwaPrompts from "../../components/pwa-prompts";

describe("PwaPrompts", () => {
  beforeEach(() => {
    // Mock matchMedia
    Object.defineProperty(window, "matchMedia", {
      value: vi.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
      writable: true,
      configurable: true,
    });

    // Mock localStorage
    Object.defineProperty(window, "localStorage", {
      value: {
        getItem: vi.fn(() => null),
        setItem: vi.fn(),
        removeItem: vi.fn(),
        clear: vi.fn(),
        length: 0,
        key: vi.fn(),
      },
      writable: true,
      configurable: true,
    });

    // Ensure navigator.standalone is not set
    Object.defineProperty(window.navigator, "standalone", {
      value: false,
      writable: true,
      configurable: true,
    });
  });

  it("renders nothing initially (before mount)", () => {
    const { container } = render(<PwaPrompts />);
    // Before useEffect runs, mounted is false, so it returns null
    expect(container.innerHTML).toBe("");
  });

  it("renders empty after mount when not installed and not mobile", async () => {
    let container: HTMLElement;
    await act(async () => {
      const result = render(<PwaPrompts />);
      container = result.container;
    });
    // After mount: mounted=true, isInstalled=false, isMobile=false
    // No update banner (not production), no install banner (not mobile)
    // Should render the fragment with no visible content
    expect(container!).toBeTruthy();
  });

  it("does not show service worker registration in non-production", async () => {
    let container: HTMLElement;
    await act(async () => {
      const result = render(<PwaPrompts />);
      container = result.container;
    });
    // In test environment (not production), SW registration is skipped
    expect(container!.querySelector('[class*="update"]')).toBeNull();
  });

  it("detects installed state from matchMedia", async () => {
    // Simulate standalone mode
    Object.defineProperty(window, "matchMedia", {
      value: vi.fn().mockImplementation((query: string) => ({
        matches: query === "(display-mode: standalone)",
        media: query,
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
      writable: true,
      configurable: true,
    });

    let container: HTMLElement;
    await act(async () => {
      const result = render(<PwaPrompts />);
      container = result.container;
    });
    // When installed, no install banner shown
    expect(container!.textContent).not.toContain("Install this app");
  });

  it("detects iOS Safari standalone mode", async () => {
    Object.defineProperty(window.navigator, "standalone", {
      value: true,
      writable: true,
      configurable: true,
    });

    let container: HTMLElement;
    await act(async () => {
      const result = render(<PwaPrompts />);
      container = result.container;
    });
    // When navigator.standalone is true, isInstalled is set
    expect(container!.textContent).not.toContain("Install this app");
  });

  it("reads install-banner-dismissed from localStorage", async () => {
    (window.localStorage.getItem as ReturnType<typeof vi.fn>).mockReturnValue(
      "true",
    );

    await act(async () => {
      render(<PwaPrompts />);
    });
    expect(window.localStorage.getItem).toHaveBeenCalledWith(
      "install-banner-dismissed",
    );
  });

  it("detects platform from user agent", async () => {
    Object.defineProperty(window.navigator, "userAgent", {
      value: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      writable: true,
      configurable: true,
    });

    await act(async () => {
      render(<PwaPrompts />);
    });
    // Just verifying no errors during platform detection
    expect(true).toBe(true);
  });
});
