import { BankName, ExchangeRate, BankInfo, BankRates } from "@/utils/definitions";
import { getCBVSExchangeRates, getFinabankExchangeRates } from "./providers";

const retrieveRates = async (bank_name: BankName): Promise<ExchangeRate[]> => {
  switch (bank_name) {
    case 'Finabank':
      return await getFinabankExchangeRates();
    case 'Central Bank':
      return await getCBVSExchangeRates();
    default:
      throw new Error(`Bank ${bank_name} not found`);
  }
}


export const getCurrentRates = async (): Promise<BankRates[]> => {
  const bankInfos: BankInfo[] = [{
    name: 'Finabank',
    logo: '/logos/finabank.jpg',
    link: 'https://finabanknv.com/service-desk/koersen-rates/',
  }, {
    name: 'Central Bank',
    logo: '/logos/central-bank.jpg',
    link: 'https://www.cbvs.sr'
  }];

  const bankRates: BankRates[] = [];
  for (const bankInfo of bankInfos) {
    const rates = await retrieveRates(bankInfo.name);
    bankRates.push({ ...bankInfo, rates });
  }

  console.log({ bankRates })

  return bankRates;
}
