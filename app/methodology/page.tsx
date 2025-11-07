import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Methodology | SuriRate",
  description:
    "Understand how SuriRate scrapes Suriname bank rates, caches responses, and highlights the best exchange prices.",
  alternates: { canonical: "/methodology" },
};

const steps = [
  {
    title: "Scraping",
    detail:
      "Cheerio-based parsers read HTML tables from Central Bank, Hakrinbank, Republic Bank, and Finabank. JSON APIs power DSB and CME.",
  },
  {
    title: "Normalization",
    detail:
      "Rates are converted to numbers, clamped to two decimals, and tagged with bank metadata before rendering.",
  },
  {
    title: "Caching",
    detail:
      "Next.js 15 revalidates every 12 hours. Results are also cached at the service-worker level for offline reads.",
  },
];

export default function MethodologyPage() {
  return (
    <div className="container mx-auto px-4 py-12 space-y-10">
      <nav className="text-sm text-green-700 dark:text-green-400">
        <Link href="/" className="underline">
          ← Back to dashboard
        </Link>
      </nav>
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-wide text-green-600 dark:text-green-500 font-semibold">
          Transparency
        </p>
        <h1 className="text-3xl font-bold text-green-900 dark:text-green-400">
          Methodology
        </h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-3xl">
          Here is the lifecycle from fetching to displaying every exchange rate
          inside SuriRate.
        </p>
      </header>

      <section className="grid gap-6 md:grid-cols-3">
        {steps.map((step) => (
          <article
            key={step.title}
            className="rounded-2xl border border-green-100 dark:border-green-900 bg-white/90 dark:bg-gray-800/90 p-6 shadow-sm"
          >
            <h2 className="text-lg font-semibold text-green-900 dark:text-green-400">
              {step.title}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              {step.detail}
            </p>
          </article>
        ))}
      </section>

      <section className="rounded-2xl border border-green-100 dark:border-green-900 bg-white/90 dark:bg-gray-800/90 p-6 shadow-sm space-y-4">
        <h2 className="text-xl font-semibold text-green-900 dark:text-green-400">
          Best-rate badge logic
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          We scan all USD and EUR quotes, track the highest buy price and lowest
          sell price, and label them &quot;Best&quot; on the dashboard. This
          ensures you notice outliers instantly while still seeing each
          bank&apos;s spread.
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Need bank-specific notes? Jump to the{" "}
          <Link
            href="/banks"
            className="text-green-700 dark:text-green-400 underline"
          >
            bank profiles
          </Link>
          .
        </p>
      </section>
    </div>
  );
}
