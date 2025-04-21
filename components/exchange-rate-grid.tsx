import type { ExchangeRate } from "@/lib/exchange-rates"
import ExchangeRateCard from "./exchange-rate-card"

interface ExchangeRateGridProps {
  rates: ExchangeRate[]
}

export default function ExchangeRateGrid({ rates }: ExchangeRateGridProps) {
  // Group rates by bank
  const bankGroups = rates.reduce(
    (groups, rate) => {
      if (!groups[rate.bank]) {
        groups[rate.bank] = []
      }
      groups[rate.bank].push(rate)
      return groups
    },
    {} as Record<string, ExchangeRate[]>,
  )

  // Find best rates
  const bestBuyUSD = Math.max(...rates.filter((r) => r.currency === "USD").map((r) => r.buyRate))
  const bestSellUSD = Math.min(...rates.filter((r) => r.currency === "USD").map((r) => r.sellRate))
  const bestBuyEUR = Math.max(...rates.filter((r) => r.currency === "EUR").map((r) => r.buyRate))
  const bestSellEUR = Math.min(...rates.filter((r) => r.currency === "EUR").map((r) => r.sellRate))

  const bestRates = {
    buyUSD: bestBuyUSD,
    sellUSD: bestSellUSD,
    buyEUR: bestBuyEUR,
    sellEUR: bestSellEUR,
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
      {Object.values(bankGroups).map((bankRates) => (
        <ExchangeRateCard key={bankRates[0].bank} bankRates={bankRates} bestRates={bestRates} />
      ))}
    </div>
  )
}
