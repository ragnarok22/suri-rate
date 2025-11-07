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
    "Suriname exchange rates",
    "SuriRate",
    "USD to SRD",
    "EUR to SRD",
    "Suriname banks",
    "compare exchange rates",
    ...bankNames,
    ...bankNames.map((name) => `${name} exchange rate`),
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
    title: "SuriRate – Compare Suriname's Exchange Rates in One Place",
    description:
      "SuriRate helps you find the best exchange rates in Suriname by comparing USD and EUR rates from Finabank, Central Bank, and CME – all in one place, updated daily.",
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
      title: "SuriRate – Compare Suriname's Exchange Rates in One Place",
      description:
        "Find the best USD and EUR exchange rates in Suriname. SuriRate compares daily rates from Finabank, Central Bank, and CME.",
      url: siteUrl,
      siteName: "SuriRate",
      images: [
        {
          url: "/opengraph-image.png",
          width: 1200,
          height: 630,
          alt: "SuriRate exchange rates overview",
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "SuriRate – Compare Suriname's Exchange Rates in One Place",
      description:
        "Get the most accurate and updated exchange rates from Suriname’s major banks. Compare USD and EUR with ease.",
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
