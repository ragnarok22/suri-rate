import type { Metadata } from "next";
import { Inter } from "next/font/google"
import "./globals.css";
import GitHubLink from "@/components/github";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Central Exchange - Currency Exchange Rates in Suriname",
  description: "Track USD and EUR to SRD exchange rates from major banks in Suriname",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} antialiased`}
      >
        <GitHubLink />
        {children}
      </body>
    </html>
  );
}
