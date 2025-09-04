import { BankRates } from "./definitions";
import { getCurrentRates } from "./places";

export async function getRates(): Promise<{
  rates: BankRates[];
  updatedAt: string;
} | null> {
  const rates = await getCurrentRates();
  const updatedAt = new Date().toISOString();

  return {
    rates,
    updatedAt,
  };
}
