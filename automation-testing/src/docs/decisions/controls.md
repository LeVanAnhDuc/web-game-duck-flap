# CONTROLS — Quyết định

Đi cặp với `docs/requirements/controls.md`.

## Nguồn

Đọc ngày 2026-10-17 (đường dẫn tính từ gốc repo app).

- **Tài liệu:** `README.md` §Features "Built for touch as much as for a keyboard", §Controls;
  `docs/superpowers/specs/2026-09-03-flappy-bird-design.md` §5 (một cú vỗ = một bước), §6;
  `docs/superpowers/specs/2026-09-11-ux-persona-fixes/design.md` F-04a, §3.1.
- **Code:** `client/src/game/engine/input.ts` (`FLAP_CODES`, bỏ `event.repeat`, `preventDefault`, chỉ Pointer Events),
  `client/src/hooks/useGameEngine.ts` (`onKeyboardFlap` ở menu), `client/src/app/globals.css` (`.touch-none-select-none`).
- **Test đã gom (gợi ý):** `client/e2e/input.spec.ts` (chạm giữa vùng chơi, trọn lượt chỉ bằng chạm trên Pixel 7) và phần
  F-04a của `ux-fixes.spec.ts` — chuẩn hoá thành `tests/e2e/controls/flap-input.e2e.ts` và `tap.touch.e2e.ts`.

## Quyết định chốt (Chốt bởi agent — user uỷ quyền)

- **Q1** "Giữ phím = một cú vỗ" đếm bằng tiếng: mỗi cú vỗ game tính đều phát đúng một âm vỗ cánh (oscillator dạng
  `triangle`, `client/src/game/audio/sfx.ts`), nên đếm oscillator `triangle` qua probe Web Audio là đếm cú vỗ. Đo bằng
  độ cao đã thử và bỏ: lệch pha bước mô phỏng giữa hai lượt (~3,5 đơn vị) cùng cỡ với chênh lệch cần phát hiện.
- **Q2** "Không cuộn trang" kiểm bằng `defaultPrevented` của sự kiện `keydown` khi nó tới `window` sau handler của game —
  trang vốn không có gì để cuộn (`overflow: hidden`), nên đo `scrollY` không chứng minh được gì.
- **Q3** Các case chạm chạy ở project `app-touch` (Pixel 7, `hasTouch`), như bộ cũ; phần còn lại ở Desktop Chrome.
- **Q4** "Double-tap zoom bị chặn" kiểm ở hai chỗ có thể đo: `touch-action` của vùng chơi (module này) và thẻ meta
  viewport (`layout`). Hành vi zoom thật của trình duyệt không mô phỏng được trong Chromium headless.

## Tài khoản test

Không có.

## Ngoài phạm vi

- Ô nhập liệu (`isTypingTarget`): bản cờ tắt không có ô nhập nào; phủ bởi unit test `client/src/game/engine/input.test.ts`.
- Hàng đợi tối đa 3 cú vỗ: chi tiết engine, unit test.

## Tech debt liên quan

_(không có)_
