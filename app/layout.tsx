import type { Metadata, Viewport } from "next";
import { getRates } from "@/utils/data";
import { bankPages } from "@/utils/bank-pages";
import { ThemeProvider, PostHogProvider } from "./providers";
import "./globals.css";
import GitHubLink from "@/components/github";
import OfflineBanner from "@/components/offline-banner";
import PwaPrompts from "@/components/pwa-prompts";

const inter = { className: "" };

const siteUrl = "https://suri-rate.ragnarok22.dev";

export async function generateMetadata(): Promise<Metadata> {
  const data = await getRates();
  const bankNames =
    data?.rates.map((bank) => bank.name) ?? bankPages.map((b) => b.name);
  const keywordSet = new Set<string>([
    "Suriname exchange rate",
    "Suriname exchange rates",
    "SuriRate",
    "USD to SRD",
    "EUR to SRD",
    "Suriname dollar exchange rate",
    "Suriname banks",
    "compare exchange rates",
    "Paramaribo exchange rate",
    "Suriname currency rate",
    "best exchange rate Suriname",
    "Suriname dollar rate today",
    "USD to SRD today",
    "EUR to SRD today",
    "exchange rate Suriname today",
    "Suriname bank rates",
    "SRD exchange rate",
    "Surinamese dollar",
    ...bankNames,
    ...bankNames.map((name) => `${name} exchange rate`),
    ...bankNames.map((name) => `${name} Suriname`),
  ]);

  const googleVerification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION;
  const bingVerification = process.env.NEXT_PUBLIC_BING_WEBMASTER_VERIFICATION;

  const verification: Metadata["verification"] = {};
  if (googleVerification) verification.google = googleVerification;
  if (bingVerification)
    verification.other = { "msvalidate.01": bingVerification };

  const verificationField =
    Object.keys(verification).length > 0 ? verification : undefined;

  return {
    title:
      "SuriRate – Suriname Exchange Rate Comparison | USD & EUR to SRD Today",
    description:
      "Compare today's USD and EUR to SRD exchange rates from 6 major banks in Suriname (Paramaribo): Finabank, Central Bank, CME, Hakrinbank, DSB, and Republic Bank. Find the best Suriname dollar rates updated every 12 hours.",
    manifest: "/manifest.json",
    metadataBase: new URL(siteUrl),
    alternates: { canonical: "/" },
    keywords: Array.from(keywordSet),
    category: "finance",
    authors: [
      { name: "Reinier Hernández", url: "https://reinierhernandez.com" },
    ],
    creator: "Reinier Hernández",
    publisher: "SuriRate",
    openGraph: {
      title:
        "SuriRate – Suriname Exchange Rate Comparison | USD & EUR to SRD Today",
      description:
        "Find the best USD to SRD and EUR to SRD exchange rates in Suriname today. SuriRate compares real-time rates from 6 major banks in Paramaribo including Finabank, Central Bank, and CME.",
      url: siteUrl,
      siteName: "SuriRate",
      images: [
        {
          url: "/opengraph-image.png",
          width: 1200,
          height: 630,
          alt: "SuriRate - Compare Suriname exchange rates from major banks",
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title:
        "SuriRate – Suriname Exchange Rate Comparison | USD & EUR to SRD Today",
      description:
        "Get the most accurate USD and EUR exchange rates in Suriname. Compare rates from 6 major banks in Paramaribo and find the best deal today.",
      images: ["/twitter-image.jpg"],
      creator: "@ragnarokreinier",
    },
    appleWebApp: {
      capable: true,
      title: "SuriRate",
      statusBarStyle: "default",
    },
    verification: verificationField,
  };
}

export const viewport: Viewport = {
  themeColor: "#f8fafc",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider>
          <OfflineBanner />
          <PwaPrompts />
          <GitHubLink />
          <PostHogProvider>{children}</PostHogProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
