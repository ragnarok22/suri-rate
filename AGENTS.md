# Repository Guidelines

## Project Overview

SuriRate is a Next.js 16 PWA that compares USD to SRD and EUR to SRD exchange rates from six major Surinamese banks: Finabank, Central Bank, Central Money Exchange, Hakrinbank, De Surinaamsche Bank, and Republic Bank. It scrapes public bank data, normalizes buy and sell values, caches results with Next.js Cache Components, highlights best rates, and supports offline use through a hand-authored service worker.

## Project Structure & Module Organization

- `app/`: Next.js App Router routes, layouts, metadata, manifest, sitemap, robots, and PWA offline route.
- `components/`: Reusable UI components. Files use kebab-case, exports use PascalCase, and primitives live in `components/ui/`.
- `utils/`: Helpers and domain logic, including `definitions`, `data`, schema helpers, bank pages, and places providers.
- `utils/places/`: Bank-specific exchange-rate collection orchestration and provider scrapers.
- `public/`: Static assets, bank logos, PWA icons, `offline.html`, and `sw.js`.
- `tests/`: Vitest specs named `*.test.ts`.
- Key configs: `next.config.ts`, `eslint.config.mjs`, `vitest.config.ts`, `tsconfig.json`.

## Build, Test, and Development Commands

- `pnpm install`: Install dependencies.
- `pnpm dev`: Start the local Next.js development server with Turbopack at `http://localhost:3000`.
- `pnpm build`: Create a production build.
- `pnpm start`: Serve the production build locally.
- `pnpm lint`: Run ESLint.
- `pnpm format`: Format the codebase with Prettier.
- `pnpm typecheck`: Run TypeScript type checking without emitting files.
- `pnpm test`: Run Vitest in watch mode.
- `pnpm test --run`: Run Vitest once in CI mode.
- `pnpm coverage`: Run tests with V8 coverage.

## Architecture

### Data Flow

1. `app/page.tsx` calls `getRates()` from `utils/data.ts`.
2. `getRates()` uses the Next.js `use cache` directive and the `exchangeRates` cache profile.
3. `getCurrentRates()` in `utils/places/index.ts` orchestrates all bank providers sequentially.
4. Provider failures are caught and represented with zero-valued USD and EUR rates so the dashboard can still render.
5. Components render rate cards, compare rates with `findBestRates()`, and link back to official bank sources.

### Caching

The `exchangeRates` cache profile is configured in `next.config.ts`:

- `stale`: 5 minutes.
- `revalidate`: 12 hours.
- `expire`: 24 hours.

Service-worker caching provides offline reads and the PWA fallback uses `public/offline.html`.

### Bank Scrapers

Each bank has a dedicated provider in `utils/places/providers.ts`:

- `getFinabankExchangeRates()`: HTML text scraping with regex patterns.
- `getCBVSExchangeRates()`: HTML table parsing with a graceful zero-rate fallback on error.
- `getCMEExchangeRates()`: Cached wrapper around a direct Axios POST request.
- `getDsbExchangeRates()`: JSON endpoint parsing.
- `getHakrinbankExchangeRates()`: HTML exchange-page table parsing.
- `getRepublicBankExchangeRates()`: HTML table parsing with column mapping.

### Critical: CME Cloudflare Bypass

The CME scraper requires a direct Axios POST request with browser-like headers to work reliably on Vercel. Keep these headers intact unless the provider behavior changes:

- `User-Agent` for a modern Chrome browser.
- `Sec-Ch-Ua`, `Sec-Ch-Ua-Mobile`, and `Sec-Ch-Ua-Platform`.
- `Sec-Fetch-Dest`, `Sec-Fetch-Mode`, and `Sec-Fetch-Site`.
- `Origin` and `Referer` pointing to `https://www.cme.sr`.
- `Accept-Encoding`, `Connection`, and `Host`.

If CME returns a 403 response or a "Just a moment..." HTML page, Cloudflare is blocking the request. Verify that the complete browser fingerprint is still present.

### Type System

Core types live in `utils/definitions.ts`:

- `BankName`: Union type for all supported banks.
- `Currency`: `"USD" | "EUR"`.
- `ExchangeRate`: Currency with buy and sell values.
- `BankInfo`: Bank name, logo, and source link.
- `BankRates`: Bank metadata plus an array of exchange rates.

### HTTP Request Handling

The codebase uses two request paths:

- `api()` in `utils/index.ts`: Custom `fetch` wrapper that reads the response stream and returns the response plus `html`. Most bank providers use this path.
- Direct Axios POST in the CME provider: Required for CME because Cloudflare blocks the regular fetch path.

## Environment Variables

Use `.env.local` for local overrides and never commit secrets.

```bash
# Required for pnpm on Vercel deployments
ENABLE_EXPERIMENTAL_COREPACK=1

# Optional PostHog analytics
NEXT_PUBLIC_POSTHOG_KEY=phc_xxxxx
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

Only expose browser-safe values with the `NEXT_PUBLIC_` prefix. PostHog analytics are optional and wired through `app/providers.tsx`.

## Coding Style & Naming Conventions

- Language: TypeScript with strict checking. Path alias: `@/*`.
- Files: kebab-case, for example `exchange-rate-card.tsx`.
- Components: PascalCase exports. Keep UI in `components/` and domain logic in `utils/`.
- Indentation: 2 spaces. Use Prettier defaults.
- Imports: prefer `@/...` over relative paths.
- Scrapers: keep selectors resilient and parsing explicit.

## Testing Guidelines

- Framework: Vitest with Node.js environment.
- Location: `tests/` with `*.test.ts` filenames.
- Mocks: use `vi.mock` for external calls such as providers and `api()`.
- Axios: CME tests should mock `axios.post`, typically with `vi.spyOn()`.
- CI: GitHub Actions runs on Node 20 and pnpm.
- Run locally with `pnpm test` or CI-like with `pnpm test --run`.
- Before opening or merging, run `pnpm lint && pnpm typecheck && pnpm test --run` when feasible.

## Deployment

- Target platform: Vercel.
- PWA service worker: `public/sw.js`, registered by `components/pwa-prompts.tsx` in production only.
- Web app manifest: generated by `app/manifest.ts` and served at `/manifest.webmanifest`.
- Offline fallback: `public/offline.html` and `app/_offline/page.tsx`.
- Caching: Next.js cache profile plus service-worker caching.

## Commit & Pull Request Guidelines

- Commits: Conventional style, for example `fix(utils): correct JSON parsing`.
- Common commit types: `feat`, `fix`, `refactor`, `chore`, `build`.
- PRs: Keep changes small and focused. Include a description, linked issues, and screenshots for UI updates.
- Checks: Run `pnpm lint && pnpm typecheck && pnpm test --run` before opening or merging when feasible.

## Security, Licensing, and Configuration Tips

- License: GPLv3. Keep `LICENSE` and public license references aligned.
- Env: Use `.env.local` for local overrides and never commit secrets.
- Public variables: Only expose safe browser values with `NEXT_PUBLIC_`.
- Deployment: Vercel-ready with service worker registration only in production.
