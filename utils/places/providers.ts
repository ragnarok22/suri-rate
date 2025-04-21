import axios from 'axios';
import * as cheerio from 'cheerio';
import { ExchangeRate } from '@/utils/definitions';

export async function getFinabankExchangeRates(): Promise<ExchangeRate[]> {
  const url = 'https://www.finabanknv.com/service-desk/koersen-rates/';
  const { data } = await axios.get(url);
  const $ = cheerio.load(data);

  const rates: ExchangeRate[] = [];

  const text = $('body').text();

  const usdMatch = text.match(/USD GIRAAL\s+([\d.,]+)\s+([\d.,]+)/);
  const eurMatch = text.match(/EUR GIRAAL\s+([\d.,]+)\s+([\d.,]+)/);

  if (usdMatch) {
    rates.push({
      currency: 'USD',
      buy: usdMatch[1].replace(',', '.'),
      sell: usdMatch[2].replace(',', '.'),
    });
  }

  if (eurMatch) {
    rates.push({
      currency: 'EUR',
      buy: eurMatch[1].replace(',', '.'),
      sell: eurMatch[2].replace(',', '.'),
    });
  }

  return rates;
}
