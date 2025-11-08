import Link from "next/link";
import type { Metadata } from "next";
import { ThemeToggle } from "@/components/theme-toggle";

export const metadata: Metadata = {
  title: "404 - Page Not Found | SuriRate",
  description:
    "The page you're looking for doesn't exist. Return to SuriRate to compare Suriname exchange rates.",
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white dark:from-gray-900 dark:to-gray-950 flex flex-col">
      <header className="bg-white dark:bg-gray-900 shadow-sm dark:shadow-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <Link href="/">
              <h1 className="text-2xl font-bold text-green-900 dark:text-green-400 hover:text-green-600 dark:hover:text-green-300 transition-colors duration-200">
                SuriRate
              </h1>
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center px-4 py-16">
        <div className="max-w-md w-full text-center">
          <div className="mb-8">
            <h2 className="text-6xl font-bold text-green-900 dark:text-green-400 mb-2">
              404
            </h2>
            <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Page Not Found
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              Sorry, the page you&apos;re looking for doesn&apos;t exist or has
              been moved.
            </p>
          </div>

          <div className="space-y-4">
            <Link
              href="/"
              className="block w-full rounded-lg bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 text-white font-medium py-3 px-6 transition-colors duration-200"
            >
              Back to Home
            </Link>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <Link
                href="/banks"
                className="block rounded-lg border border-green-200 dark:border-green-800 px-4 py-3 hover:border-green-400 dark:hover:border-green-600 transition-colors duration-200 text-gray-900 dark:text-gray-100"
              >
                View Banks
              </Link>
              <Link
                href="/about"
                className="block rounded-lg border border-green-200 dark:border-green-800 px-4 py-3 hover:border-green-400 dark:hover:border-green-600 transition-colors duration-200 text-gray-900 dark:text-gray-100"
              >
                About Us
              </Link>
            </div>
          </div>

          <div className="mt-12 rounded-2xl border border-green-100 dark:border-green-900 bg-white/80 dark:bg-gray-800/80 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Looking for exchange rates?
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Compare today&apos;s USD to SRD and EUR to SRD rates from 6 major
              banks in Suriname: Finabank, Central Bank, CME, Hakrinbank, DSB,
              and Republic Bank.
            </p>
            <Link
              href="/"
              className="text-green-700 dark:text-green-400 font-medium text-sm hover:text-green-600 dark:hover:text-green-300 transition-colors duration-200"
            >
              View Current Rates →
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
