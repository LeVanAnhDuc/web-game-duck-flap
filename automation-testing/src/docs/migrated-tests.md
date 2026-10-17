# Test đã gom về lúc scaffold

Bộ e2e Playwright cũ của app (`e2e/` ở gốc repo, sau bước dời app là `client/e2e/`; chạy bằng
`playwright.config.ts` + `playwright.auth.config.ts` → `pnpm test:e2e`, `next dev` ở :3410 / :3411) được `git mv` về đây
khi dựng `automation-testing/`. Hai config cũ gộp vào `playwright.config.ts`: webServer build + phục vụ bản xuất tĩnh ở
:3410 (cờ đăng nhập ép tắt) và bản bật cờ Ducker ID ở :3411; project `app-touch` = Pixel 7, `app-auth` = bản bật cờ.

| Từ | Về | Trạng thái |
|---|---|---|
| `client/e2e/gameplay.spec.ts` | `src/tests/e2e/gameplay/run-loop.e2e.ts` | chưa chuẩn hóa |
| `client/e2e/console.spec.ts` | `src/tests/e2e/gameplay/console.e2e.ts` | chưa chuẩn hóa |
| `client/e2e/ux-fixes.spec.ts` | `src/tests/e2e/gameplay/ux-fixes.e2e.ts` | chưa chuẩn hóa |
| `client/e2e/helpers.ts` | `src/tests/e2e/gameplay/helpers.ts` (tạm, dùng chung nhiều module) | chưa chuẩn hóa |
| `client/e2e/input.spec.ts` | `src/tests/e2e/controls/flap-input.e2e.ts` | chưa chuẩn hóa |
| `client/e2e/settings.spec.ts` | `src/tests/e2e/settings/difficulty.e2e.ts` | chưa chuẩn hóa |
| `client/e2e/ducker-sign-in-off.spec.ts` | `src/tests/e2e/ducker-id/flag-off.e2e.ts` | chưa chuẩn hóa |
| `client/e2e/ducker-sign-in.spec.ts` | `src/tests/e2e/ducker-id/sign-in.e2e.ts` | chưa chuẩn hóa |
| `client/playwright.config.ts`, `client/playwright.auth.config.ts` (Desktop Chrome + Pixel 7, 2 webServer `next dev`) | `playwright.config.ts` | gộp |

Unit + component test (vitest, `client/src/**/*.test.ts(x)`) ở lại `client/`: chúng thuộc về code.

## Còn trỏ về nơi cũ

- `docs/superpowers/specs/2026-09-03-flappy-bird-design.md` §8, `docs/superpowers/specs/2026-09-11-ux-persona-fixes/design.md`,
  `docs/superpowers/specs/ducker-id-sign-in/design.md`, `docs/decisions/0001-ducker-id-sign-in.md` — tài liệu lịch sử
  (đã ship) nhắc `e2e/`, `playwright.auth.config.ts`, `pnpm test:e2e`; giữ nguyên văn.
- `docs/ux-reviews/` — nhật ký phiên cũ.
