import { BankRates } from "./definitions";

export const cn = (...inputs: string[]) => {
  return inputs.filter(Boolean).join(" ");
};

// Helper function to find best rates
export function findBestRates(allRates: BankRates[]): {
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
