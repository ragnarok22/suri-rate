import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

export default function HomeHeader() {
  return (
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
              Compare today&apos;s USD to SRD and EUR to SRD exchange rates from
              6 major banks in Suriname. Find the best Suriname dollar rates in
              Paramaribo - we highlight top buy/sell prices and link directly to
              each bank for easy verification.
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
  );
}
