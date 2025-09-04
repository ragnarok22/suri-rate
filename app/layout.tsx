import type { Metadata, Viewport } from "next";
import { PostHogProvider } from "./providers";
import "./globals.css";
import GitHubLink from "@/components/github";
import OfflineBanner from "@/components/offline-banner";
import PwaPrompts from "@/components/pwa-prompts";

const inter = { className: "" };

export const metadata: Metadata = {
  title: "SuriRate – Compare Suriname's Exchange Rates in One Place",
  description:
    "SuriRate helps you find the best exchange rates in Suriname by comparing USD and EUR rates from Finabank, the Central Bank, and CME – all in one place, updated daily.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    title: "SuriRate",
    statusBarStyle: "default",
  },
  metadataBase: new URL("https://suri-rate.ragnarok22.dev"),
  openGraph: {
    title: "SuriRate – Compare Suriname's Exchange Rates in One Place",
    description:
      "Find the best USD and EUR exchange rates in Suriname. SuriRate compares daily rates from Finabank, CBvS, and CME.",
    url: "https://suri-rate.ragnarok22.dev",
    siteName: "SuriRate",
    images: [
      {
        url: "/og-image.jpg",
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
    images: ["/og-image.jpg"],
    creator: "@ragnarokreinier",
  },
};

export const viewport: Viewport = {
  themeColor: "#0f172a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <OfflineBanner />
        <PwaPrompts />
        <GitHubLink />
        <PostHogProvider>{children}</PostHogProvider>
      </body>
    </html>
  );
}
