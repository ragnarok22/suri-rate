import { describe, it, expect, vi } from "vitest";
import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { hydrateRoot } from "react-dom/client";

const captureMock = vi.fn();
vi.mock("posthog-js/react", () => ({
  usePostHog: () => ({ capture: captureMock }),
}));

vi.mock("next/link", () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) =>
    React.createElement("a", { href }, children),
}));

import Footer from "../../components/footer";

describe("Footer", () => {
  it("includes the server-provided copyright year in the initial HTML", () => {
    const props = { lastUpdated: undefined, currentYear: 2030 };
    const container = document.createElement("div");
    container.innerHTML = renderToString(<Footer {...props} />);

    expect(container.textContent).toContain("© 2030 SuriRate");
  });

  it("hydrates without changing the copyright year even across a year boundary", async () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date("2030-12-31T12:00:00Z"));
    const props = { lastUpdated: undefined, currentYear: 2030 };
    const container = document.createElement("div");
    const element = <Footer {...props} />;
    container.innerHTML = renderToString(element);
    const serverHTML = container.innerHTML;
    const mutations: MutationRecord[] = [];
    const observer = new MutationObserver((records) =>
      mutations.push(...records),
    );
    observer.observe(container, {
      subtree: true,
      childList: true,
      characterData: true,
      attributes: true,
    });
    const onRecoverableError = vi.fn();
    let root: ReturnType<typeof hydrateRoot> | undefined;

    try {
      vi.setSystemTime(new Date("2031-01-01T12:00:00Z"));
      await act(async () => {
        root = hydrateRoot(container, element, { onRecoverableError });
      });

      expect(mutations).toHaveLength(0);
      expect(container.innerHTML).toBe(serverHTML);
      expect(onRecoverableError).not.toHaveBeenCalled();
    } finally {
      observer.disconnect();
      act(() => root?.unmount());
      vi.useRealTimers();
    }
  });

  it("renders 'Not yet updated' when no lastUpdated", () => {
    render(<Footer lastUpdated={undefined} />);
    expect(screen.getByText(/Not yet updated/)).toBeTruthy();
  });

  it("renders formatted date when lastUpdated is provided", async () => {
    await act(async () => {
      render(<Footer lastUpdated="2024-06-15T12:00:00Z" />);
    });
    const el = screen.getByText(/Last updated:/);
    expect(el.textContent).toContain("Jun");
  });

  it("renders creator link and navigation", async () => {
    await act(async () => {
      render(<Footer lastUpdated={undefined} />);
    });
    const { container } = render(<Footer lastUpdated={undefined} />);
    expect(container.textContent).toContain("Reinier");
    expect(container.textContent).toContain("About");
    expect(container.textContent).toContain("Methodology");
    expect(container.textContent).toContain("Bank profiles");
  });

  it("tracks outbound click on personal site", async () => {
    let container: HTMLElement;
    await act(async () => {
      const result = render(<Footer lastUpdated={undefined} />);
      container = result.container;
    });
    const link = container!.querySelector(
      'a[href*="reinierhernandez"]',
    ) as HTMLAnchorElement;
    expect(link).toBeTruthy();
    fireEvent.click(link);
    expect(captureMock).toHaveBeenCalledWith(
      "outbound_click",
      expect.objectContaining({ type: "personal_website" }),
    );
  });
});
