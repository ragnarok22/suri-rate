import Image from "next/image"
import Link from "next/link"
import { ExternalLink } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import type { BankRates } from "@/utils/definitions"

interface ExchangeRateCardProps {
  bankRates: BankRates
  bestRates: {
    bestBuyUSD: string
    bestSellUSD: string
    bestBuyEUR: string
    bestSellEUR: string
  }
}

export default function ExchangeRateCard({ bankRates, bestRates }: ExchangeRateCardProps) {
  const { name, logo, link, rates } = bankRates

  // Find USD and EUR rates
  const usdRate = rates.find((rate) => rate.currency === "USD")
  const eurRate = rates.find((rate) => rate.currency === "EUR")

  if (!usdRate || !eurRate) return null

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-green-50 p-4">
        <Link
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 hover:text-green-700 transition-colors"
        >
          <div className="relative h-12 w-12 overflow-hidden rounded-md border bg-white">
            <Image
              src={logo || "/placeholder.svg"}
              alt={`${name} logo`}
              width={48}
              height={48}
              className="object-contain"
            />
          </div>
          <div className="flex items-center gap-1 font-semibold text-lg">
            {name}
            <ExternalLink className="h-4 w-4 text-gray-400" />
          </div>
        </Link>
      </CardHeader>
      <CardContent className="p-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500">USD</span>
              <span className="text-xs text-gray-400">US Dollar</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Buy Rate:</span>
                <div className="flex items-center gap-1">
                  <span className="font-semibold">{usdRate.buy}</span>
                  {usdRate.buy === bestRates.bestBuyUSD && (
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      Best
                    </Badge>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Sell Rate:</span>
                <div className="flex items-center gap-1">
                  <span className="font-semibold">{usdRate.sell}</span>
                  {usdRate.sell === bestRates.bestSellUSD && (
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      Best
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500">EUR</span>
              <span className="text-xs text-gray-400">Euro</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Buy Rate:</span>
                <div className="flex items-center gap-1">
                  <span className="font-semibold">{eurRate.buy}</span>
                  {eurRate.buy === bestRates.bestBuyEUR && (
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      Best
                    </Badge>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Sell Rate:</span>
                <div className="flex items-center gap-1">
                  <span className="font-semibold">{eurRate.sell}</span>
                  {eurRate.sell === bestRates.bestSellEUR && (
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      Best
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
