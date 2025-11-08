import type { BankName, BankRates } from "./definitions";

const siteUrl = "https://suri-rate.ragnarok22.dev";

// Bank addresses for Schema.org LocalBusiness
const bankAddresses: Record<
  BankName,
  { streetAddress: string; addressLocality: string; addressCountry: string }
> = {
  Finabank: {
    streetAddress: "Waterkant",
    addressLocality: "Paramaribo",
    addressCountry: "SR",
  },
  "Central Bank": {
    streetAddress: "Waterkant 20",
    addressLocality: "Paramaribo",
    addressCountry: "SR",
  },
  "Central Money Exchange": {
    streetAddress: "Henck Arronstraat",
    addressLocality: "Paramaribo",
    addressCountry: "SR",
  },
  Hakrinbank: {
    streetAddress: "Henck Arronstraat 26-30",
    addressLocality: "Paramaribo",
    addressCountry: "SR",
  },
  "De Surinaamsche Bank (DSB)": {
    streetAddress: "Henck Arronstraat 26-30",
    addressLocality: "Paramaribo",
    addressCountry: "SR",
  },
  "Republic Bank": {
    streetAddress: "Domineestraat 23",
    addressLocality: "Paramaribo",
    addressCountry: "SR",
  },
};

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
    numberOfItems: rates.length,
    itemListElement: rates.map((bank, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "LocalBusiness",
        "@id": bank.link,
        name: bank.name,
        url: bank.link,
        additionalType: "FinancialService",
        currenciesAccepted: "USD,EUR,SRD",
        address: {
          "@type": "PostalAddress",
          streetAddress: bankAddresses[bank.name].streetAddress,
          addressLocality: bankAddresses[bank.name].addressLocality,
          addressCountry: bankAddresses[bank.name].addressCountry,
        },
        areaServed: {
          "@type": "Country",
          name: "Suriname",
        },
        makesOffer: bank.rates.map((rate) => ({
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: `${rate.currency} to SRD Currency Exchange`,
            serviceType: "Currency Exchange",
          },
          price: rate.buy,
          priceCurrency: "SRD",
          description: `Buy ${rate.currency} at ${rate.buy} SRD, Sell at ${rate.sell} SRD`,
          validFrom: updatedAt ?? new Date().toISOString(),
        })),
      },
    })),
  };
}

export function getExchangeRateSpecifications(
  rates: BankRates[],
  updatedAt?: string,
) {
  return rates.flatMap((bank) =>
    bank.rates.flatMap((rate) => [
      {
        "@context": "https://schema.org",
        "@type": "ExchangeRateSpecification",
        name: `${bank.name} - ${rate.currency} to SRD Buy Rate`,
        description: `${bank.name} buy rate for converting ${rate.currency} to Surinamese Dollar (SRD)`,
        url: bank.link,
        currency: rate.currency,
        currentExchangeRate: {
          "@type": "UnitPriceSpecification",
          price: Number.parseFloat(rate.buy),
          priceCurrency: "SRD",
          name: `${rate.currency}/SRD Buy Rate`,
          validFrom: updatedAt ?? new Date().toISOString(),
        },
      },
      {
        "@context": "https://schema.org",
        "@type": "ExchangeRateSpecification",
        name: `${bank.name} - ${rate.currency} to SRD Sell Rate`,
        description: `${bank.name} sell rate for converting ${rate.currency} to Surinamese Dollar (SRD)`,
        url: bank.link,
        currency: rate.currency,
        currentExchangeRate: {
          "@type": "UnitPriceSpecification",
          price: Number.parseFloat(rate.sell),
          priceCurrency: "SRD",
          name: `${rate.currency}/SRD Sell Rate`,
          validFrom: updatedAt ?? new Date().toISOString(),
        },
        exchangeRateSpread: Number.parseFloat(
          (Number.parseFloat(rate.sell) - Number.parseFloat(rate.buy)).toFixed(
            2,
          ),
        ),
      },
    ]),
  );
}
