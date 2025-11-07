import type { Metadata } from "next";
import Link from "next/link";
import { bankPages } from "@/utils/bank-pages";

export const metadata: Metadata = {
  title: "Bank Directory | SuriRate",
  description:
    "Profiles for Finabank, Central Bank, CME, Hakrinbank, DSB, and Republic Bank.",
  alternates: { canonical: "/banks" },
};

export default function BanksPage() {
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
            Coverage
          </p>
          <h1 className="text-3xl font-bold text-green-900 dark:text-green-400">
            Bank profiles
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-3xl">
            Understand who powers the exchange rates you see on the dashboard
            and bookmark the ones you rely on the most.
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
    </div>
  );
}
