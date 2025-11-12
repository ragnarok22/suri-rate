import { cacheLife } from "next/cache";
import { BankRates } from "./definitions";
import { getCurrentRates } from "./places";

export async function getRates(): Promise<{
  rates: BankRates[];
  updatedAt: string;
} | null> {
  "use cache";
  cacheLife("exchangeRates");

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
}
