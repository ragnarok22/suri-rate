# SuriRate

[![CI](https://github.com/ragnarok22/suri-rate/actions/workflows/test.yml/badge.svg)](https://github.com/ragnarok22/suri-rate/actions/workflows/test.yml)
[![codecov](https://codecov.io/gh/ragnarok22/suri-rate/graph/badge.svg)](https://codecov.io/gh/ragnarok22/suri-rate)
[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/ragnarok22/suri-rate)

SuriRate is a Progressive Web App for comparing USD to SRD and EUR to SRD exchange rates from major banks in Suriname. It pulls public bank data, normalizes buy and sell prices, highlights the best rates, and keeps the dashboard usable offline.

## Features

- **Exchange-rate dashboard**: Compare USD and EUR rates from six Surinamese banks in one view.
- **Best-rate badges**: Highlight the highest buy rate and lowest sell rate per currency.
- **Bank directory**: Browse SEO-friendly bank profiles at `/banks` and `/banks/[slug]`.
- **Methodology page**: Explain scraping, normalization, caching, and badge logic at `/methodology`.
- **PWA support**: Installable app shell, offline fallback, offline banner, and service-worker caching.
- **Dark mode**: Theme switching through `next-themes`.
- **Structured data**: Dataset, FAQ, organization, website, item list, breadcrumb, and financial-service schemas.
- **Optional analytics**: PostHog integration through public environment variables.

## Supported Banks

| Bank                            | Source type        |
| ------------------------------- | ------------------ |
| Finabank                        | HTML text parsing  |
| Central Bank of Suriname (CBvS) | HTML table parsing |
| Central Money Exchange (CME)    | JSON POST endpoint |
| Hakrinbank                      | HTML table parsing |
| De Surinaamsche Bank (DSB)      | JSON endpoint      |
| Republic Bank                   | HTML table parsing |

## Tech Stack

- [Next.js 16](https://nextjs.org/) App Router with Cache Components
- React 19 and TypeScript
- Tailwind CSS 4
- Cheerio for HTML parsing
- Axios for the CME POST request
- Vitest for tests and coverage
- PostHog for optional browser analytics

## Getting Started

### Prerequisites

- Node.js 22.13+
- pnpm 11, managed through the `packageManager` field in `package.json`

### Installation

```bash
git clone https://github.com/ragnarok22/suri-rate.git
cd suri-rate
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Environment Variables

Create `.env.local` only when you need deployment settings or analytics:

```bash
# Required for pnpm on Vercel deployments
ENABLE_EXPERIMENTAL_COREPACK=1

# Optional PostHog analytics
NEXT_PUBLIC_POSTHOG_KEY=phc_xxxxx
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

## Development Commands

```bash
pnpm dev          # Start the Next.js development server with Turbopack
pnpm build        # Build for production
pnpm start        # Start the production server
pnpm lint         # Run ESLint
pnpm format       # Format with Prettier
pnpm typecheck    # Run TypeScript without emitting files
pnpm test         # Run Vitest in watch mode
pnpm test --run   # Run Vitest once
pnpm coverage     # Run tests with coverage
```

## Project Structure

```text
app/                  Next.js routes, metadata, manifest, sitemap, and robots
components/           Reusable UI components and app shell helpers
components/ui/        Small UI primitives
public/               Static assets, bank logos, PWA icons, and service worker
tests/                Vitest specs
utils/                Data fetching, scraping providers, schemas, and helpers
utils/places/         Bank-specific exchange-rate providers
```

## Data Flow

1. `app/page.tsx` calls `getRates()` from `utils/data.ts`.
2. `getRates()` uses the Next.js `use cache` directive and the `exchangeRates` cache profile.
3. `utils/places` fetches rates from each bank provider and returns normalized `USD` and `EUR` buy/sell values.
4. Components render the rate cards, calculate best-rate badges, and link back to official bank sources.

The `exchangeRates` cache profile is configured in `next.config.ts` with 12-hour revalidation and 24-hour expiration.

## Testing

The test suite uses [Vitest](https://vitest.dev/) and mocks external network calls where possible.

```bash
pnpm test --run
pnpm coverage
```

## Deployment

The project is optimized for [Vercel](https://vercel.com/) and uses Next.js caching plus a hand-authored service worker for offline support.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/ragnarok22/suri-rate)

## License

This project is licensed under the GNU General Public License v3.0. See [`LICENSE`](LICENSE) for details.

## Disclaimer

Rates are provided for informational purposes only. Always verify exchange rates directly with the bank before making a transaction.
