import { BankRates } from "./definitions";
import { getRedisClient } from "./redis";

const KEY = "bank-rates";
const EXPIRATION = 60 * 60 * 12; // 12h

export async function saveRates(rates: BankRates[]): Promise<undefined> {
  const client = await getRedisClient();
  const data = {
    updatedAt: new Date().toISOString(),
    rates,
  };
  await client.set(KEY, JSON.stringify(data), { EX: EXPIRATION });
}

export async function getRates(): Promise<{
  updatedAt: string;
  rates: BankRates[];
} | null> {
  const client = await getRedisClient();
  const raw = await client.get(KEY);
  return raw ? JSON.parse(raw) : null;
}
