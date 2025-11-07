import Link from "next/link";
import ExchangeRateGrid from "@/components/exchange-rate-grid";
import ExchangeSkeleton from "@/components/exchange-skeleton";
import Footer from "@/components/footer";
import { ThemeToggle } from "@/components/theme-toggle";
import { getRates } from "@/utils/data";
import { Suspense } from "react";

// Revalidate every 12 hours (43200 seconds)
export const revalidate = 43200;

const faqItems = [
  {
    question: "How often does SuriRate update Suriname exchange rates?",
    answer:
      "We refresh data every 12 hours using cached scrapers for Finabank, Central Bank, CME, Hakrinbank, DSB, and Republic Bank.",
  },
  {
    question: "Which currencies can I track?",
    answer:
      "The dashboard focuses on USD and EUR quotes, the most requested pairs for SRD conversions.",
  },
  {
    question: "Where do the buy and sell rates come from?",
    answer:
      "Rates are pulled from each bank's public website or API and normalized with the same timestamp so you can compare apples to apples.",
  },
  {
    question: "Can I verify the rates with each bank?",
    answer:
      "Yes. Each card links directly to the institution so you can double-check or contact them before executing a transaction.",
  },
];

export default async function Home() {
  const info = await getRates();
  const updatedAt = info?.updatedAt;
  const rates = info?.rates || [];

  const siteUrl = "https://suri-rate.ragnarok22.dev";
  const exchangeRateSpecifications = rates.flatMap((bank) =>
    bank.rates.flatMap((rate) => [
      {
        "@type": "ExchangeRateSpecification",
        currency: `${rate.currency}/SRD`,
        provider: {
          "@type": "FinancialService",
          name: bank.name,
          url: bank.link,
        },
        description: `${bank.name} buy rate for ${rate.currency} to SRD`,
        priceType: "buy",
        currentExchangeRate: {
          "@type": "UnitPriceSpecification",
          price: Number.parseFloat(rate.buy),
          priceCurrency: "SRD",
        },
      },
      {
        "@type": "ExchangeRateSpecification",
        currency: `${rate.currency}/SRD`,
        provider: {
          "@type": "FinancialService",
          name: bank.name,
          url: bank.link,
        },
        description: `${bank.name} sell rate for ${rate.currency} to SRD`,
        priceType: "sell",
        currentExchangeRate: {
          "@type": "UnitPriceSpecification",
          price: Number.parseFloat(rate.sell),
          priceCurrency: "SRD",
        },
      },
    ]),
  );

  const datasetStructuredData = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: "SuriRate Exchange Rates",
    description:
      "Daily USD and EUR exchange rates from six major Surinamese banks, normalized for quick comparison.",
    url: siteUrl,
    sameAs: ["https://github.com/ragnarok22/suri-rate"],
    dateModified: updatedAt ?? new Date().toISOString(),
    creator: {
      "@type": "Organization",
      name: "SuriRate",
      url: siteUrl,
    },
    inLanguage: "en",
    keywords: [
      "Suriname exchange rate",
      "USD to SRD",
      "EUR to SRD",
      "Finabank rates",
      "Central Bank rates",
    ],
    hasPart: exchangeRateSpecifications,
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white dark:from-gray-900 dark:to-gray-950 flex flex-col">
      <header className="bg-white dark:bg-gray-900 shadow-sm dark:shadow-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-green-900 dark:text-green-400">
                SuriRate
              </h1>
              <p className="uppercase tracking-wide text-xs text-green-600 dark:text-green-500 font-semibold mt-1">
                Suriname FX dashboard
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 max-w-2xl">
                Compare USD and EUR exchange rates from Suriname&apos;s
                most-used banks in one glance. We normalize each quote,
                highlight the best buy/sell prices, and link back to the source
                so you can take action with confidence.
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
              Current Exchange Rates
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              USD and EUR to SRD from Finabank, Central Bank, CME, Hakrinbank,
              DSB, and Republic Bank.
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
              How to use SuriRate
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Follow this quick workflow to lock in better USD/EUR deals.
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
          __html: JSON.stringify(datasetStructuredData),
        }}
      />
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
      />

      <Footer lastUpdated={updatedAt} />
    </div>
  );
}
