import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { findBankPageBySlug, bankSlugs } from "@/utils/bank-pages";
import { getBreadcrumbSchema } from "@/utils/schema";

type PageParams = {
  slug: string;
};

type Props = {
  params: Promise<PageParams>;
};

export function generateStaticParams() {
  return bankSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const bank = findBankPageBySlug(slug);
  if (!bank) {
    return {
      title: "Bank not found",
    };
  }

  return {
    title: `${bank.name} Exchange Rates Suriname | USD & EUR to SRD | SuriRate`,
    description: `${bank.summary} Compare ${bank.name}'s current USD to SRD and EUR to SRD exchange rates in Paramaribo, Suriname. ${bank.highlights[0] || ""}`,
    alternates: { canonical: `/banks/${bank.slug}` },
    keywords: [
      `${bank.name} exchange rate`,
      `${bank.name} Suriname`,
      `${bank.name} USD to SRD`,
      `${bank.name} EUR to SRD`,
      `${bank.name} Paramaribo`,
      "Suriname bank rates",
      "exchange rate Suriname",
    ],
    openGraph: {
      title: `${bank.name} Exchange Rates in Suriname`,
      description: bank.summary,
      url: `/banks/${bank.slug}`,
    },
  };
}

export default async function BankDetailPage({ params }: Props) {
  const { slug } = await params;
  const bank = findBankPageBySlug(slug);

  if (!bank) {
    notFound();
  }

  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Banks", url: "/banks" },
    { name: bank.name, url: `/banks/${bank.slug}` },
  ]);

  const financialServiceSchema = {
    "@context": "https://schema.org",
    "@type": "FinancialService",
    name: bank.name,
    url: bank.website,
    description: bank.summary,
    address: {
      "@type": "PostalAddress",
      addressLocality: bank.headquarters,
      addressCountry: "SR",
    },
    areaServed: {
      "@type": "Country",
      name: "Suriname",
    },
    serviceType: ["Currency Exchange", "Banking Services"],
    knowsAbout: ["USD to SRD", "EUR to SRD", "Exchange Rates"],
    foundingDate: bank.founded,
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Banking Services",
      itemListElement: bank.services.map((service, index) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: service,
        },
        position: index + 1,
      })),
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white dark:from-gray-900 dark:to-gray-950">
      <div className="container mx-auto px-4 py-12 space-y-6">
        <nav className="text-sm text-green-700 dark:text-green-400">
          <Link
            href="/banks"
            className="underline hover:text-green-600 dark:hover:text-green-300 transition-colors duration-200"
          >
            ← Back to bank profiles
          </Link>
        </nav>
        <header className="space-y-2">
          <p className="text-xs uppercase tracking-wide text-green-600 dark:text-green-500 font-semibold">
            Bank profile • Suriname Exchange Rates
          </p>
          <h1 className="text-3xl font-bold text-green-900 dark:text-green-400">
            {bank.name} - USD & EUR to SRD Exchange Rates
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-3xl">
            {bank.summary}
          </p>
        </header>

        <section className="rounded-2xl border border-green-100 dark:border-green-900 bg-white/90 dark:bg-gray-800/90 p-6 shadow-sm space-y-4">
          <div className="flex flex-wrap gap-6 text-sm text-gray-700 dark:text-gray-300">
            <div>
              <p className="font-semibold text-green-900 dark:text-green-400">
                Headquarters
              </p>
              <p>{bank.headquarters}</p>
            </div>
            <div>
              <p className="font-semibold text-green-900 dark:text-green-400">
                Founded
              </p>
              <p>{bank.founded}</p>
            </div>
            <div>
              <p className="font-semibold text-green-900 dark:text-green-400">
                Official site
              </p>
              <a
                href={bank.website}
                target="_blank"
                rel="noreferrer"
                className="text-green-700 dark:text-green-400 underline"
              >
                {bank.website}
              </a>
            </div>
          </div>
          <div>
            <p className="font-semibold text-green-900 dark:text-green-400">
              Services
            </p>
            <ul className="list-disc pl-5 text-sm text-gray-700 dark:text-gray-300 space-y-1 mt-2">
              {bank.services.map((service) => (
                <li key={service}>{service}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-semibold text-green-900 dark:text-green-400">
              Highlights
            </p>
            <ul className="list-disc pl-5 text-sm text-gray-700 dark:text-gray-300 space-y-1 mt-2">
              {bank.highlights.map((highlight) => (
                <li key={highlight}>{highlight}</li>
              ))}
            </ul>
          </div>
        </section>

        <section className="rounded-2xl border border-green-100 dark:border-green-900 bg-white/90 dark:bg-gray-800/90 p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-green-900 dark:text-green-400">
            Next steps
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            Compare today&apos;s prices on the{" "}
            <Link
              href="/"
              className="text-green-700 dark:text-green-400 underline hover:text-green-600 dark:hover:text-green-300 transition-colors duration-200"
            >
              SuriRate dashboard
            </Link>{" "}
            or learn how we process the numbers in the{" "}
            <Link
              href="/methodology"
              className="text-green-700 dark:text-green-400 underline hover:text-green-600 dark:hover:text-green-300 transition-colors duration-200"
            >
              methodology guide
            </Link>
            .
          </p>
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
          __html: JSON.stringify(financialServiceSchema),
        }}
      />
    </div>
  );
}
