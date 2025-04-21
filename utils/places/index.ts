import { BankName, ExchangeRate, BankInfo, BankRates } from "@/utils/definitions";
import { getFinabankExchangeRates } from "./providers";

const retrieveRates = async (bank_name: BankName): Promise<ExchangeRate[]> => {
  switch (bank_name) {
    case 'Finabank':
      return await getFinabankExchangeRates();
    default:
      throw new Error(`Bank ${bank_name} not found`);
  }
}


export const getCurrentRates = async (): Promise<BankRates[]> => {
  const bankInfos: BankInfo[] = [{
    name: 'Finabank',
    logo: 'https://finabanknv.com/ysimg/finabank_logo.png',
    link: 'https://finabanknv.com/service-desk/koersen-rates/',
  }];

  const bankRates: BankRates[] = [];
  for (const bankInfo of bankInfos) {
    const rates = await retrieveRates(bankInfo.name);
    bankRates.push({ ...bankInfo, rates });
  }

  return bankRates;
}
