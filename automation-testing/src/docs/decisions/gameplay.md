# GAMEPLAY — Quyết định

Đi cặp với `docs/requirements/gameplay.md`.

## Nguồn

Đọc ngày 2026-10-17 (đường dẫn tính từ gốc repo app).

- **Tài liệu:** `docs/superpowers/specs/2026-09-03-flappy-bird-design.md` §1, §5, §6;
  `docs/superpowers/specs/2026-09-11-ux-persona-fixes/design.md` (F-01 ba nhịp + gợi ý khi 0 điểm, F-05 nháy thay vì
  chơi lại, §3.2); `README.md` §Features "The game itself".
- **Code:** `client/src/views/Home/mains/GameStage/index.tsx` (overlay theo phase),
  `client/src/views/Home/components/{MenuOverlay,GameOverOverlay,Hud}/index.tsx`, `client/src/hooks/useGameEngine.ts`,
  `client/src/game/core/world.ts` (`stepIdle`, `stepPlaying`, trần), `client/src/game/core/collision.ts`.
- **Test đã gom (gợi ý):** `client/e2e/gameplay.spec.ts`, `console.spec.ts`, phần F-01 / F-05 của `ux-fixes.spec.ts` —
  chuẩn hoá tại chỗ trong `tests/e2e/gameplay/`.

## Quyết định chốt (Chốt bởi agent — user uỷ quyền)

- **Q1** "Đợi bao lâu cũng không rơi" ở màn sẵn sàng, "màn thua đứng yên" → kiểm bằng `page.clock` (tua 5 s / 30 s thời
  gian giả), không chờ thật. Vòng lặp game chạy trên `requestAnimationFrame`, được `page.clock` giả.
- **Q2** Chạm trần kiểm bằng mắt máy: vỗ liên tục 1,5 s (trước khi ống đầu tiên tới chỗ chim — ống trên sẽ giết chim ở
  trần), rồi đọc vị trí chim trên canvas (`readWorld`): sát mép trên và chưa thua. Không đọc state của game.
- **Q3** Điểm > 0 (không có gợi ý, kỷ lục mới) thuộc module `scoring`; module này chỉ dùng lượt 0 điểm.
- **Q4** F-05 đo bằng `data-nudge-count` mà app cố ý để lại cho test (cờ `data-nudge` chỉ sống 400 ms) — hành vi người
  dùng là "thẻ nháy", số đếm là bằng chứng bền của nó.
- **Q5** TC-GAMEPLAY-011 (console sạch) chạy thời gian thật, không `page.clock`: lỗi do hẹn giờ thật (nháy thẻ, React
  scheduler) chỉ lộ ra khi thời gian chạy thật.

## Tài khoản test

Không có.

## Ngoài phạm vi

- Hình ảnh của thế giới (màu trời, đồi, cánh vỗ theo vận tốc): design spec §8 "đúng/sai về thị giác do người xem".
- Va chạm ở mức pixel và luật điểm từng ống: unit test `client/src/game/core/*.test.ts`.

## Tech debt liên quan

_(không có)_
