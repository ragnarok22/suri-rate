import { describe, it, expect, beforeEach } from "vitest";
import React from "react";
import { render, screen, act } from "@testing-library/react";
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
    const { container } = render(<OfflineBanner />);
    // After mount effect, should still be empty when online
    await act(() => Promise.resolve());
    expect(container.innerHTML).toBe("");
  });

  it("shows banner when offline", async () => {
    Object.defineProperty(navigator, "onLine", {
      value: false,
      writable: true,
      configurable: true,
    });

    render(<OfflineBanner />);
    await act(() => Promise.resolve());
    expect(screen.getByText("You're offline.")).toBeTruthy();
    expect(
      screen.getByText("Showing cached content if available."),
    ).toBeTruthy();
  });

  it("responds to online/offline events", async () => {
    render(<OfflineBanner />);
    await act(() => Promise.resolve());

    // Go offline
    Object.defineProperty(navigator, "onLine", {
      value: false,
      writable: true,
      configurable: true,
    });
    await act(() => {
      window.dispatchEvent(new Event("offline"));
      return Promise.resolve();
    });
    expect(screen.getByText("You're offline.")).toBeTruthy();

    // Go back online
    Object.defineProperty(navigator, "onLine", {
      value: true,
      writable: true,
      configurable: true,
    });
    await act(() => {
      window.dispatchEvent(new Event("online"));
      return Promise.resolve();
    });
    expect(screen.queryByText("You're offline.")).toBeNull();
  });
});
