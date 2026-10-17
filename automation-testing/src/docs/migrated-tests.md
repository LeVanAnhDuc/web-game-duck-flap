# Test đã gom về lúc scaffold

Bộ e2e Playwright cũ của app (`e2e/` ở gốc repo, sau bước dời app là `client/e2e/`; chạy bằng
`playwright.config.ts` + `playwright.auth.config.ts` → `pnpm test:e2e`, `next dev` ở :3410 / :3411) được `git mv` về đây
khi dựng `automation-testing/`. Hai config cũ gộp vào `playwright.config.ts`: webServer build + phục vụ bản xuất tĩnh ở
:3410 (cờ đăng nhập ép tắt) và bản bật cờ Ducker ID ở :3411; project `app-touch` = Pixel 7, `app-auth` = bản bật cờ.

| Từ | Về | Trạng thái |
|---|---|---|
| `client/e2e/gameplay.spec.ts` | `src/tests/e2e/gameplay/run-loop.e2e.ts` (git mv): luồng chơi → TC-GAMEPLAY-002/004/006/007; case "P rồi Tiếp tục" → TC-PAUSE-004 (`pause/pause.e2e.ts`) | đã chuẩn hóa |
| `client/e2e/console.spec.ts` | gộp vào `run-loop.e2e.ts` → TC-GAMEPLAY-011 | đã chuẩn hóa |
| `client/e2e/ux-fixes.spec.ts` | `src/tests/e2e/gameplay/game-over.e2e.ts` (git mv): F-05 → TC-GAMEPLAY-008, F-01 → TC-GAMEPLAY-002/010; F-04a → TC-CONTROLS-003/004; F-04b → TC-ACCESSIBILITY-001; F-02 → TC-LAYOUT-005; F-03 → TC-SOUND-002; F-06 → TC-LAYOUT-006; chuyển tab sau cú vỗ đầu → TC-PAUSE-007 (`pause/tab-switch.e2e.ts`) | đã chuẩn hóa |
| `client/e2e/helpers.ts` | xoá: `gotoGame` / gieo storage → `GamePage.goto({ storage })`, các bước chơi → `GamePage`, khoá storage → `src/data/test-data.ts` | đã chuẩn hóa |
| `client/e2e/input.spec.ts` | `src/tests/e2e/controls/flap-input.e2e.ts` (git mv) → TC-CONTROLS-002; case Pixel 7 → TC-CONTROLS-007 (`controls/tap.touch.e2e.ts`, project `app-touch`) | đã chuẩn hóa |
| `client/e2e/settings.spec.ts` | `src/tests/e2e/settings/difficulty.e2e.ts` (git mv) → TC-SETTINGS-004/005 | đã chuẩn hóa |
| `client/e2e/ducker-sign-in-off.spec.ts` | `src/tests/e2e/ducker-id/flag-off.e2e.ts` → TC-DUCKERID-001 | đã chuẩn hóa |
| `client/e2e/ducker-sign-in.spec.ts` | `src/tests/e2e/ducker-id/sign-in.e2e.ts` → TC-DUCKERID-002…012; issuer giả → `src/fixtures/issuer.fixture.ts` | đã chuẩn hóa |
| `client/playwright.config.ts`, `client/playwright.auth.config.ts` (Desktop Chrome + Pixel 7, 2 webServer `next dev`) | `playwright.config.ts` (project `app`, `app-touch` = Pixel 7, `app-auth` = bản xuất tĩnh cờ bật) | gộp |

Không case cũ nào bị bỏ. Bộ cũ chạy **mọi** spec trên cả Desktop Chrome lẫn Pixel 7; bộ mới chỉ chạy các case chạm trên
Pixel 7 (cùng một đường code cho phần còn lại), và đo kích thước điện thoại bằng `setViewportSize` ở module `layout`.

Unit + component test (vitest, `client/src/**/*.test.ts(x)`) ở lại `client/`: chúng thuộc về code.

## Còn trỏ về nơi cũ

- `docs/superpowers/specs/2026-09-03-flappy-bird-design.md` §8, `docs/superpowers/specs/2026-09-11-ux-persona-fixes/design.md`,
  `docs/superpowers/specs/ducker-id-sign-in/design.md`, `docs/decisions/0001-ducker-id-sign-in.md` — tài liệu lịch sử
  (đã ship) nhắc `e2e/`, `playwright.auth.config.ts`, `pnpm test:e2e`; giữ nguyên văn.
- `docs/ux-reviews/` — nhật ký phiên cũ.
