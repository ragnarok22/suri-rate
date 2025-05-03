import ExchangeRateCard from "./exchange-rate-card";
import { findBestRates } from "@/utils";
import { getRates } from "@/utils/data";

export default async function ExchangeRateGrid() {
  const bankRates = await getRates();
  // Find best rates
  const bestRates = findBestRates(bankRates || []);

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
      {bankRates &&
        bankRates.map((bankRate) => (
          <ExchangeRateCard
            key={bankRate.name}
            bankRates={bankRate}
            bestRates={bestRates}
          />
        ))}
    </div>
  );
}
