import { BankName } from "./definitions";

export type BankPageContent = {
  name: BankName;
  slug: string;
  summary: string;
  website: string;
  headquarters: string;
  founded: string;
  highlights: string[];
  services: string[];
};

export const bankPages: BankPageContent[] = [
  {
    name: "Finabank",
    slug: "finabank",
    summary:
      "Finabank NV is a Surinamese commercial bank known for personal and business services with a focus on digital banking.",
    website: "https://www.finabanknv.com",
    headquarters: "Paramaribo, Suriname",
    founded: "1991",
    highlights: [
      "Retail and corporate banking products",
      "Online banking with 24/7 access",
      "Strong USD and EUR liquidity",
    ],
    services: [
      "Current and savings accounts",
      "Consumer lending",
      "Foreign exchange desk",
    ],
  },
  {
    name: "Central Bank",
    slug: "central-bank",
    summary:
      "The Central Bank of Suriname (CBvS) publishes the official exchange reference rate used by many institutions.",
    website: "https://www.cbvs.sr",
    headquarters: "Paramaribo, Suriname",
    founded: "1957",
    highlights: [
      "Monetary authority for Suriname",
      "Sets reserve and policy requirements",
      "Publishes daily reference rates",
    ],
    services: [
      "Reference exchange rates",
      "Monetary policy guidance",
      "Financial stability reports",
    ],
  },
  {
    name: "Central Money Exchange",
    slug: "central-money-exchange",
    summary:
      "Central Money Exchange (CME) operates as a licensed foreign-exchange bureau serving retail and institutional customers.",
    website: "https://www.cme.sr",
    headquarters: "Paramaribo, Suriname",
    founded: "2000",
    highlights: [
      "Walk-in forex counters",
      "Daily buy and sell spreads",
      "Transparent rate publication",
    ],
    services: ["Cash exchange", "International remittances", "Wholesale forex"],
  },
  {
    name: "Hakrinbank",
    slug: "hakrinbank",
    summary:
      "Hakrinbank offers retail, commercial, and investment services with a strong presence across Suriname.",
    website: "https://www.hakrinbank.com",
    headquarters: "Paramaribo, Suriname",
    founded: "1936",
    highlights: [
      "Corporate banking expertise",
      "Trade finance solutions",
      "Foreign exchange for importers",
    ],
    services: ["SME financing", "Trade services", "Online banking"],
  },
  {
    name: "De Surinaamsche Bank (DSB)",
    slug: "dsb",
    summary:
      "Founded in 1865, DSB is one of Suriname's oldest commercial banks with a broad branch network.",
    website: "https://www.dsb.sr",
    headquarters: "Paramaribo, Suriname",
    founded: "1865",
    highlights: [
      "Heritage brand trusted by households",
      "Digital onboarding and bill payment",
      "Extensive ATM coverage",
    ],
    services: [
      "Personal banking",
      "Business solutions",
      "Foreign exchange desk",
    ],
  },
  {
    name: "Republic Bank",
    slug: "republic-bank",
    summary:
      "Republic Bank (Suriname) Limited is part of Republic Financial Holdings and focuses on cross-border services.",
    website: "https://www.republicbanksr.com",
    headquarters: "Port of Spain, Trinidad and Tobago",
    founded: "1837",
    highlights: [
      "Regional banking network",
      "Corporate and investment services",
      "Cash management solutions",
    ],
    services: [
      "Commercial banking",
      "Cash management",
      "Foreign currency exchange",
    ],
  },
];

export const findBankPageBySlug = (slug: string) =>
  bankPages.find((bank) => bank.slug === slug);

export const bankSlugs = () => bankPages.map((bank) => bank.slug);
