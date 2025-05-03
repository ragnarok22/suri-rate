import {
  BankName,
  ExchangeRate,
  BankInfo,
  BankRates,
} from "@/utils/definitions";
import {
  getCBVSExchangeRates,
  getCMEExchangeRates,
  getDsbExchangeRates,
  getFinabankExchangeRates,
  getHakrinbankExchangeRates,
  getRepublicBankExchangeRates,
} from "./providers";

const retrieveRates = async (bank_name: BankName): Promise<ExchangeRate[]> => {
  switch (bank_name) {
    case "Finabank":
      return await getFinabankExchangeRates();
    case "Central Bank":
      return await getCBVSExchangeRates();
    case "Central Money Exchange":
      return await getCMEExchangeRates();
    case "Hakrinbank":
      return await getHakrinbankExchangeRates();
    case "De Surinaamsche Bank (DSB)":
      return await getDsbExchangeRates();
    case "Republic Bank":
      return await getRepublicBankExchangeRates();
    default:
      throw new Error(`Bank ${bank_name} not found`);
  }
};

export const getCurrentRates = async (): Promise<BankRates[]> => {
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
    {
      name: "Hakrinbank",
      logo: "/logos/hakrinbank.jpg",
      link: "https://www.hakrinbank.com",
    },
    {
      name: "De Surinaamsche Bank (DSB)",
      logo: "/logos/dsb.png",
      link: "https://www.dsb.sr",
    },
    {
      name: "Republic Bank",
      logo: "/logos/republic-bank.jpg",
      link: "https://www.republicbanksr.com",
    },
  ];

  const bankRates: BankRates[] = [];
  for (const bankInfo of bankInfos) {
    try {
      const rates = await retrieveRates(bankInfo.name);
      bankRates.push({ ...bankInfo, rates });
    } catch (e) {
      console.error(e);
      bankRates.push({
        ...bankInfo,
        rates: [
          { currency: "USD", buy: "0.00", sell: "0.00" },
          { currency: "EUR", buy: "0.00", sell: "0.00" },
        ],
      });
    }
  }

  return bankRates;
};
