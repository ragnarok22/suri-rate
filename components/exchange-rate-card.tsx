import Image from "next/image"
import Link from "next/link"
import { ExternalLink } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import type { ExchangeRate } from "@/lib/exchange-rates"

interface ExchangeRateCardProps {
  bankRates: ExchangeRate[]
  bestRates: {
    buyUSD: number
    sellUSD: number
    buyEUR: number
    sellEUR: number
  }
}

export default function ExchangeRateCard({ bankRates, bestRates }: ExchangeRateCardProps) {
  // We assume all rates in bankRates are from the same bank
  const bank = bankRates[0].bank
  const bankLogo = bankRates[0].bankLogo
  const bankUrl = bankRates[0].bankUrl

  // Find USD and EUR rates
  const usdRate = bankRates.find((rate) => rate.currency === "USD")
  const eurRate = bankRates.find((rate) => rate.currency === "EUR")

  if (!usdRate || !eurRate) return null

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-green-50 p-4">
        <Link
          href={bankUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 hover:text-green-700 transition-colors"
        >
          <div className="relative h-12 w-12 overflow-hidden rounded-md border bg-white">
            <Image
              src={bankLogo || "/placeholder.svg"}
              alt={`${bank} logo`}
              width={48}
              height={48}
              className="object-contain"
            />
          </div>
          <div className="flex items-center gap-1 font-semibold text-lg">
            {bank}
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
                  <span className="font-semibold">{usdRate.buyRate.toFixed(2)}</span>
                  {usdRate.buyRate === bestRates.buyUSD && (
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      Best
                    </Badge>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Sell Rate:</span>
                <div className="flex items-center gap-1">
                  <span className="font-semibold">{usdRate.sellRate.toFixed(2)}</span>
                  {usdRate.sellRate === bestRates.sellUSD && (
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
                  <span className="font-semibold">{eurRate.buyRate.toFixed(2)}</span>
                  {eurRate.buyRate === bestRates.buyEUR && (
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      Best
                    </Badge>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Sell Rate:</span>
                <div className="flex items-center gap-1">
                  <span className="font-semibold">{eurRate.sellRate.toFixed(2)}</span>
                  {eurRate.sellRate === bestRates.sellEUR && (
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
