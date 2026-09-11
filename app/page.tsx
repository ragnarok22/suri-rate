import { cacheLife } from "next/cache";
import ExchangeRateGrid from "@/components/exchange-rate-grid";
import ExchangeSkeleton from "@/components/exchange-skeleton";
import Footer from "@/components/footer";
import HomeFaq from "@/components/home-faq";
import HomeGuide from "@/components/home-guide";
import HomeHeader from "@/components/home-header";
import { getRates } from "@/utils/data";
import { Suspense } from "react";
import {
  getOrganizationSchema,
  getWebSiteSchema,
  getItemListSchema,
  getExchangeRateSpecifications,
} from "@/utils/schema";

const faqItems = [
  {
    question: "How often does SuriRate update Suriname exchange rates?",
    answer:
      "We refresh USD to SRD and EUR to SRD rates every 12 hours from 6 major Surinamese banks: Finabank, Central Bank, CME, Hakrinbank, DSB, and Republic Bank in Paramaribo.",
  },
  {
    question: "Which currencies can I track?",
    answer:
      "SuriRate tracks USD to SRD and EUR to SRD exchange rates, the two most commonly exchanged foreign currencies in Suriname.",
  },
  {
    question: "Where do the Suriname exchange rates come from?",
    answer:
      "All rates are pulled directly from each bank's official website or API in Paramaribo and Suriname, normalized with timestamps for accurate comparison.",
  },
  {
    question: "Which Suriname bank has the best exchange rate today?",
    answer:
      "SuriRate highlights the best buy and sell rates with green badges, making it easy to find the top USD and EUR exchange rates across all major Surinamese banks.",
  },
  {
    question: "Can I verify the exchange rates with each bank?",
    answer:
      "Yes. Each bank card links directly to the institution's official website so you can verify current rates or contact them before making a transaction.",
  },
];

async function getCurrentYear() {
  "use cache";
  cacheLife("exchangeRates");

  return new Date().getFullYear();
}

export default async function Home() {
  const [info, currentYear] = await Promise.all([getRates(), getCurrentYear()]);
  const updatedAt = info?.updatedAt;
  const rates = info?.rates || [];

  const siteUrl = "https://suri-rate.ragnarok22.dev";

  const datasetStructuredData = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: "SuriRate Suriname Exchange Rates",
    description:
      "Real-time USD to SRD and EUR to SRD exchange rates from six major banks in Suriname (Paramaribo): Finabank, Central Bank, CME, Hakrinbank, DSB, and Republic Bank. Updated every 12 hours for accurate comparison.",
    url: siteUrl,
    sameAs: ["https://github.com/ragnarok22/suri-rate"],
    dateModified: updatedAt ?? new Date().toISOString(),
    license: "https://creativecommons.org/publicdomain/zero/1.0/",
    creator: {
      "@type": "Organization",
      name: "SuriRate",
      url: siteUrl,
    },
    spatialCoverage: {
      "@type": "Place",
      name: "Suriname",
      geo: {
        "@type": "GeoCoordinates",
        latitude: 5.852,
        longitude: -55.2038,
      },
      address: {
        "@type": "PostalAddress",
        addressCountry: "SR",
        addressLocality: "Paramaribo",
      },
    },
    inLanguage: "en",
    keywords: [
      "Suriname exchange rate",
      "USD to SRD",
      "EUR to SRD",
      "Suriname dollar rate",
      "Paramaribo exchange rate",
      "Finabank rates",
      "Central Bank Suriname",
      "best exchange rate Suriname",
    ],
    hasPart: rates.map((bank) => ({
      "@type": "Dataset",
      name: `${bank.name} Exchange Rates`,
      description: `USD and EUR to SRD exchange rates from ${bank.name}`,
      identifier: bank.link,
    })),
  };

  const faqStructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  const organizationSchema = getOrganizationSchema();
  const webSiteSchema = getWebSiteSchema();
  const itemListSchema = getItemListSchema(rates, updatedAt);
  const exchangeRateSpecifications = getExchangeRateSpecifications(
    rates,
    updatedAt,
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white dark:from-gray-900 dark:to-gray-950 flex flex-col">
      <HomeHeader />

      <main className="container mx-auto px-4 py-10 space-y-12">
        <section aria-labelledby="rates-heading">
          <div className="mb-6">
            <h2
              id="rates-heading"
              className="text-xl font-semibold text-gray-900 dark:text-gray-100"
            >
              Today&apos;s Suriname Exchange Rates (USD & EUR to SRD)
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Compare current exchange rates from 6 major banks in Paramaribo:
              Finabank, Central Bank, CME, Hakrinbank, DSB, and Republic Bank.
              Updated every 12 hours.
            </p>
          </div>

          <Suspense fallback={<ExchangeSkeleton />}>
            <ExchangeRateGrid rates={rates} />
          </Suspense>
        </section>

        <HomeGuide />
        <HomeFaq items={faqItems} />
      </main>

      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema),
        }}
      />
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema) }}
      />
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(itemListSchema),
        }}
      />
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(datasetStructuredData),
        }}
      />
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
      />
      {exchangeRateSpecifications.map((spec) => (
        <script
          key={spec.name}
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: JSON.stringify(spec) }}
        />
      ))}

      <Footer lastUpdated={updatedAt} currentYear={currentYear} />
    </div>
  );
}
