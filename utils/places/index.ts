import { BankName, ExchangeRate, Place } from "@/utils/definitions";
import { getFinabankExchangeRates } from "./providers";

const retrieveRates = async (bank_name: BankName): Promise<ExchangeRate[]> => {
  switch (bank_name) {
    case 'Finabank':
      return await getFinabankExchangeRates();
    default:
      throw new Error(`Bank ${bank_name} not found`);
  }
}

export const places: Place[] = [{
  name: 'Finabank',
  logo: 'https://finabanknv.com/ysimg/finabank_logo.png',
  link: 'https://finabanknv.com/service-desk/koersen-rates/',
  getRates: () => retrieveRates('Finabank')
}];

export const getCurrentRates = async (): Promise<Place[]> => {
  return places;
}
