import type { BankRates } from "./definitions";

const siteUrl = "https://suri-rate.ragnarok22.dev";

export function getOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "SuriRate",
    url: siteUrl,
    logo: `${siteUrl}/icon-512x512.png`,
    description:
      "SuriRate provides real-time USD and EUR exchange rate comparisons from major banks in Suriname, helping users find the best rates in Paramaribo and across the country.",
    foundingDate: "2024",
    founder: {
      "@type": "Person",
      name: "Reinier Hernández",
      url: "https://reinierhernandez.com",
    },
    areaServed: {
      "@type": "Country",
      name: "Suriname",
    },
    sameAs: [
      "https://github.com/ragnarok22/suri-rate",
      "https://twitter.com/ragnarokreinier",
    ],
    knowsAbout: [
      "Exchange Rates",
      "Currency Conversion",
      "Surinamese Dollar",
      "USD to SRD",
      "EUR to SRD",
      "Banking in Suriname",
    ],
  };
}

export function getBreadcrumbSchema(
  items: Array<{ name: string; url: string }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${siteUrl}${item.url}`,
    })),
  };
}

export function getWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "SuriRate",
    url: siteUrl,
    description:
      "Compare exchange rates from Suriname's major banks - Finabank, Central Bank, CME, Hakrinbank, DSB, and Republic Bank. Find the best USD and EUR rates in Paramaribo.",
    inLanguage: "en",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteUrl}/?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function getFinancialServiceSchema(bank: BankRates) {
  return {
    "@context": "https://schema.org",
    "@type": "FinancialService",
    name: bank.name,
    url: bank.link,
    areaServed: {
      "@type": "Country",
      name: "Suriname",
    },
    serviceType: "Currency Exchange",
    offers: bank.rates.map((rate) => ({
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: `${rate.currency} to SRD Exchange`,
      },
      price: rate.buy,
      priceCurrency: "SRD",
      description: `Buy ${rate.currency} at ${rate.buy} SRD, Sell at ${rate.sell} SRD`,
    })),
  };
}

export function getItemListSchema(rates: BankRates[], updatedAt?: string) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Suriname Exchange Rates Comparison",
    description:
      "Current USD and EUR exchange rates from major Surinamese banks",
    itemListElement: rates.map((bank, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "FinancialService",
        name: bank.name,
        url: bank.link,
        offers: bank.rates.map((rate) => ({
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: `${rate.currency}/SRD Exchange`,
          },
          price: rate.buy,
          priceCurrency: "SRD",
        })),
      },
    })),
    dateModified: updatedAt ?? new Date().toISOString(),
  };
}
