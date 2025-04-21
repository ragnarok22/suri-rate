import {
  BankName,
  ExchangeRate,
  BankInfo,
  BankRates,
} from "@/utils/definitions";
import {
  getCBVSExchangeRates,
  getCMEExchangeRates,
  getFinabankExchangeRates,
} from "./providers";

let cachedRates: BankRates[] | null = null;
let lastFetchTime: number | null = null;
const CACHE_DURATION = 1000 * 60 * 60 * 6; // 6 hours

export const getLastFetchTime = (): number | null => lastFetchTime;

const retrieveRates = async (bank_name: BankName): Promise<ExchangeRate[]> => {
  switch (bank_name) {
    case "Finabank":
      return await getFinabankExchangeRates();
    case "Central Bank":
      return await getCBVSExchangeRates();
    case "Central Money Exchange":
      return await getCMEExchangeRates();
    default:
      throw new Error(`Bank ${bank_name} not found`);
  }
};

export const getCurrentRates = async (): Promise<BankRates[]> => {
  const now = Date.now();

  if (cachedRates && lastFetchTime && now - lastFetchTime < CACHE_DURATION) {
    return cachedRates;
  }

  const bankInfos: BankInfo[] = [
    {
      name: "Finabank",
      logo: "/logos/finabank.jpg",
      link: "https://finabanknv.com/service-desk/koersen-rates/",
    },
    {
      name: "Central Bank",
      logo: "/logos/central-bank.jpg",
      link: "https://www.cbvs.sr",
    },
    {
      name: "Central Money Exchange",
      logo: "/logos/central-exchange.png",
      link: "https://www.cme.sr",
    },
  ];

  const bankRates: BankRates[] = [];
  for (const bankInfo of bankInfos) {
    const rates = await retrieveRates(bankInfo.name);
    bankRates.push({ ...bankInfo, rates });
  }

  cachedRates = bankRates;
  lastFetchTime = now;

  return bankRates;
};
