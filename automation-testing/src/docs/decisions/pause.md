# PAUSE — Quyết định

Đi cặp với `docs/requirements/pause.md`.

## Nguồn

Đọc ngày 2026-10-17 (đường dẫn tính từ gốc repo app).

- **Tài liệu:** `README.md` §Features "Pause, and never lose a run by accident"; `docs/superpowers/specs/2026-09-03-
  flappy-bird-design.md` §6; `docs/superpowers/specs/2026-09-11-ux-persona-fixes/design.md` §2b.
- **Code:** `client/src/hooks/useGameEngine.ts` (`togglePause` chỉ trong "ready" / "playing"),
  `client/src/game/engine/GameEngine.ts` (`bindVisibility`), `client/src/game/engine/input.ts` (`PAUSE_CODES`),
  `client/src/views/Home/components/PauseOverlay/index.tsx`.
- **Test đã gom (gợi ý):** `client/e2e/gameplay.spec.ts` "nhấn P để tạm dừng rồi bấm Tiếp tục" và
  `ux-fixes.spec.ts` "chuyển tab ngay sau cú vỗ đầu tiên thì KHÔNG mất lượt" — chuẩn hoá ở `tests/e2e/pause/`.

## Quyết định chốt (Chốt bởi agent — user uỷ quyền)

- **Q1** "Đứng yên bao lâu cũng được" kiểm bằng đồng hồ giả: tạm dừng rồi tua 30 giây; chim không rơi tới đất (chưa thua),
  vị trí chim trên canvas không đổi.
- **Q2** Chuyển tab mô phỏng bằng `visibilityState` + sự kiện `visibilitychange` (Chromium headless không có tab thật bị
  ẩn). Case "ngay sau cú vỗ đầu tiên" bắn phím vỗ và ẩn tab trong **cùng một tác vụ đồng bộ** như bộ cũ: tách làm hai
  lệnh thì một khung hình đã kịp chen vào và test đi ngang qua khe hở (design §2b). Thêm đồng hồ giả dừng: ở đây khe hở
  luôn mở, nên case này luôn đi đúng đường của bug cũ.
- **Q3** Lúc tự dừng vì ẩn tab, game **không** hiện lớp phủ "Tạm dừng" (README chỉ hứa "pauses the game by itself"): khi
  quay lại game chạy tiếp ngay. Test chỉ đòi chim còn sống và lượt chạy tiếp, không đòi lớp phủ.

## Tài khoản test

Không có.

## Ngoài phạm vi

- Nút tạm dừng trên HUD (comment `useGameEngine` nhắc "nút trên HUD"): HUD hiện tại không có nút nào, README chỉ nói `P`
  / `Esc`. Không phải requirement.

## Tech debt liên quan

_(không có)_
