# Repository Guidelines

## Project Structure & Module Organization

- `app/`: Next.js App Router (layouts, pages, metadata, PWA assets).
- `components/`: Reusable UI. Files use kebab-case, exports use PascalCase. CSS modules live in `github.module.css`. Primitives in `components/ui/`.
- `utils/`: Helpers and domain logic (`definitions`, `data`, and `places/providers` for bank scrapers).
- `public/`: Static assets (icons, logos) and PWA build output.
- `tests/`: Vitest specs named `*.test.ts`.
- Key configs: `next.config.ts`, `eslint.config.mjs`, `vitest.config.ts`, `tsconfig.json`.

## Build, Test, and Development Commands

- `pnpm dev`: Start local dev server (Next.js + Turbopack) at `http://localhost:3000`.
- `pnpm build`: Create a production build.
- `pnpm start`: Serve the built app locally.
- `pnpm lint`: Run ESLint (Next + TypeScript + Prettier rules).
- `pnpm prettier`: Format the codebase with Prettier.
- `pnpm test --run`: Run Vitest in CI mode.

## Coding Style & Naming Conventions

- Language: TypeScript (strict). Path alias: `@/*`.
- Files: kebab-case (e.g., `exchange-rate-card.tsx`).
- Components: PascalCase exports; keep UI in `components/`, logic in `utils/`.
- Indentation: 2 spaces; use Prettier defaults.
- Imports: prefer `@/...` over relative paths.

## Testing Guidelines

- Framework: Vitest (node environment).
- Location: `tests/` with `*.test.ts` filenames.
- Mocks: `vi.mock` external calls (e.g., `axios`, providers) to avoid network.
- Run locally: `pnpm test` or CI-like `pnpm test --run`.

## Commit & Pull Request Guidelines

- Commits: Conventional style (e.g., `fix(utils): correct JSON parsing`). Common types: `feat`, `fix`, `refactor`, `chore`, `build`.
- PRs: Small, focused changes. Include description, linked issues, and screenshots for UI updates.
- Checks: Run `pnpm lint && pnpm test` before opening/merging.

## Security & Configuration Tips

- Env: Use `.env.local` for local overrides; never commit secrets. Only expose safe browser vars with `NEXT_PUBLIC_` prefix.
- Scraping: Keep selectors resilient in `utils/places/providers.ts`; favor explicit parsing and typed results.
- Deployment: Vercel-ready; service worker registered only in production.
