import Link from "next/link";

export default function HomeGuide() {
  return (
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
          Follow these steps to get the best USD to SRD or EUR to SRD rates in
          Paramaribo today.
        </p>
      </div>
      <article>
        <h4 className="font-semibold text-green-900 dark:text-green-400">
          1. Scan the dashboard
        </h4>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
          Identify the green &quot;Best&quot; badges for buy and sell prices so
          you instantly know which bank leads the pack.
        </p>
      </article>
      <article>
        <h4 className="font-semibold text-green-900 dark:text-green-400">
          2. Check the source
        </h4>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
          Click any bank card to open the official website or API endpoint for
          confirmation if you plan a trade today.
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
  );
}
