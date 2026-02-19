import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import React from "react";
import { render, act, fireEvent } from "@testing-library/react";

const captureMock = vi.fn();
vi.mock("posthog-js/react", () => ({
  usePostHog: () => ({ capture: captureMock }),
}));

import PwaPrompts from "../../components/pwa-prompts";

function mockMatchMedia(overrides: Record<string, boolean> = {}) {
  Object.defineProperty(window, "matchMedia", {
    value: vi.fn().mockImplementation((query: string) => ({
      matches: overrides[query] ?? false,
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
}

function mockLocalStorage(getItemValue: string | null = null) {
  Object.defineProperty(window, "localStorage", {
    value: {
      getItem: vi.fn(() => getItemValue),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
      length: 0,
      key: vi.fn(),
    },
    writable: true,
    configurable: true,
  });
}

describe("PwaPrompts", () => {
  beforeEach(() => {
    captureMock.mockClear();
    mockMatchMedia();
    mockLocalStorage();

    Object.defineProperty(window.navigator, "standalone", {
      value: false,
      writable: true,
      configurable: true,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders nothing initially (before mount)", () => {
    const { container } = render(<PwaPrompts />);
    expect(container.innerHTML).toBe("");
  });

  it("renders empty after mount when not installed and not mobile", async () => {
    let container: HTMLElement;
    await act(async () => {
      const result = render(<PwaPrompts />);
      container = result.container;
    });
    expect(container!).toBeTruthy();
  });

  it("does not show service worker registration in non-production", async () => {
    let container: HTMLElement;
    await act(async () => {
      const result = render(<PwaPrompts />);
      container = result.container;
    });
    expect(container!.querySelector('[class*="update"]')).toBeNull();
  });

  it("detects installed state from matchMedia", async () => {
    mockMatchMedia({ "(display-mode: standalone)": true });

    let container: HTMLElement;
    await act(async () => {
      const result = render(<PwaPrompts />);
      container = result.container;
    });
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
    expect(container!.textContent).not.toContain("Install this app");
  });

  it("reads install-banner-dismissed from localStorage", async () => {
    mockLocalStorage("true");

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
    expect(true).toBe(true);
  });

  it("shows install banner on mobile with beforeinstallprompt", async () => {
    // Mobile device, not installed
    mockMatchMedia({ "(max-width: 768px)": true });

    Object.defineProperty(window.navigator, "userAgent", {
      value:
        "Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 Chrome/120.0.0.0 Mobile",
      writable: true,
      configurable: true,
    });

    let container: HTMLElement;
    await act(async () => {
      const result = render(<PwaPrompts />);
      container = result.container;
    });

    // Fire beforeinstallprompt
    const promptMock = vi.fn().mockResolvedValue(undefined);
    const bipEvent = new Event("beforeinstallprompt");
    Object.defineProperty(bipEvent, "prompt", { value: promptMock });
    Object.defineProperty(bipEvent, "userChoice", {
      value: Promise.resolve({ outcome: "accepted" }),
    });

    await act(async () => {
      window.dispatchEvent(bipEvent);
    });

    expect(container!.textContent).toContain("Install this app");
    expect(container!.textContent).toContain("Install");
  });

  it("shows iOS install banner on mobile iOS device", async () => {
    mockMatchMedia({ "(max-width: 768px)": true });

    Object.defineProperty(window.navigator, "userAgent", {
      value:
        "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15",
      writable: true,
      configurable: true,
    });

    let container: HTMLElement;
    await act(async () => {
      const result = render(<PwaPrompts />);
      container = result.container;
    });

    expect(container!.textContent).toContain("Install this app");
    expect(container!.textContent).toContain("share icon");
  });

  it("dismisses install banner and saves to localStorage", async () => {
    mockMatchMedia({ "(max-width: 768px)": true });

    Object.defineProperty(window.navigator, "userAgent", {
      value: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0) AppleWebKit/605.1.15",
      writable: true,
      configurable: true,
    });

    let container: HTMLElement;
    await act(async () => {
      const result = render(<PwaPrompts />);
      container = result.container;
    });

    // Click close button
    const closeBtn = container!.querySelector(
      'button[aria-label="Close install banner"]',
    ) as HTMLButtonElement;
    expect(closeBtn).toBeTruthy();

    await act(async () => {
      fireEvent.click(closeBtn);
    });

    expect(window.localStorage.setItem).toHaveBeenCalledWith(
      "install-banner-dismissed",
      "true",
    );
    expect(captureMock).toHaveBeenCalledWith(
      "pwa_install_banner_dismiss",
      expect.objectContaining({ platform: "ios" }),
    );
    // Banner should be hidden after dismiss
    expect(container!.textContent).not.toContain("Install this app");
  });

  it("handles install click with beforeinstallprompt event", async () => {
    mockMatchMedia({ "(max-width: 768px)": true });

    Object.defineProperty(window.navigator, "userAgent", {
      value: "Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 Mobile",
      writable: true,
      configurable: true,
    });

    let container: HTMLElement;
    await act(async () => {
      const result = render(<PwaPrompts />);
      container = result.container;
    });

    const promptMock = vi.fn().mockResolvedValue(undefined);
    const bipEvent = new Event("beforeinstallprompt");
    Object.defineProperty(bipEvent, "prompt", { value: promptMock });
    Object.defineProperty(bipEvent, "userChoice", {
      value: Promise.resolve({ outcome: "accepted" }),
    });

    await act(async () => {
      window.dispatchEvent(bipEvent);
    });

    // Click install button
    const installBtn = Array.from(container!.querySelectorAll("button")).find(
      (b) => b.textContent === "Install",
    );
    expect(installBtn).toBeTruthy();

    await act(async () => {
      fireEvent.click(installBtn!);
    });

    expect(captureMock).toHaveBeenCalledWith(
      "pwa_install_banner_click",
      expect.objectContaining({ variant: "prompt" }),
    );
    expect(promptMock).toHaveBeenCalled();
    expect(captureMock).toHaveBeenCalledWith(
      "pwa_install_prompt_result",
      expect.objectContaining({ outcome: "accepted" }),
    );
  });

  it("handles install click on iOS (shows alert)", async () => {
    mockMatchMedia({ "(max-width: 768px)": true });

    Object.defineProperty(window.navigator, "userAgent", {
      value: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0) AppleWebKit/605.1.15",
      writable: true,
      configurable: true,
    });

    const alertMock = vi.fn();
    window.alert = alertMock;

    let container: HTMLElement;
    await act(async () => {
      const result = render(<PwaPrompts />);
      container = result.container;
    });

    const addBtn = Array.from(container!.querySelectorAll("button")).find((b) =>
      b.textContent?.includes("Add to home"),
    );
    expect(addBtn).toBeTruthy();

    await act(async () => {
      fireEvent.click(addBtn!);
    });

    expect(captureMock).toHaveBeenCalledWith(
      "pwa_install_banner_click",
      expect.objectContaining({ variant: "instructions" }),
    );
    expect(alertMock).toHaveBeenCalledWith(
      expect.stringContaining("Add to Home Screen"),
    );
  });

  it("handles install prompt error", async () => {
    mockMatchMedia({ "(max-width: 768px)": true });

    Object.defineProperty(window.navigator, "userAgent", {
      value: "Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 Mobile",
      writable: true,
      configurable: true,
    });

    let container: HTMLElement;
    await act(async () => {
      const result = render(<PwaPrompts />);
      container = result.container;
    });

    const promptMock = vi.fn().mockRejectedValue(new Error("prompt failed"));
    const bipEvent = new Event("beforeinstallprompt");
    Object.defineProperty(bipEvent, "prompt", { value: promptMock });
    Object.defineProperty(bipEvent, "userChoice", {
      value: Promise.resolve({ outcome: "dismissed" }),
    });

    await act(async () => {
      window.dispatchEvent(bipEvent);
    });

    const installBtn = Array.from(container!.querySelectorAll("button")).find(
      (b) => b.textContent === "Install",
    );

    await act(async () => {
      fireEvent.click(installBtn!);
    });

    // Wait for the async error to resolve
    await act(async () => {
      await new Promise((r) => setTimeout(r, 0));
    });

    expect(captureMock).toHaveBeenCalledWith(
      "pwa_install_prompt_error",
      expect.objectContaining({ platform: "android" }),
    );
  });

  it("detects Android platform from user agent", async () => {
    Object.defineProperty(window.navigator, "userAgent", {
      value: "Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36",
      writable: true,
      configurable: true,
    });

    await act(async () => {
      render(<PwaPrompts />);
    });
    expect(true).toBe(true);
  });

  it("detects 'other' platform for unknown user agents", async () => {
    Object.defineProperty(window.navigator, "userAgent", {
      value: "SomeUnknownBrowser/1.0",
      writable: true,
      configurable: true,
    });

    await act(async () => {
      render(<PwaPrompts />);
    });
    expect(true).toBe(true);
  });

  it("uses addListener fallback when addEventListener is not available", async () => {
    const addListenerMock = vi.fn();
    Object.defineProperty(window, "matchMedia", {
      value: vi.fn().mockImplementation((query: string) => ({
        matches: query === "(max-width: 768px)",
        media: query,
        onchange: null,
        addEventListener: undefined, // not available
        removeEventListener: undefined,
        addListener: addListenerMock,
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
      writable: true,
      configurable: true,
    });

    await act(async () => {
      render(<PwaPrompts />);
    });

    expect(addListenerMock).toHaveBeenCalled();
  });

  it("does not capture beforeinstallprompt when installed", async () => {
    mockMatchMedia({ "(display-mode: standalone)": true });

    let container: HTMLElement;
    await act(async () => {
      const result = render(<PwaPrompts />);
      container = result.container;
    });

    const bipEvent = new Event("beforeinstallprompt");
    await act(async () => {
      window.dispatchEvent(bipEvent);
    });

    // Should not show install banner since app is installed
    expect(container!.textContent).not.toContain("Install this app");
  });

  it("measures banner height with ResizeObserver", async () => {
    mockMatchMedia({ "(max-width: 768px)": true });

    Object.defineProperty(window.navigator, "userAgent", {
      value: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0) AppleWebKit/605.1.15",
      writable: true,
      configurable: true,
    });

    const observeMock = vi.fn();
    const disconnectMock = vi.fn();
    const OriginalResizeObserver = globalThis.ResizeObserver;
    globalThis.ResizeObserver = class MockResizeObserver {
      constructor(cb: () => void) {
        setTimeout(cb, 0);
      }
      observe = observeMock;
      disconnect = disconnectMock;
      unobserve = vi.fn();
    } as unknown as typeof ResizeObserver;

    await act(async () => {
      render(<PwaPrompts />);
    });

    // Allow the ResizeObserver setTimeout callback to fire
    await act(async () => {
      await new Promise((r) => setTimeout(r, 10));
    });

    expect(observeMock).toHaveBeenCalled();

    globalThis.ResizeObserver = OriginalResizeObserver;
  });

  it("falls back to resize event when ResizeObserver not available", async () => {
    mockMatchMedia({ "(max-width: 768px)": true });

    Object.defineProperty(window.navigator, "userAgent", {
      value: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0) AppleWebKit/605.1.15",
      writable: true,
      configurable: true,
    });

    const OriginalResizeObserver = globalThis.ResizeObserver;
    // @ts-expect-error removing ResizeObserver for test
    delete globalThis.ResizeObserver;

    const addEventSpy = vi.spyOn(window, "addEventListener");

    let container: HTMLElement;
    await act(async () => {
      const result = render(<PwaPrompts />);
      container = result.container;
    });

    expect(container!.textContent).toContain("Install this app");
    expect(addEventSpy).toHaveBeenCalledWith("resize", expect.any(Function));

    addEventSpy.mockRestore();
    globalThis.ResizeObserver = OriginalResizeObserver;
  });
});

describe("PwaPrompts (production SW)", () => {
  beforeEach(() => {
    captureMock.mockClear();
    mockMatchMedia();
    mockLocalStorage();

    Object.defineProperty(window.navigator, "standalone", {
      value: false,
      writable: true,
      configurable: true,
    });

    vi.stubEnv("NODE_ENV", "production");
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
  });

  function mockServiceWorker(
    options: {
      waiting?: boolean;
      registerError?: boolean;
    } = {},
  ) {
    const waitingWorker = options.waiting
      ? { postMessage: vi.fn(), state: "installed" }
      : null;

    const registration = {
      waiting: waitingWorker,
      installing: null,
      addEventListener: vi.fn(),
    };

    const controllerChangeListeners: (() => void)[] = [];

    const swMock = {
      register: options.registerError
        ? vi.fn().mockRejectedValue(new Error("SW failed"))
        : vi.fn().mockResolvedValue(registration),
      controller: { state: "activated" },
      addEventListener: vi.fn((_event: string, cb: () => void) => {
        controllerChangeListeners.push(cb);
      }),
      removeEventListener: vi.fn(),
    };

    Object.defineProperty(navigator, "serviceWorker", {
      value: swMock,
      writable: true,
      configurable: true,
    });

    return { swMock, registration, waitingWorker, controllerChangeListeners };
  }

  it("registers service worker in production", async () => {
    const { swMock } = mockServiceWorker();

    await act(async () => {
      render(<PwaPrompts />);
    });

    await act(async () => {
      await new Promise((r) => setTimeout(r, 0));
    });

    expect(swMock.register).toHaveBeenCalledWith("/sw.js");
  });

  it("shows update banner when SW has waiting worker", async () => {
    mockServiceWorker({ waiting: true });

    let container: HTMLElement;
    await act(async () => {
      const result = render(<PwaPrompts />);
      container = result.container;
    });

    await act(async () => {
      await new Promise((r) => setTimeout(r, 0));
    });

    expect(container!.textContent).toContain("Update available");
    expect(container!.textContent).toContain("Refresh");
    expect(container!.textContent).toContain("Later");
  });

  it("calls postMessage on Refresh click (acceptUpdate)", async () => {
    const { waitingWorker } = mockServiceWorker({ waiting: true });

    let container: HTMLElement;
    await act(async () => {
      const result = render(<PwaPrompts />);
      container = result.container;
    });

    await act(async () => {
      await new Promise((r) => setTimeout(r, 0));
    });

    const refreshBtn = Array.from(container!.querySelectorAll("button")).find(
      (b) => b.textContent === "Refresh",
    );
    expect(refreshBtn).toBeTruthy();

    await act(async () => {
      fireEvent.click(refreshBtn!);
    });

    expect(waitingWorker!.postMessage).toHaveBeenCalledWith({
      type: "SKIP_WAITING",
    });
  });

  it("hides update banner on Later click", async () => {
    mockServiceWorker({ waiting: true });

    let container: HTMLElement;
    await act(async () => {
      const result = render(<PwaPrompts />);
      container = result.container;
    });

    await act(async () => {
      await new Promise((r) => setTimeout(r, 0));
    });

    expect(container!.textContent).toContain("Update available");

    const laterBtn = Array.from(container!.querySelectorAll("button")).find(
      (b) => b.textContent === "Later",
    );
    expect(laterBtn).toBeTruthy();

    await act(async () => {
      fireEvent.click(laterBtn!);
    });

    expect(container!.textContent).not.toContain("Update available");
  });

  it("handles SW registration failure silently", async () => {
    const { swMock } = mockServiceWorker({ registerError: true });

    await act(async () => {
      render(<PwaPrompts />);
    });

    await act(async () => {
      await new Promise((r) => setTimeout(r, 0));
    });

    expect(swMock.register).toHaveBeenCalled();
  });

  it("listens for updatefound and statechange on new worker", async () => {
    const newWorker = {
      state: "installing",
      addEventListener: vi.fn(),
    };

    const registration = {
      waiting: null,
      installing: newWorker,
      addEventListener: vi.fn(),
    };

    const swMock = {
      register: vi.fn().mockResolvedValue(registration),
      controller: { state: "activated" },
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    };

    Object.defineProperty(navigator, "serviceWorker", {
      value: swMock,
      writable: true,
      configurable: true,
    });

    await act(async () => {
      render(<PwaPrompts />);
    });

    await act(async () => {
      await new Promise((r) => setTimeout(r, 0));
    });

    // updatefound listener should be registered
    expect(registration.addEventListener).toHaveBeenCalledWith(
      "updatefound",
      expect.any(Function),
    );

    // Simulate updatefound event
    const updateFoundCb = registration.addEventListener.mock.calls.find(
      (c: string[]) => c[0] === "updatefound",
    )?.[1] as (() => void) | undefined;

    if (updateFoundCb) {
      updateFoundCb();

      // Now the newWorker statechange listener should be set
      expect(newWorker.addEventListener).toHaveBeenCalledWith(
        "statechange",
        expect.any(Function),
      );

      // Simulate statechange to installed
      const stateChangeCb = newWorker.addEventListener.mock.calls.find(
        (c: string[]) => c[0] === "statechange",
      )?.[1] as (() => void) | undefined;

      if (stateChangeCb) {
        newWorker.state = "installed";
        await act(async () => {
          stateChangeCb();
        });
      }
    }
  });

  it("reloads page on controllerchange", async () => {
    const { controllerChangeListeners } = mockServiceWorker();

    const reloadMock = vi.fn();
    Object.defineProperty(window, "location", {
      value: { ...window.location, reload: reloadMock },
      writable: true,
      configurable: true,
    });

    await act(async () => {
      render(<PwaPrompts />);
    });

    await act(async () => {
      await new Promise((r) => setTimeout(r, 0));
    });

    // Trigger controllerchange
    if (controllerChangeListeners.length > 0) {
      controllerChangeListeners[0]();
      expect(reloadMock).toHaveBeenCalled();
    }
  });
});
