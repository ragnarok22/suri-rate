export type BankName =
  | "Finabank"
  | "Central Bank"
  | "Central Money Exchange"
  | "Hakrinbank"
  | "De Surinaamsche Bank (DSB)";

export type Currency = "USD" | "EUR";

export type BankInfo = {
  name: BankName;
  logo: string;
  link: string;
};

export type BankRates = BankInfo & {
  rates: ExchangeRate[];
};

export interface ExchangeRate {
  currency: Currency;
  buy: string;
  sell: string;
}
