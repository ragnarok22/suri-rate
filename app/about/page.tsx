import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About SuriRate",
  description:
    "Learn why SuriRate tracks Suriname's exchange rates, how the project started, and what powers the dashboard.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12 space-y-10">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-wide text-green-600 font-semibold">
          About the project
        </p>
        <h1 className="text-3xl font-bold text-green-900">
          Why SuriRate exists
        </h1>
        <p className="text-gray-600 max-w-3xl">
          SuriRate started as a weekend project to stop refreshing six different
          bank websites before buying USD or EUR. Today it is a structured
          dataset that normalizes public rates, highlights best offers, and
          keeps an offline-ready archive so travelers and business owners can
          decide faster.
        </p>
      </header>

      <section className="grid gap-6 md:grid-cols-2">
        <article className="rounded-2xl border border-green-100 bg-white/90 p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-green-900">
            Data transparency
          </h2>
          <p className="text-sm text-gray-600 mt-2">
            Every number you see is sourced from a public endpoint or HTML page.
            We log scraping errors, fall back to zeros when a provider is down,
            and display the timestamp so you know how fresh the snapshot is.
          </p>
        </article>
        <article className="rounded-2xl border border-green-100 bg-white/90 p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-green-900">
            Built for humans
          </h2>
          <p className="text-sm text-gray-600 mt-2">
            Instead of long tables, SuriRate surfaces the best buy/sell rates,
            adds color-coded badges, and works offline as a PWA. We also keep an
            accessible layout for quick scanning on mobile.
          </p>
        </article>
      </section>

      <section className="rounded-2xl border border-green-100 bg-white/90 p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-green-900">
          Want the technical details?
        </h2>
        <p className="text-sm text-gray-600 mt-2">
          Head to the{" "}
          <Link href="/methodology" className="text-green-700 underline">
            methodology page
          </Link>{" "}
          for caching rules, runtime tech, and scraping safeguards. Curious
          which banks we cover? The{" "}
          <Link href="/banks" className="text-green-700 underline">
            bank directory
          </Link>
          highlights links, services, and profiles.
        </p>
      </section>
    </div>
  );
}
