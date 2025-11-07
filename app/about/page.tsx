import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About | SuriRate",
  description:
    "Learn why SuriRate tracks Suriname's exchange rates, how the project started, and what powers the dashboard.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white dark:from-gray-900 dark:to-gray-950">
      <div className="container mx-auto px-4 py-12 space-y-10">
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
            About the project
          </p>
          <h1 className="text-3xl font-bold text-green-900 dark:text-green-400">
            Why SuriRate exists
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-3xl">
            SuriRate started as a weekend project to stop refreshing six
            different bank websites before buying USD or EUR. Today it is a
            structured dataset that normalizes public rates, highlights best
            offers, and keeps an offline-ready archive so travelers and business
            owners can decide faster.
          </p>
        </header>

        <section className="grid gap-6 md:grid-cols-2">
          <article className="rounded-2xl border border-green-100 dark:border-green-900 bg-white/90 dark:bg-gray-800/90 p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-green-900 dark:text-green-400">
              Data transparency
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              Every number you see is sourced from a public endpoint or HTML
              page. We log scraping errors, fall back to zeros when a provider
              is down, and display the timestamp so you know how fresh the
              snapshot is.
            </p>
          </article>
          <article className="rounded-2xl border border-green-100 dark:border-green-900 bg-white/90 dark:bg-gray-800/90 p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-green-900 dark:text-green-400">
              Built for humans
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              Instead of long tables, SuriRate surfaces the best buy/sell rates,
              adds color-coded badges, and works offline as a PWA. We also keep
              an accessible layout for quick scanning on mobile.
            </p>
          </article>
        </section>

        <section className="rounded-2xl border border-green-100 dark:border-green-900 bg-white/90 dark:bg-gray-800/90 p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-green-900 dark:text-green-400">
            Want the technical details?
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            Head to the{" "}
            <Link
              href="/methodology"
              className="text-green-700 dark:text-green-400 underline hover:text-green-600 dark:hover:text-green-300 transition-colors duration-200"
            >
              methodology page
            </Link>{" "}
            for caching rules, runtime tech, and scraping safeguards. Curious
            which banks we cover? The{" "}
            <Link
              href="/banks"
              className="text-green-700 dark:text-green-400 underline hover:text-green-600 dark:hover:text-green-300 transition-colors duration-200"
            >
              bank directory
            </Link>{" "}
            highlights links, services, and profiles.
          </p>
        </section>
      </div>
    </div>
  );
}
