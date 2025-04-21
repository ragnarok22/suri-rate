import type { BankRates } from "@/utils/definitions";
import ExchangeRateCard from "./exchange-rate-card";

interface ExchangeRateGridProps {
  bankRates: BankRates[];
}

export default function ExchangeRateGrid({ bankRates }: ExchangeRateGridProps) {
  // Find best rates
  const bestRates = findBestRates(bankRates);

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
      {bankRates.map((bankRate) => (
        <ExchangeRateCard
          key={bankRate.name}
          bankRates={bankRate}
          bestRates={bestRates}
        />
      ))}
    </div>
  );
}

// Helper function to find best rates
function findBestRates(allRates: BankRates[]): {
  bestBuyUSD: string;
  bestSellUSD: string;
  bestBuyEUR: string;
  bestSellEUR: string;
} {
  let bestBuyUSD = "0";
  let bestSellUSD = "999999";
  let bestBuyEUR = "0";
  let bestSellEUR = "999999";

  allRates.forEach(({ rates }) => {
    rates.forEach((rate) => {
      if (rate.currency === "USD") {
        if (Number.parseFloat(rate.buy) > Number.parseFloat(bestBuyUSD))
          bestBuyUSD = rate.buy;
        if (Number.parseFloat(rate.sell) < Number.parseFloat(bestSellUSD))
          bestSellUSD = rate.sell;
      } else if (rate.currency === "EUR") {
        if (Number.parseFloat(rate.buy) > Number.parseFloat(bestBuyEUR))
          bestBuyEUR = rate.buy;
        if (Number.parseFloat(rate.sell) < Number.parseFloat(bestSellEUR))
          bestSellEUR = rate.sell;
      }
    });
  });

  return { bestBuyUSD, bestSellUSD, bestBuyEUR, bestSellEUR };
}
