import ExchangeRateGrid from "@/components/exchange-rate-grid";
import ExchangeSkeleton from "@/components/exchange-skeleton";
import Footer from "@/components/footer";
import { getRates } from "@/utils/data";
import { Suspense } from "react";

export const dynamic = 'force-dynamic'

export default async function Home() {
  const info = await getRates();
  const updatedAt = info?.updatedAt;
  const rates = info?.rates || [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex flex-col">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-green-900">Suri Rate</h1>
              <p className="text-sm text-gray-500">
                Exchange rates for Suriname
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800">
            Current Exchange Rates
          </h2>
          <p className="text-sm text-gray-500">
            USD and EUR to SRD from major banks in Suriname
          </p>
        </div>

        <Suspense fallback={<ExchangeSkeleton />}>
          <ExchangeRateGrid rates={rates} />
        </Suspense>
      </main>

      <Footer lastUpdated={updatedAt} />
    </div>
  );
}
