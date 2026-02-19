import { describe, it, expect } from "vitest";
import type { BankRates } from "../utils/definitions";
import {
  getOrganizationSchema,
  getBreadcrumbSchema,
  getWebSiteSchema,
  getFinancialServiceSchema,
  getItemListSchema,
  getExchangeRateSpecifications,
} from "../utils/schema";

const sampleBank: BankRates = {
  name: "Finabank",
  logo: "/logos/finabank.jpg",
  link: "https://finabanknv.com",
  rates: [
    { currency: "USD", buy: "5.50", sell: "5.80" },
    { currency: "EUR", buy: "6.10", sell: "6.40" },
  ],
};

const sampleBanks: BankRates[] = [
  sampleBank,
  {
    name: "Central Bank",
    logo: "/logos/central-bank.jpg",
    link: "https://www.cbvs.sr",
    rates: [
      { currency: "USD", buy: "5.40", sell: "5.90" },
      { currency: "EUR", buy: "6.00", sell: "6.50" },
    ],
  },
];

describe("getOrganizationSchema", () => {
  it("returns valid Organization schema", () => {
    const schema = getOrganizationSchema();
    expect(schema["@context"]).toBe("https://schema.org");
    expect(schema["@type"]).toBe("Organization");
    expect(schema.name).toBe("SuriRate");
    expect(schema.url).toContain("suri-rate");
    expect(schema.logo).toContain("icon-512x512.png");
    expect(schema.founder["@type"]).toBe("Person");
    expect(schema.areaServed.name).toBe("Suriname");
    expect(schema.sameAs).toBeInstanceOf(Array);
    expect(schema.knowsAbout).toBeInstanceOf(Array);
  });
});

describe("getBreadcrumbSchema", () => {
  it("returns BreadcrumbList with correct positions", () => {
    const items = [
      { name: "Home", url: "/" },
      { name: "Banks", url: "/banks" },
    ];
    const schema = getBreadcrumbSchema(items);
    expect(schema["@type"]).toBe("BreadcrumbList");
    expect(schema.itemListElement).toHaveLength(2);
    expect(schema.itemListElement[0].position).toBe(1);
    expect(schema.itemListElement[0].name).toBe("Home");
    expect(schema.itemListElement[1].position).toBe(2);
    expect(schema.itemListElement[1].name).toBe("Banks");
  });

  it("prepends siteUrl to each item url", () => {
    const schema = getBreadcrumbSchema([{ name: "About", url: "/about" }]);
    expect(schema.itemListElement[0].item).toContain("/about");
    expect(schema.itemListElement[0].item).toContain("suri-rate");
  });
});

describe("getWebSiteSchema", () => {
  it("returns valid WebSite schema", () => {
    const schema = getWebSiteSchema();
    expect(schema["@type"]).toBe("WebSite");
    expect(schema.name).toBe("SuriRate");
    expect(schema.inLanguage).toBe("en");
    expect(schema.potentialAction["@type"]).toBe("SearchAction");
  });
});

describe("getFinancialServiceSchema", () => {
  it("returns FinancialService with offers", () => {
    const schema = getFinancialServiceSchema(sampleBank);
    expect(schema["@type"]).toBe("FinancialService");
    expect(schema.name).toBe("Finabank");
    expect(schema.offers).toHaveLength(2);
    expect(schema.offers[0].price).toBe("5.50");
    expect(schema.offers[0].priceCurrency).toBe("SRD");
    expect(schema.offers[0].description).toContain("USD");
    expect(schema.offers[1].description).toContain("EUR");
  });
});

describe("getItemListSchema", () => {
  it("returns ItemList with correct numberOfItems", () => {
    const schema = getItemListSchema(sampleBanks, "2024-01-01T00:00:00Z");
    expect(schema["@type"]).toBe("ItemList");
    expect(schema.numberOfItems).toBe(2);
    expect(schema.itemListElement).toHaveLength(2);
    expect(schema.itemListElement[0].position).toBe(1);
    expect(schema.itemListElement[0].item["@type"]).toBe("LocalBusiness");
    expect(schema.itemListElement[0].item.name).toBe("Finabank");
  });

  it("uses updatedAt for validFrom when provided", () => {
    const ts = "2024-06-01T12:00:00Z";
    const schema = getItemListSchema(sampleBanks, ts);
    const firstOffer = schema.itemListElement[0].item.makesOffer[0];
    expect(firstOffer.validFrom).toBe(ts);
  });

  it("falls back to current date when updatedAt is omitted", () => {
    const schema = getItemListSchema(sampleBanks);
    const firstOffer = schema.itemListElement[0].item.makesOffer[0];
    expect(firstOffer.validFrom).toBeTruthy();
  });
});

describe("getExchangeRateSpecifications", () => {
  it("produces two specs per currency per bank (buy + sell)", () => {
    const specs = getExchangeRateSpecifications(
      [sampleBank],
      "2024-01-01T00:00:00Z",
    );
    // 1 bank × 2 currencies × 2 (buy+sell) = 4
    expect(specs).toHaveLength(4);
    expect(specs[0]["@type"]).toBe("ExchangeRateSpecification");
    expect(specs[0].name).toContain("Buy Rate");
    expect(specs[1].name).toContain("Sell Rate");
  });

  it("includes exchangeRateSpread on sell specs", () => {
    const specs = getExchangeRateSpecifications([sampleBank]);
    const sellSpec = specs[1]; // first sell spec
    expect(sellSpec.exchangeRateSpread).toBeDefined();
    expect(typeof sellSpec.exchangeRateSpread).toBe("number");
  });

  it("uses updatedAt for validFrom", () => {
    const ts = "2024-06-15T10:00:00Z";
    const specs = getExchangeRateSpecifications([sampleBank], ts);
    expect(specs[0].currentExchangeRate.validFrom).toBe(ts);
  });

  it("handles multiple banks", () => {
    const specs = getExchangeRateSpecifications(sampleBanks);
    // 2 banks × 2 currencies × 2 = 8
    expect(specs).toHaveLength(8);
  });
});
