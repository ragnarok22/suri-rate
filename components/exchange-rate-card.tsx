"use client";

import Image from "next/image";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { BankRates } from "@/utils/definitions";
import { buildBankUTMUrl } from "@/utils/utm";
import { usePostHog } from "posthog-js/react";

interface ExchangeRateCardProps {
  bankRates: BankRates;
  bestRates: {
    bestBuyUSD: string;
    bestSellUSD: string;
    bestBuyEUR: string;
    bestSellEUR: string;
  };
}

export default function ExchangeRateCard({
  bankRates,
  bestRates,
}: ExchangeRateCardProps) {
  const { name, logo, link, rates } = bankRates;
  const posthog = usePostHog();

  // Find USD and EUR rates
  const usdRate = rates.find((rate) => rate.currency === "USD");
  const eurRate = rates.find((rate) => rate.currency === "EUR");

  if (!usdRate || !eurRate) return null;

  // Build URL with UTM parameters
  const utmUrl = buildBankUTMUrl(link, name, "all", "en");

  // Handle outbound click tracking
  const handleOutboundClick = () => {
    posthog.capture("outbound_click", {
      bank: name,
      url: link,
      utm_url: utmUrl,
      currency: "all",
      lang: "en",
    });
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-green-50 dark:bg-green-950 p-4">
        <Link
          href={utmUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleOutboundClick}
          className="flex items-center gap-3 hover:text-green-700 dark:hover:text-green-300 transition-colors duration-200"
        >
          <div className="relative h-12 w-12 overflow-hidden rounded-md border dark:border-gray-600 bg-white dark:bg-gray-700 shrink-0">
            <Image
              src={logo || "/placeholder.svg"}
              alt={`${name} logo`}
              width={48}
              height={48}
              className="object-contain"
            />
          </div>
          <div className="flex items-center gap-1 text-gray-800 dark:text-gray-100 font-semibold text-lg">
            {name}
            <ExternalLink className="h-4 w-4 text-gray-400 dark:text-gray-500" />
          </div>
        </Link>
      </CardHeader>
      <CardContent className="text-gray-800 dark:text-gray-100">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                USD
              </span>
              <span className="text-xs text-gray-400 dark:text-gray-500">
                US Dollar
              </span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Buy Rate:</span>
                <div className="flex items-center gap-1">
                  {usdRate.buy === bestRates.bestBuyUSD && (
                    <Badge
                      variant="outline"
                      className="bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800"
                    >
                      Best
                    </Badge>
                  )}
                  <span className="font-semibold">{usdRate.buy}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Sell Rate:</span>
                <div className="flex items-center gap-1">
                  {usdRate.sell === bestRates.bestSellUSD && (
                    <Badge
                      variant="outline"
                      className="bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800"
                    >
                      Best
                    </Badge>
                  )}
                  <span className="font-semibold">{usdRate.sell}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                EUR
              </span>
              <span className="text-xs text-gray-400 dark:text-gray-500">
                Euro
              </span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Buy Rate:</span>
                <div className="flex items-center gap-1">
                  {eurRate.buy === bestRates.bestBuyEUR && (
                    <Badge
                      variant="outline"
                      className="bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800"
                    >
                      Best
                    </Badge>
                  )}
                  <span className="font-semibold">{eurRate.buy}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Sell Rate:</span>
                <div className="flex items-center gap-1">
                  {eurRate.sell === bestRates.bestSellEUR && (
                    <Badge
                      variant="outline"
                      className="bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800"
                    >
                      Best
                    </Badge>
                  )}
                  <span className="font-semibold">{eurRate.sell}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
