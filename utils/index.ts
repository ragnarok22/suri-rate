import { BankRates } from "./definitions";

/**
 * Reads all data from a ReadableStream<Uint8Array> and returns it as a string.
 * @param stream - The ReadableStream to read from.
 * @returns A Promise that resolves to the concatenated string content of the stream.
 */
const readStream = async (
  stream: ReadableStream<Uint8Array>,
): Promise<string> => {
  let html = "";
  if (stream && typeof stream.getReader === "function") {
    // Read from ReadableStream<Uint8Array>
    const reader = stream.getReader();
    const chunks: Uint8Array[] = [];
    let done = false;
    while (!done) {
      const { value, done: streamDone } = await reader.read();
      if (value) chunks.push(value);
      done = streamDone;
    }
    html = Buffer.concat(chunks).toString();
  } else {
    html = "";
  }

  return html;
};

/**
 * Fetches data from the specified URL.
 * Caching is now handled at the function level via 'use cache' in utils/data.ts.
 * @param url - The API endpoint to fetch data from.
 * @returns The fetch API response.
 */
export const api = async (
  url: string | URL,
  init?: RequestInit,
): Promise<{ html: string } & Response> => {
  const response = await fetch(url, init);

  let html = "";
  if (response.body) {
    html = await readStream(response.body);
  }

  return {
    html,
    ...response,
  };
};

export const cn = (...inputs: string[]) => {
  return inputs.filter(Boolean).join(" ");
};

// Helper function to find best rates
export function findBestRates(allRates: BankRates[]): {
  bestBuyUSD: string;
  bestSellUSD: string;
  bestBuyEUR: string;
  bestSellEUR: string;
} {
  let bestBuyUSD = "0";
  let bestSellUSD = "999999";
  let bestBuyEUR = "0";
  let bestSellEUR = "999999";

  allRates.forEach(({ rates }) => {
    rates.forEach((rate) => {
      const buy = Number.parseFloat(rate.buy);
      const sell = Number.parseFloat(rate.sell);

      if (rate.currency === "USD") {
        if (buy > 0 && buy > Number.parseFloat(bestBuyUSD))
          bestBuyUSD = rate.buy;
        if (sell > 0 && sell < Number.parseFloat(bestSellUSD))
          bestSellUSD = rate.sell;
      } else if (rate.currency === "EUR") {
        if (buy > 0 && buy > Number.parseFloat(bestBuyEUR))
          bestBuyEUR = rate.buy;
        if (sell > 0 && sell < Number.parseFloat(bestSellEUR))
          bestSellEUR = rate.sell;
      }
    });
  });

  if (bestSellUSD === "999999") bestSellUSD = "0";
  if (bestSellEUR === "999999") bestSellEUR = "0";

  return { bestBuyUSD, bestSellUSD, bestBuyEUR, bestSellEUR };
}
