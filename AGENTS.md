# Repository Guidelines

## Project Structure & Module Organization
- app/: Next.js App Router (layouts, pages, metadata, PWA assets).
- components/: Reusable UI (kebab-case files, PascalCase exports); CSS modules in github.module.css; components/ui for primitives.
- utils/: Helpers and domain logic (definitions, data, places/providers for bank scrapers).
- public/: Static assets (icons, logos) and PWA build output.
- tests/: Vitest specs named *.test.ts.
- Key configs: next.config.ts, eslint.config.mjs, vitest.config.ts, tsconfig.json.

## Build, Test, and Development Commands
- pnpm dev: Start local dev server (Next.js, Turbopack) at http://localhost:3000.
- pnpm build: Production build.
- pnpm start: Run the built app locally.
- pnpm lint: Lint with ESLint (Next + TypeScript + Prettier).
- pnpm prettier: Format codebase with Prettier.
- pnpm test --run: Run Vitest in CI mode.

## Coding Style & Naming Conventions
- Language: TypeScript (strict). Path alias: @/*.
- Indentation: 2 spaces; use Prettier defaults.
- Files: kebab-case for files (e.g., exchange-rate-card.tsx).
- Components: PascalCase exports; keep presentational logic in components/, data/utility in utils/.
- Imports: prefer alias (e.g., import {...} from "@/utils/definitions").

## Testing Guidelines
- Framework: Vitest (node environment). Tests live in tests/ as *.test.ts.
- Mocks: vi.mock external calls (e.g., axios, providers) to avoid network.
- Scope: Unit-test utils and providers; add regression tests for bug fixes.
- Run locally: pnpm test or pnpm test --run for CI-like execution.

## Commit & Pull Request Guidelines
- Commits: Conventional style (e.g., fix(utils): correct JSON parsing). Common types: feat, fix, refactor, chore, build.
- PRs: Small, focused changes. Include description, linked issues, and screenshots for UI updates.
- Checks: Run pnpm lint && pnpm test before opening/merging.

## Security & Configuration Tips
- Env: Add local overrides in .env.local; never commit secrets. Use NEXT_PUBLIC_ prefix only for safe browser-exposed vars.
- Scraping: Keep selectors in utils/places/providers.ts resilient; prefer explicit parsing and typed results.
- Deployment: Vercel-ready; PWA is disabled in development via next-pwa.
