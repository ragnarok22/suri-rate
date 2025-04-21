import ExchangeRateGrid from "@/components/exchange-rate-grid";
import Footer from "@/components/footer";
import { getCurrentRates } from "@/utils/places";

export default async function Home() {
  const bankRates = await getCurrentRates();

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex flex-col">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-green-900">Central Exchange</h1>
              <p className="text-sm text-gray-500">Exchange rates for Suriname</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Current Exchange Rates</h2>
          <p className="text-sm text-gray-500">USD and EUR to SRD from major banks in Suriname</p>
        </div>

        <ExchangeRateGrid bankRates={bankRates} />

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            Last updated:{" "}
            {new Date().toLocaleString("en-US", {
              dateStyle: "medium",
              timeStyle: "short",
              timeZone: "America/Paramaribo",
            })}
          </p>
          <p className="mt-2">Rates are for informational purposes only. Contact your bank for official rates.</p>
        </div>
      </main>

      <Footer />
    </div>
  )
}
