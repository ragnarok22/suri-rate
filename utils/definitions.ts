export type BankName = 'Finabank' | 'Central Bank'

export type Currency = 'USD' | 'EUR'

export type Place = {
  name: BankName;
  logo: string;
  link: string;
  getRates: () => Promise<ExchangeRate[]>
}

export interface ExchangeRate {
  currency: Currency;
  buy: string;
  sell: string;
}
