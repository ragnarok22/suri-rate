import { unstable_cache } from "next/cache";
import { BankRates } from "./definitions";
import { getCurrentRates } from "./places";

const REVALIDATE_SECONDS = 60 * 60 * 12; // 12 hours

const fetchRates = unstable_cache(
  async () => {
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
  },
  ["suri-rate-exchange"],
  {
    revalidate: REVALIDATE_SECONDS,
    tags: ["exchange-rates"],
  },
);

export async function getRates(): Promise<{
  rates: BankRates[];
  updatedAt: string;
} | null> {
  return fetchRates();
}
