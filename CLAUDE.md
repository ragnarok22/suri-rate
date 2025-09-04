# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SuriRate is a Next.js 15 PWA that compares USD and EUR exchange rates from major Surinamese banks. It scrapes rates from 6 banks (Finabank, Central Bank, CME, Hakrinbank, DSB, Republic Bank), caches them in Redis, and displays them in a comparative interface with offline support.

## Development Commands

- `pnpm install` - Install dependencies
- `pnpm dev` - Start development server with Turbopack
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm test` - Run Vitest test suite
- `pnpm test --run` - Run tests once (non-watch mode)
- `pnpm lint` - Run ESLint
- `pnpm prettier` - Format code with Prettier

## Architecture

### Key Directories

- `app/` - Next.js App Router structure (layout, pages, routing)
- `utils/` - Core business logic and bank scrapers
- `components/` - React components (UI components in `ui/` subdirectory)
- `public/` - Static assets and PWA files

### Data Flow

1. **Rate Collection**: Bank scrapers in `utils/places/providers.ts` fetch exchange rates using custom fetch wrapper (`utils/index.ts`)
2. **Caching**: Rates stored in Redis via Vercel cron job (`vercel.json`) hitting `/api/cron/rates`
3. **Display**: Main page compares rates, highlights best rates using `findBestRates()` helper

### Bank Scrapers

Each bank has a dedicated scraper function in `utils/places/providers.ts`:

- **Finabank**: HTML scraping with regex patterns
- **DSB**: JSON API endpoint
- **CBVS**: Table scraping from HTML
- **CME**: JSON POST request with specific headers
- **Hakrinbank**: Table parsing from exchange page
- **Republic Bank**: Table scraping with specific column mapping

### Type System

Core types in `utils/definitions.ts`:

- `BankName` - Union type of all supported banks
- `Currency` - "USD" | "EUR"
- `ExchangeRate` - Currency with buy/sell rates
- `BankRates` - Bank info + exchange rates array

### API Layer

Custom fetch wrapper in `utils/index.ts`:

- 12-hour revalidation via Next.js `next.revalidate`
- Stream reading for response body handling
- Error handling with bank-specific fallbacks
- Used alongside axios for HTTP requests to bank endpoints

## Environment Variables

Required in `.env.local`:

```
REDIS_URL=redis://localhost:6379
ENABLE_EXPERIMENTAL_COREPACK=1
CRON_SECRET=<secret-token>
NEXT_PUBLIC_CACHE_DURATION=86400
NEXT_PUBLIC_POSTHOG_KEY=<optional>
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

## Testing

- Uses Vitest with Node.js environment
- Path alias `@` maps to project root
- CI runs on GitHub Actions with Node 20 and pnpm

## Deployment

- Configured for Vercel deployment
- PWA generation via `next-pwa` (disabled in development)
- Daily cron job at 9 AM UTC updates exchange rates
- Cron endpoint: `/api/cron/rates` with Bearer token auth

## Key Implementation Notes

- Uses custom fetch wrapper with axios for HTTP requests and Next.js caching integration
- Bank scrapers handle various data formats (HTML tables, JSON APIs, regex parsing)
- Error handling includes graceful fallbacks for unreliable bank websites
- PWA includes offline page (`app/_offline/page.tsx`)
- PostHog analytics integration via providers pattern
