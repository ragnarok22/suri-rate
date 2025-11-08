import type { Metadata } from "next";
import Link from "next/link";
import { bankPages } from "@/utils/bank-pages";
import { getBreadcrumbSchema } from "@/utils/schema";

export const metadata: Metadata = {
  title:
    "Suriname Banks Directory - Exchange Rate Comparison | USD & EUR to SRD",
  description:
    "Complete profiles of 6 major banks in Suriname offering USD and EUR to SRD exchange rates: Finabank, Central Bank of Suriname, CME, Hakrinbank, DSB, and Republic Bank in Paramaribo.",
  alternates: { canonical: "/banks" },
  keywords: [
    "Suriname banks",
    "Paramaribo banks",
    "Suriname exchange rates",
    "banks in Suriname",
    "Finabank",
    "Central Bank Suriname",
    "CME bank",
    "Hakrinbank",
    "DSB bank",
    "Republic Bank Suriname",
  ],
  openGraph: {
    title: "Suriname Banks Directory - Exchange Rate Comparison",
    description:
      "Explore profiles of 6 major banks in Suriname providing USD and EUR to SRD exchange rates.",
    url: "/banks",
  },
};

export default function BanksPage() {
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Banks", url: "/banks" },
  ]);

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Suriname Banks Offering Exchange Rates",
    description:
      "List of major banks in Suriname providing USD and EUR to SRD exchange rates",
    itemListElement: bankPages.map((bank, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "FinancialService",
        name: bank.name,
        url: `https://suri-rate.ragnarok22.dev/banks/${bank.slug}`,
        description: bank.summary,
        address: {
          "@type": "PostalAddress",
          addressLocality: bank.headquarters,
          addressCountry: "SR",
        },
      },
    })),
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white dark:from-gray-900 dark:to-gray-950">
      <div className="container mx-auto px-4 py-12 space-y-8">
        <nav className="text-sm text-green-700 dark:text-green-400">
          <Link
            href="/"
            className="underline hover:text-green-600 dark:hover:text-green-300 transition-colors duration-200"
          >
            ← Back to dashboard
          </Link>
        </nav>
        <header className="space-y-2">
          <p className="text-xs uppercase tracking-wide text-green-600 dark:text-green-500 font-semibold">
            Suriname Banks • Exchange Rates
          </p>
          <h1 className="text-3xl font-bold text-green-900 dark:text-green-400">
            Banks Offering USD & EUR Exchange Rates in Suriname
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-3xl">
            Explore detailed profiles of the 6 major banks in Paramaribo and
            Suriname providing USD to SRD and EUR to SRD exchange rates. Compare
            their services, locations, and current rates.
          </p>
        </header>

        <section className="grid gap-6 md:grid-cols-2">
          {bankPages.map((bank) => (
            <article
              key={bank.slug}
              className="rounded-2xl border border-green-100 dark:border-green-900 bg-white/90 dark:bg-gray-800/90 p-6 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-green-900 dark:text-green-400">
                    {bank.name}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Headquarters: {bank.headquarters}
                  </p>
                </div>
                <Link
                  href={`/banks/${bank.slug}`}
                  className="text-sm text-green-700 dark:text-green-400 underline hover:text-green-600 dark:hover:text-green-300 transition-colors duration-200"
                >
                  Details
                </Link>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">
                {bank.summary}
              </p>
              <ul className="mt-4 list-disc pl-5 text-sm text-gray-600 dark:text-gray-400 space-y-1">
                {bank.highlights.map((highlight) => (
                  <li key={highlight}>{highlight}</li>
                ))}
              </ul>
            </article>
          ))}
        </section>
      </div>

      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(itemListSchema),
        }}
      />
    </div>
  );
}
