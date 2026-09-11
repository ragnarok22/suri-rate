import { describe, it, expect, vi } from "vitest";
import React from "react";
import { renderToString } from "react-dom/server";
import { render } from "@testing-library/react";

vi.mock("next/link", () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) =>
    React.createElement("a", { href }, children),
}));

vi.mock("next/navigation", () => ({
  notFound: vi.fn(() => {
    throw new Error("NEXT_NOT_FOUND");
  }),
}));

const captureMock = vi.fn();
vi.mock("posthog-js/react", () => ({
  usePostHog: () => ({ capture: captureMock }),
}));

import BankDetailPage, {
  generateStaticParams,
  generateMetadata,
} from "../../app/banks/[slug]/page";
import * as bankPages from "@/utils/bank-pages";

describe("generateStaticParams", () => {
  it("returns all bank slugs", () => {
    const params = generateStaticParams();
    expect(params).toHaveLength(6);
    expect(params[0]).toHaveProperty("slug");
  });
});

describe("generateMetadata", () => {
  it("returns metadata for a valid slug", async () => {
    const metadata = await generateMetadata({
      params: Promise.resolve({ slug: "finabank" }),
    });
    expect(metadata.title).toContain("Finabank");
  });

  it("returns 'Bank not found' for invalid slug", async () => {
    const metadata = await generateMetadata({
      params: Promise.resolve({ slug: "nonexistent" }),
    });
    expect(metadata.title).toBe("Bank not found");
  });
});

describe("BankDetailPage", () => {
  it("renders bank details for a valid slug", async () => {
    const page = await BankDetailPage({
      params: Promise.resolve({ slug: "finabank" }),
    });
    const { container } = render(page);
    expect(container.textContent).toContain("Finabank");
    expect(container.textContent).toContain("USD & EUR to SRD Exchange Rates");
  });

  it("renders bank services and highlights", async () => {
    const page = await BankDetailPage({
      params: Promise.resolve({ slug: "finabank" }),
    });
    const { container } = render(page);
    expect(container.textContent).toContain("Services");
    expect(container.textContent).toContain("Highlights");
  });

  it("calls notFound for invalid slug", async () => {
    await expect(
      BankDetailPage({ params: Promise.resolve({ slug: "nonexistent" }) }),
    ).rejects.toThrow("NEXT_NOT_FOUND");
  });

  it("renders structured data scripts", async () => {
    const page = await BankDetailPage({
      params: Promise.resolve({ slug: "dsb" }),
    });
    const { container } = render(page);
    const scripts = container.querySelectorAll(
      'script[type="application/ld+json"]',
    );
    expect(scripts.length).toBe(2);
  });

  it("keeps bank profile data inside JSON-LD when server HTML is parsed", async () => {
    const payload =
      "</script><img data-json-breakout src=x onerror=alert(1)> & < >";
    const findBankMock = vi
      .spyOn(bankPages, "findBankPageBySlug")
      .mockReturnValueOnce({
        ...bankPages.bankPages[0],
        slug: payload,
        summary: payload,
      });

    try {
      const page = await BankDetailPage({
        params: Promise.resolve({ slug: "finabank" }),
      });
      const document = new DOMParser().parseFromString(
        renderToString(page),
        "text/html",
      );
      expect(document.querySelector("[data-json-breakout]")).toBeNull();

      const scripts = document.querySelectorAll(
        'script[type="application/ld+json"]',
      );
      expect(scripts).toHaveLength(2);
      const schemas = Array.from(scripts, (script) => {
        expect(script.textContent).not.toMatch(/[<>&]/);
        return JSON.parse(script.textContent || "{}");
      });
      const service = schemas.find(
        (schema) => schema["@type"] === "FinancialService",
      );
      expect(service.description).toBe(payload);
      const breadcrumb = schemas.find(
        (schema) => schema["@type"] === "BreadcrumbList",
      );
      expect(breadcrumb.itemListElement[2].item).toBe(
        `https://suri-rate.ragnarok22.dev/banks/${payload}`,
      );
    } finally {
      findBankMock.mockRestore();
    }
  });
});
