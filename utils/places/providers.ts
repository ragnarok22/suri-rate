import * as cheerio from "cheerio";
import axios from "axios";
import { unstable_cache } from "next/cache";
import { ExchangeRate } from "@/utils/definitions";
import { api } from "@/utils";

export async function getFinabankExchangeRates(): Promise<ExchangeRate[]> {
  const url = "https://www.finabanknv.com/service-desk/koersen-rates/";
  try {
    const response = await api(url);
    const $ = cheerio.load(response.html);

    const rates: ExchangeRate[] = [];

    const text = $("body").text();

    const usdMatch = text.match(/USD GIRAAL\s+([\d.,]+)\s+([\d.,]+)/);
    const eurMatch = text.match(/EUR GIRAAL\s+([\d.,]+)\s+([\d.,]+)/);

    if (usdMatch) {
      rates.push({
        currency: "USD",
        buy: parseFloat(usdMatch[1].replace(",", ".")).toFixed(2),
        sell: parseFloat(usdMatch[2].replace(",", ".")).toFixed(2),
      });
    }

    if (eurMatch) {
      rates.push({
        currency: "EUR",
        buy: parseFloat(eurMatch[1].replace(",", ".")).toFixed(2),
        sell: parseFloat(eurMatch[2].replace(",", ".")).toFixed(2),
      });
    }

    return rates;
  } catch (e: any) {
    console.error("Error getting Finabank info:", e.message);
    throw e;
  }
}

export async function getDsbExchangeRates(): Promise<ExchangeRate[]> {
  const url = "https://service.dsbtools.com/exchange/rates";
  try {
    const response = await api(url);
    const data = await JSON.parse(response.html);

    const item = data?.valuta;

    if (!item) throw new Error("No exchange rate data received from DSB");

    return [
      {
        currency: "USD",
        buy: item.USD.buy,
        sell: item.USD.sell,
      },
      {
        currency: "EUR",
        buy: item.EUR.buy,
        sell: item.EUR.sell,
      },
    ];
  } catch (e: any) {
    console.error("Error getting DSB info:", e.message);
    throw e;
  }
}

export async function getCBVSExchangeRates(): Promise<ExchangeRate[]> {
  const url = "https://www.cbvs.sr";
  try {
    const response = await api(url);
    const data = response.html;
    const $ = cheerio.load(data);

    const rates: ExchangeRate[] = [];

    $(".rate-info table")
      .find("tr")
      .each((_, row) => {
        const cells = $(row)
          .find("td")
          .map((_, td) => $(td).text().trim())
          .get();

        if (cells.length === 3 && (cells[0] === "USD" || cells[0] === "EUR")) {
          rates.push({
            currency: cells[0],
            buy: parseFloat(cells[1].replace(",", ".")).toFixed(2),
            sell: parseFloat(cells[2].replace(",", ".")).toFixed(2),
          });
        }
      });

    return rates;
  } catch (e: any) {
    console.error("Error getting CBVS info:", e.message);
    return [
      {
        currency: "USD",
        buy: "0.00",
        sell: "0.00",
      },
      {
        currency: "EUR",
        buy: "0.00",
        sell: "0.00",
      },
    ];
    // throw e;
  }
}

// Internal function that does the actual CME scraping
async function fetchCMEExchangeRates(): Promise<ExchangeRate[]> {
  const url =
    "https://www.cme.sr/Home/GetTodaysExchangeRates/?BusinessDate=2016-07-25";

  try {
    // Make direct POST request with comprehensive browser headers to bypass Cloudflare
    const response = await axios.post(
      url,
      {},
      {
        headers: {
          Accept: "application/json, text/javascript, */*; q=0.01",
          "Accept-Encoding": "gzip, deflate, br",
          "Accept-Language": "en-US,en;q=0.9",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
          "Content-Type": "application/json;charset=UTF-8",
          Host: "www.cme.sr",
          Origin: "https://www.cme.sr",
          Pragma: "no-cache",
          Referer: "https://www.cme.sr/",
          "Sec-Ch-Ua":
            '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
          "Sec-Ch-Ua-Mobile": "?0",
          "Sec-Ch-Ua-Platform": '"Windows"',
          "Sec-Fetch-Dest": "empty",
          "Sec-Fetch-Mode": "cors",
          "Sec-Fetch-Site": "same-origin",
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
          "X-Requested-With": "XMLHttpRequest",
        },
        timeout: 30000,
        validateStatus: () => true, // Don't throw on any status code
      },
    );

    console.log("CME API response status:", response.status);

    if (response.status !== 200) {
      console.error("CME error details:", {
        status: response.status,
        statusText: response.statusText,
        data:
          typeof response.data === "string"
            ? response.data.substring(0, 500)
            : response.data,
      });
      throw new Error(
        `CME API returned status ${response.status}: ${response.statusText}`,
      );
    }

    const responseData =
      typeof response.data === "string" ? response.data.trim() : response.data;

    // Check if response is valid JSON
    if (typeof responseData === "string") {
      if (!responseData.startsWith("{") && !responseData.startsWith("[")) {
        console.error("CME response details:", {
          status: response.status,
          responseLength: responseData.length,
          responsePreview: responseData.substring(0, 500),
        });
        throw new Error(
          `Unexpected CME response payload. Response preview: ${responseData.substring(0, 200)}`,
        );
      }
    }

    const data =
      typeof responseData === "string"
        ? JSON.parse(responseData)
        : responseData;
    const item = data?.[0];

    if (!item) throw new Error("No exchange rate data received from CME");

    return [
      {
        currency: "USD",
        buy: item.BuyUsdExchangeRate.toFixed(2),
        sell: item.SaleUsdExchangeRate.toFixed(2),
      },
      {
        currency: "EUR",
        buy: item.BuyEuroExchangeRate.toFixed(2),
        sell: item.SaleEuroExchangeRate.toFixed(2),
      },
    ];
  } catch (e: any) {
    console.error("Error getting CME info:", e.message);
    if (e.response) {
      console.error("CME error response data:", e.response.data);
      console.error("CME error response status:", e.response.status);
      console.error("CME error response headers:", e.response.headers);
    }
    throw e;
  }
}

// Export cached version with 12-hour revalidation
export const getCMEExchangeRates = unstable_cache(
  fetchCMEExchangeRates,
  ["cme-exchange-rates"],
  {
    revalidate: 43200, // 12 hours in seconds
    tags: ["cme-rates"],
  },
);

export async function getHakrinbankExchangeRates(): Promise<ExchangeRate[]> {
  const url = "https://www.hakrinbank.com/en/private/foreign-exchange/";
  try {
    const { html } = await api(url);
    const $ = cheerio.load(html);

    let usdBuy = "";
    let usdSell = "";
    let eurBuy = "";
    let eurSell = "";

    $("table").each((_, table) => {
      const headers = $(table)
        .find("thead tr th")
        .map((_, th) => $(th).text().trim().toLowerCase())
        .get();
      if (
        headers.includes("foreign exchange") &&
        headers.includes("purchase") &&
        headers.includes("sale")
      ) {
        $(table)
          .find("tbody tr")
          .each((_, row) => {
            const cells = $(row)
              .find("td")
              .map((_, td) => $(td).text().trim())
              .get();
            const currency = cells[0]?.toUpperCase();
            const buy = cells[1];
            const sell = cells[2];

            if (currency === "USD") {
              usdBuy = parseFloat(buy).toFixed(2);
              usdSell = parseFloat(sell).toFixed(2);
            } else if (currency === "EURO" || currency === "EUR") {
              eurBuy = parseFloat(buy).toFixed(2);
              eurSell = parseFloat(sell).toFixed(2);
            }
          });
      }
    });

    if (!usdBuy || !usdSell || !eurBuy || !eurSell) {
      throw new Error("No exchange rate data found on Hakrinbank page");
    }

    return [
      { currency: "USD", buy: usdBuy, sell: usdSell },
      { currency: "EUR", buy: eurBuy, sell: eurSell },
    ];
  } catch (e: any) {
    console.error("Error getting Hakrinbank info:", e.message);
    throw e;
  }
}

export async function getRepublicBankExchangeRates(): Promise<ExchangeRate[]> {
  const url = "https://www.republicbanksr.com";

  try {
    const { html } = await api(url);
    const $ = cheerio.load(html);

    let usdBuy = "";
    let usdSell = "";
    let eurBuy = "";
    let eurSell = "";

    $("table").each((_, table) => {
      const headers = $(table)
        .find("thead tr th")
        .map((_, th) => $(th).text().trim().toLowerCase())
        .get();

      // Look for relevant table
      if (
        headers.includes("abbr.") &&
        headers.includes("buy (cash)") &&
        headers.includes("sell")
      ) {
        $(table)
          .find("tbody tr")
          .each((_, row) => {
            const cells = $(row)
              .find("td")
              .map((_, td) => $(td).text().trim())
              .get();

            const currency = cells[0]?.toUpperCase();
            const buy = cells[1]; // Buy (Cash)
            const sell = cells[3]; // Sell (column index 3 in the table)

            if (currency === "USD") {
              usdBuy = parseFloat(buy).toFixed(2);
              usdSell = parseFloat(sell).toFixed(2);
            } else if (currency === "EURO" || currency === "EUR") {
              eurBuy = parseFloat(buy).toFixed(2);
              eurSell = parseFloat(sell).toFixed(2);
            }
          });
      }
    });

    if (!usdBuy || !usdSell || !eurBuy || !eurSell) {
      throw new Error("No exchange rate data found on Republic Bank page");
    }

    return [
      { currency: "USD", buy: usdBuy, sell: usdSell },
      { currency: "EUR", buy: eurBuy, sell: eurSell },
    ];
  } catch (e: any) {
    console.error("Error getting Republic Bank exchange rates:", e.message);
    throw e;
  }
}
