# SuriRate

[![CI](https://github.com/ragnarok22/suri-rate/actions/workflows/test.yml/badge.svg)](https://github.com/ragnarok22/suri-rate/actions/workflows/test.yml)
[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/ragnarok22/suri-rate)

SuriRate is a Progressive Web App (PWA) built with [Next.js 15](https://nextjs.org/) that compares USD and EUR exchange rates from major Surinamese banks. The application scrapes rates from 6 banks, caches them using Next.js revalidation, and provides real-time comparisons with offline support.

## 🏦 Supported Banks

- **Finabank** - HTML scraping with regex patterns
- **Central Bank of Suriname (CBvS)** - Table scraping from HTML
- **Central Money Exchange (CME)** - JSON POST API
- **Hakrinbank** - Exchange page table parsing
- **De Surinaamsche Bank (DSB)** - JSON API endpoint
- **Republic Bank** - Table scraping with column mapping

## ✨ Features

- 🔄 **Real-time Rate Comparison** - Compare USD and EUR exchange rates across 6 major banks
- ⚡ **Fast Performance** - Next.js caching with 12-hour revalidation
- 📱 **PWA Support** - Works offline with `next-pwa`
- ⏰ **Real-time Updates** - Fresh rates with Next.js revalidation
- 🎯 **Best Rate Highlighting** - Automatically identifies the best buy/sell rates
- 📊 **Analytics** - Optional PostHog integration for usage tracking
- 🚀 **Modern Stack** - Built with Next.js 15, React 19, TypeScript, and Tailwind CSS

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- pnpm (configured via `packageManager` in package.json)

### Installation

```bash
# Clone the repository
git clone https://github.com/ragnarok22/suri-rate.git
cd suri-rate

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

### 🔧 Environment Variables

Create a `.env.local` file in the project root:

```bash
# Required
ENABLE_EXPERIMENTAL_COREPACK=1            # Required for pnpm with Next.js

# Optional
NEXT_PUBLIC_CACHE_DURATION=86400          # Cache lifetime (24 hours)
NEXT_PUBLIC_POSTHOG_KEY=phc_xxxxx          # PostHog analytics key
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

## 🛠️ Development

### Available Commands

```bash
pnpm dev          # Start development server with Turbopack
pnpm build        # Build for production
pnpm start        # Start production server
pnpm test         # Run tests in watch mode
pnpm test --run   # Run tests once
pnpm lint         # Run ESLint
pnpm prettier     # Format code with Prettier
```

### 🧪 Testing

The project uses [Vitest](https://vitest.dev/) for testing:

```bash
pnpm test --run   # Run all tests once
pnpm test         # Run tests in watch mode
```

## 🌐 Deployment

The project is optimized for [Vercel](https://vercel.com/) deployment:

1. **Automatic PWA Generation** - Offline support via `next-pwa`
2. **Next.js Caching** - Built-in 12-hour revalidation with service worker caching
3. **Environment Variables** - Configure in Vercel dashboard

### Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/ragnarok22/suri-rate)

## 🏗️ Architecture

- **Frontend**: Next.js 15 with App Router, React 19, TypeScript
- **Styling**: Tailwind CSS 4 with class-variance-authority
- **Data Fetching**: Custom fetch wrapper with axios for bank APIs
- **Web Scraping**: Cheerio for HTML parsing
- **Caching**: Next.js revalidation with service worker caching
- **PWA**: next-pwa for offline functionality
- **Analytics**: PostHog integration

## 📄 License

This project is private and not licensed for public use.

## ⚠️ Disclaimer

Rates provided by this application are for informational purposes only. Always verify exchange rates directly with your bank for official values.
