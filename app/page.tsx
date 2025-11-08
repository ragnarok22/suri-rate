import Link from "next/link";
import ExchangeRateGrid from "@/components/exchange-rate-grid";
import ExchangeSkeleton from "@/components/exchange-skeleton";
import Footer from "@/components/footer";
import { ThemeToggle } from "@/components/theme-toggle";
import { getRates } from "@/utils/data";
import { Suspense } from "react";
import {
  getOrganizationSchema,
  getWebSiteSchema,
  getItemListSchema,
  getExchangeRateSpecifications,
} from "@/utils/schema";

// Revalidate every 12 hours (43200 seconds)
export const revalidate = 43200;

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

export default async function Home() {
  const info = await getRates();
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
      <header className="bg-white dark:bg-gray-900 shadow-sm dark:shadow-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-green-900 dark:text-green-400">
                SuriRate - Suriname Exchange Rate Comparison
              </h1>
              <p className="uppercase tracking-wide text-xs text-green-600 dark:text-green-500 font-semibold mt-1">
                USD & EUR to SRD • Paramaribo Banks
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 max-w-2xl">
                Compare today&apos;s USD to SRD and EUR to SRD exchange rates
                from 6 major banks in Suriname. Find the best Suriname dollar
                rates in Paramaribo - we highlight top buy/sell prices and link
                directly to each bank for easy verification.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <nav className="flex flex-wrap gap-3 text-sm font-medium text-green-900 dark:text-green-400">
                <Link
                  href="/methodology"
                  className="hover:text-green-600 dark:hover:text-green-300 transition-colors duration-200"
                >
                  Methodology
                </Link>
                <Link
                  href="/about"
                  className="hover:text-green-600 dark:hover:text-green-300 transition-colors duration-200"
                >
                  About
                </Link>
                <Link
                  href="/banks"
                  className="hover:text-green-600 dark:hover:text-green-300 transition-colors duration-200"
                >
                  Banks
                </Link>
              </nav>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

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

        <section
          aria-labelledby="how-to-heading"
          className="grid gap-6 rounded-2xl border border-green-100 dark:border-green-900 bg-white/80 dark:bg-gray-800/80 p-6 shadow-sm md:grid-cols-3"
        >
          <div className="md:col-span-3 mb-2">
            <h3
              id="how-to-heading"
              className="text-lg font-semibold text-gray-900 dark:text-gray-100"
            >
              How to Find the Best Suriname Exchange Rates
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Follow these steps to get the best USD to SRD or EUR to SRD rates
              in Paramaribo today.
            </p>
          </div>
          <article>
            <h4 className="font-semibold text-green-900 dark:text-green-400">
              1. Scan the dashboard
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              Identify the green &quot;Best&quot; badges for buy and sell prices
              so you instantly know which bank leads the pack.
            </p>
          </article>
          <article>
            <h4 className="font-semibold text-green-900 dark:text-green-400">
              2. Check the source
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              Click any bank card to open the official website or API endpoint
              for confirmation if you plan a trade today.
            </p>
          </article>
          <article>
            <h4 className="font-semibold text-green-900 dark:text-green-400">
              3. Plan with context
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              Head to the{" "}
              <Link
                href="/methodology"
                className="text-green-700 dark:text-green-400 underline hover:text-green-600 dark:hover:text-green-300 transition-colors duration-200"
              >
                methodology page
              </Link>{" "}
              to learn how we normalize rates and what caching rules apply.
            </p>
          </article>
        </section>

        <section
          className="grid gap-6 md:grid-cols-2"
          aria-labelledby="faq-heading"
        >
          <div className="rounded-2xl border border-green-100 dark:border-green-900 bg-white/80 dark:bg-gray-800/80 p-6 shadow-sm">
            <h3
              id="faq-heading"
              className="text-lg font-semibold text-gray-900 dark:text-gray-100"
            >
              Frequently asked questions
            </h3>
            <dl className="mt-4 space-y-4">
              {faqItems.map((item) => (
                <div key={item.question}>
                  <dt className="font-medium text-green-900 dark:text-green-400">
                    {item.question}
                  </dt>
                  <dd className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {item.answer}
                  </dd>
                </div>
              ))}
            </dl>
            <p className="text-sm text-green-700 dark:text-green-400 mt-4">
              Need more details? Visit the{" "}
              <Link
                href="/about"
                className="underline hover:text-green-600 dark:hover:text-green-300 transition-colors duration-200"
              >
                about page
              </Link>{" "}
              for the project story.
            </p>
          </div>
          <div className="rounded-2xl border border-green-100 dark:border-green-900 bg-white/80 dark:bg-gray-800/80 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Bank coverage
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              Learn about each institution&apos;s strengths, branch
              availability, and contact details before you move money.
            </p>
            <div className="mt-4 space-y-3 text-sm">
              <Link
                href="/banks"
                className="block rounded-lg border border-green-200 dark:border-green-800 px-4 py-3 hover:border-green-400 dark:hover:border-green-600 transition-colors duration-200 text-gray-900 dark:text-gray-100"
              >
                Explore the bank profiles
              </Link>
              <Link
                href="/banks/finabank"
                className="block rounded-lg border border-green-200 dark:border-green-800 px-4 py-3 hover:border-green-400 dark:hover:border-green-600 transition-colors duration-200 text-gray-900 dark:text-gray-100"
              >
                View Finabank details
              </Link>
              <Link
                href="/banks/central-bank"
                className="block rounded-lg border border-green-200 dark:border-green-800 px-4 py-3 hover:border-green-400 dark:hover:border-green-600 transition-colors duration-200 text-gray-900 dark:text-gray-100"
              >
                View Central Bank insights
              </Link>
            </div>
          </div>
        </section>
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
      {exchangeRateSpecifications.map((spec, index) => (
        <script
          key={`exchange-rate-${index}`}
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: JSON.stringify(spec) }}
        />
      ))}

      <Footer lastUpdated={updatedAt} />
    </div>
  );
}
