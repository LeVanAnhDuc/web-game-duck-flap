# SOUND — Quyết định

Đi cặp với `docs/requirements/sound.md`.

## Nguồn

Đọc ngày 2026-10-17 (đường dẫn tính từ gốc repo app).

- **Tài liệu:** `README.md` §Features "Sound without a single audio file"; `docs/superpowers/specs/2026-09-03-flappy-bird-
  design.md` §6; `docs/superpowers/specs/2026-09-11-ux-persona-fixes/design.md` F-03, §4 (`aria-label` giữ dạng hành động
  + `aria-pressed`).
- **Code:** `client/src/game/audio/sfx.ts` (`SoundPlayer`: context tạo lười ở lần phát đầu, mỗi sự kiện một oscillator:
  flap `triangle`, score `sine`, hit `square`, die `sawtooth`), `client/src/views/Home/mains/Header/index.tsx`,
  `client/src/views/Home/components/{MenuOverlay,SettingsPanel}/index.tsx`, `client/src/hooks/useGameEngine.ts`.
- **Test đã gom (gợi ý):** `client/e2e/ux-fixes.spec.ts` F-03 ("Bật" → "Tắt") — chuẩn hoá ở `tests/e2e/sound/toggles.e2e.ts`.

## Quyết định chốt (Chốt bởi agent — user uỷ quyền)

- **Q1** "Có tiếng / không tiếng" chứng minh không cần loa: bọc `AudioContext` bằng probe (`GamePage.probeAudio`) đếm số
  context được tạo và dạng sóng của mọi oscillator được `start()`. Tắt tiếng = 0 context; bật tiếng = có `triangle` (vỗ)
  và `sawtooth` (chết).
- **Q2** "Không file âm thanh": không request nào có `resourceType` `media` hay đuôi âm thanh trong cả lượt.
- **Q3** Trình duyệt thiếu WebAudio mô phỏng bằng cách xoá `AudioContext` / `webkitAudioContext` trước khi trang chạy.

## Tài khoản test

Không có.

## Ngoài phạm vi

- Âm thanh nghe ra sao (cao độ, độ to): "đúng/sai về tai do người nghe".
- Âm `score` / `hit`: cần một lượt có điểm / va ống — vỗ và chết đã chứng minh đường phát âm; unit test của engine phủ phần còn lại.

## Tech debt liên quan

_(không có)_
