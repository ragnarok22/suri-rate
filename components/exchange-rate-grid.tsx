"use client";

import type { BankRates } from "@/utils/definitions";
import ExchangeRateCard from "./exchange-rate-card";
import { getCurrentRates } from "@/utils/places";
import { findBestRates } from "@/utils";
import { useEffect, useState } from "react";

export default function ExchangeRateGrid() {
  const [bankRates, setBankRates] = useState<BankRates[]>([]);

  useEffect(() => {
    getCurrentRates().then((info) => setBankRates(info));
  }, []);

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
