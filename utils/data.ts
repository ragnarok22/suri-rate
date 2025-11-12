import { cache } from "react";
import { BankRates } from "./definitions";
import { getCurrentRates } from "./places";

const REVALIDATE_SECONDS = 60 * 60 * 12; // 12 hours

const fetchRates = cache(async () => {
  try {
    const rates = await getCurrentRates();
    const updatedAt = new Date().toISOString();

    return {
      rates,
      updatedAt,
    } satisfies { rates: BankRates[]; updatedAt: string };
  } catch (error) {
    console.error("Failed to load exchange rates:", error);
    return null;
  }
});

export async function getRates(): Promise<{
  rates: BankRates[];
  updatedAt: string;
} | null> {
  return fetchRates();
}
