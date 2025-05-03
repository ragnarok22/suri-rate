import { ExchangeRate } from "./definitions";
import { getRedisClient } from "./redis";

const KEY = "bank-rates";
const EXPIRATION = 60 * 60 * 12; // 12h

export async function saveRates(rates: ExchangeRate[]): Promise<undefined> {
  const client = await getRedisClient();
  await client.set(KEY, JSON.stringify(rates), { EX: EXPIRATION });
}

export async function getRates(): Promise<ExchangeRate[] | null> {
  const client = await getRedisClient();
  const raw = await client.get(KEY);
  return raw ? JSON.parse(raw) : null;
}
