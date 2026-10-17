# CLAUDE.md

**Duck Flap** — a Flappy Bird clone, Next.js 15 + Canvas 2D, exported as a static site and
served from GitHub Pages (https://levananhduc.github.io/web-game-duck-flap/). No server, no
database, no API: everything runs in the browser, records and settings live in localStorage.
Optional Ducker ID sign-in sits behind a feature flag that the deploy never sets
(`docs/decisions/0001-ducker-id-sign-in.md`).

## Layout

| Folder | Holds |
| --- | --- |
| `client/` | the game app: `package.json`, `pnpm-lock.yaml`, `.env.example`, `.husky/`, `src/`, unit + component tests (vitest, next to the code) |
| `docs/` | design spec, ADRs, feature specs, UX reviews, code conventions |
| `.claude/`, `.githooks/`, `.github/`, `cliff.toml` | Claude config, commit-lint script, CI, release notes config — all at the root |

## Commands

```bash
cd client
pnpm install --frozen-lockfile   # also installs the husky hooks (core.hooksPath = client/.husky/_)
pnpm dev              # http://localhost:3000 (use --port if Ducker ID holds 3000)
pnpm test             # vitest: unit + component
pnpm typecheck
pnpm lint
pnpm build            # static export to client/out/
pnpm test:e2e         # Playwright, boots next dev itself
pnpm release:next     # next version, from the commits (git-cliff, repo root)
```

Git hooks: husky, installed by `pnpm install` in `client/` — `commit-msg` runs
`.githooks/commit-lint.sh`, `pre-commit` runs lint-staged inside `client/`.
