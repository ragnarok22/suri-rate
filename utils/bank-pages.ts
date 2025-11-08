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
      "Finabank NV is a leading Surinamese commercial bank established in 1991, offering personal and business banking services with competitive USD and EUR exchange rates and 24/7 digital banking access.",
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
      "The Central Bank of Suriname (CBvS), established in 1957, is the monetary authority that publishes official USD and EUR reference exchange rates used by financial institutions across Suriname.",
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
      "Central Money Exchange (CME), founded in 2000, is a licensed foreign-exchange bureau in Paramaribo offering competitive USD and EUR rates for retail walk-in customers and institutional wholesale forex.",
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
      "Hakrinbank, established in 1936, is a trusted Surinamese financial institution offering retail, commercial, and investment banking services with competitive foreign exchange rates for importers and businesses.",
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
      "De Surinaamsche Bank (DSB), founded in 1865, is Suriname's oldest and most trusted commercial bank offering USD and EUR exchange services with extensive ATM coverage and digital banking solutions.",
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
      "Republic Bank (Suriname) Limited, part of Republic Financial Holdings founded in 1837, specializes in commercial banking, foreign currency exchange, and cross-border cash management for regional businesses.",
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
