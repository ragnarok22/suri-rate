import { describe, it, expect, beforeEach } from "vitest";
import React from "react";
import { render, act } from "@testing-library/react";
import OfflineBanner from "../../components/offline-banner";

describe("OfflineBanner", () => {
  beforeEach(() => {
    Object.defineProperty(navigator, "onLine", {
      value: true,
      writable: true,
      configurable: true,
    });
  });

  it("renders nothing when online", async () => {
    let container: HTMLElement;
    await act(async () => {
      const result = render(<OfflineBanner />);
      container = result.container;
    });
    expect(container!.innerHTML).toBe("");
  });

  it("shows banner when offline", async () => {
    Object.defineProperty(navigator, "onLine", {
      value: false,
      writable: true,
      configurable: true,
    });

    let container: HTMLElement;
    await act(async () => {
      const result = render(<OfflineBanner />);
      container = result.container;
    });
    expect(container!.textContent).toContain("offline");
    expect(container!.textContent).toContain("cached content");
  });

  it("responds to online/offline events", async () => {
    let container: HTMLElement;
    await act(async () => {
      const result = render(<OfflineBanner />);
      container = result.container;
    });

    // Initially online - no banner
    expect(container!.innerHTML).toBe("");

    // Go offline
    Object.defineProperty(navigator, "onLine", {
      value: false,
      writable: true,
      configurable: true,
    });
    await act(async () => {
      window.dispatchEvent(new Event("offline"));
    });
    expect(container!.textContent).toContain("offline");

    // Go back online
    Object.defineProperty(navigator, "onLine", {
      value: true,
      writable: true,
      configurable: true,
    });
    await act(async () => {
      window.dispatchEvent(new Event("online"));
    });
    expect(container!.innerHTML).toBe("");
  });
});
