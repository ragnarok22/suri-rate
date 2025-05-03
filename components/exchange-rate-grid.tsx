import ExchangeRateCard from "./exchange-rate-card";
import { findBestRates } from "@/utils";
import { BankRates } from "@/utils/definitions";

type ExchangeRateGridProps = {
  rates: BankRates[];
};

export default async function ExchangeRateGrid({
  rates,
}: ExchangeRateGridProps) {
  const bestRates = findBestRates(rates || []);

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
      {rates.map((bankRate) => (
        <ExchangeRateCard
          key={bankRate.name}
          bankRates={bankRate}
          bestRates={bestRates}
        />
      ))}
    </div>
  );
}
