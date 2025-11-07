import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { findBankPageBySlug, bankSlugs } from "@/utils/bank-pages";

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
    title: `${bank.name} Exchange Rates | SuriRate`,
    description: bank.summary,
    alternates: { canonical: `/banks/${bank.slug}` },
  };
}

export default async function BankDetailPage({ params }: Props) {
  const { slug } = await params;
  const bank = findBankPageBySlug(slug);

  if (!bank) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-12 space-y-6">
      <nav className="text-sm text-green-700">
        <Link href="/banks" className="underline">
          ← Back to bank profiles
        </Link>
      </nav>
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-wide text-green-600 font-semibold">
          Bank profile
        </p>
        <h1 className="text-3xl font-bold text-green-900">{bank.name}</h1>
        <p className="text-gray-600 max-w-3xl">{bank.summary}</p>
      </header>

      <section className="rounded-2xl border border-green-100 bg-white/90 p-6 shadow-sm space-y-4">
        <div className="flex flex-wrap gap-6 text-sm text-gray-700">
          <div>
            <p className="font-semibold text-green-900">Headquarters</p>
            <p>{bank.headquarters}</p>
          </div>
          <div>
            <p className="font-semibold text-green-900">Founded</p>
            <p>{bank.founded}</p>
          </div>
          <div>
            <p className="font-semibold text-green-900">Official site</p>
            <a
              href={bank.website}
              target="_blank"
              rel="noreferrer"
              className="text-green-700 underline"
            >
              {bank.website}
            </a>
          </div>
        </div>
        <div>
          <p className="font-semibold text-green-900">Services</p>
          <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1 mt-2">
            {bank.services.map((service) => (
              <li key={service}>{service}</li>
            ))}
          </ul>
        </div>
        <div>
          <p className="font-semibold text-green-900">Highlights</p>
          <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1 mt-2">
            {bank.highlights.map((highlight) => (
              <li key={highlight}>{highlight}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="rounded-2xl border border-green-100 bg-white/90 p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-green-900">Next steps</h2>
        <p className="text-sm text-gray-600 mt-2">
          Compare today&apos;s prices on the{" "}
          <Link href="/" className="text-green-700 underline">
            SuriRate dashboard
          </Link>{" "}
          or learn how we process the numbers in the{" "}
          <Link href="/methodology" className="text-green-700 underline">
            methodology guide
          </Link>
          .
        </p>
      </section>
    </div>
  );
}
