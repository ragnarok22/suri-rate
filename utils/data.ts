import { BankRates } from "./definitions";
import { getCurrentRates } from "./places";

export async function getRates(): Promise<{
  rates: BankRates[];
} | null> {
  const rates = await getCurrentRates();

  return {
    rates,
  };
}
