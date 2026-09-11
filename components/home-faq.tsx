import Link from "next/link";

type HomeFaqProps = {
  items: { question: string; answer: string }[];
};

export default function HomeFaq({ items }: HomeFaqProps) {
  return (
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
          {items.map((item) => (
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
          Learn about each institution&apos;s strengths, branch availability,
          and contact details before you move money.
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
  );
}
