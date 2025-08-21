# SuriRate

[![CI](https://github.com/ragnarok22/suri-rate/actions/workflows/test.yml/badge.svg)](https://github.com/ragnarok22/suri-rate/actions/workflows/test.yml)
[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/ragnarok22/suri-rate)

SuriRate is a small PWA built with [Next.js](https://nextjs.org/) that compares daily USD and EUR exchange rates from several banks in Suriname.  Rates are fetched on a schedule and cached so they are always available, even offline.

## Features

- Scrapes exchange rates from Finabank, the Central Bank (CBvS), Central Money Exchange, Hakrinbank, De Surinaamsche Bank (DSB) and Republic Bank.
- Rates are refreshed daily via a Vercel cron job and stored in Redis for quick retrieval.
- Offline support through `next-pwa`.
- Optional analytics integration with PostHog.

## Getting Started

```bash
pnpm install      # install dependencies
pnpm dev          # start the development server
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

### Environment variables
Create a `.env.local` file and provide the following variables:

```
REDIS_URL=redis://localhost:6379   # connection string for Redis
ENABLE_EXPERIMENTAL_COREPACK=1     # required by Next.js when using pnpm
CRON_SECRET=<secret-token>         # token used to call the cron endpoints
NEXT_PUBLIC_CACHE_DURATION=86400   # cache lifetime in seconds
NEXT_PUBLIC_POSTHOG_KEY=           # optional, PostHog project key
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com  # optional
```

## Updating exchange rates

The endpoint `/api/cron/rates` stores new rates when called with `Authorization: Bearer $CRON_SECRET`.  A scheduled job in `vercel.json` triggers this automatically every day.

## Tests

```
pnpm test --run
```

Runs the [Vitest](https://vitest.dev/) suite.

## Deployment

The project is configured for deployment on [Vercel](https://vercel.com/) and will generate a PWA with offline support.

Rates provided by this project are for informational purposes only.  Always check with your bank for official values.
