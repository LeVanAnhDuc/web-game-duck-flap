# CLAUDE.md

**Duck Flap** — a Flappy Bird clone, Next.js 15 + Canvas 2D, exported as a static site and
served from GitHub Pages (https://levananhduc.github.io/web-game-duck-flap/). No server, no
database, no API: everything runs in the browser, records and settings live in localStorage.
Optional Ducker ID sign-in sits behind a feature flag that the deploy never sets
(`docs/decisions/0001-ducker-id-sign-in.md`).

## Layout

| Folder | Holds |
| --- | --- |
| `client/` | the game app: `package.json`, `pnpm-lock.yaml`, `.env.example`, `.husky/`, `src/`, `scripts/`, unit + component tests (vitest, next to the code) |
| `automation-testing/` | the end-to-end regression suite (Playwright): requirements, test cases, defects, page objects, specs — its own `package.json`, rules in `automation-testing/CLAUDE.md` |
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
pnpm build:e2e-auth   # flag-on export (fake Ducker ID issuer) to client/out-auth/, for the suite
pnpm release:next     # next version, from the commits (git-cliff, repo root)
```

```bash
cd automation-testing
pnpm install && pnpm exec playwright install chromium
pnpm test             # builds ../client (both exports), serves them on :3410/:3411, runs every module
pnpm typecheck
pnpm coverage:check   # REQ ↔ TC ↔ spec ↔ bug; --write regenerates the traceability matrix
```

Regression tests: automation-testing/ (/write-tests)

Git hooks: husky, installed by `pnpm install` in `client/` — `commit-msg` runs
`.githooks/commit-lint.sh`, `pre-commit` runs lint-staged inside `client/`.
