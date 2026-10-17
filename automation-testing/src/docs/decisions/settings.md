# SETTINGS — Quyết định

Đi cặp với `docs/requirements/settings.md`.

## Nguồn

Đọc ngày 2026-10-17 (đường dẫn tính từ gốc repo app).

- **Tài liệu:** `docs/superpowers/specs/2026-09-03-flappy-bird-design.md` §7; `README.md` §Features "Three difficulties,
  three separate record tables" ("change gravity, scroll speed, gap height and the spacing between pipes", "The chosen
  difficulty is remembered between visits").
- **Code:** `client/src/views/Home/components/SettingsPanel/index.tsx`, `client/src/views/Home/ghosts/CloseOnEscape`,
  `client/src/views/Home/mains/GameStage/index.tsx`, `client/src/hooks/useGameEngine.ts` (`setDifficulty`),
  `client/src/game/core/constants.ts` (bảng `TUNING`).
- **Test đã gom (gợi ý):** `client/e2e/settings.spec.ts` (Khó được nhớ sau tải lại; mỗi độ khó một bảng kỷ lục) —
  chuẩn hoá ở `tests/e2e/settings/difficulty.e2e.ts`.

## Quyết định chốt (Chốt bởi agent — user uỷ quyền)

- **Q1** REQ-SETTINGS-06 chỉ đòi **thứ tự** (Dễ rộng/chậm nhất, Khó hẹp/nhanh nhất), không đòi con số của bảng `TUNING`:
  README chỉ hứa "change … scroll speed, gap height", con số là chi tiết cân chỉnh. Khe và tốc độ đo trên canvas
  (`readWorld`): độ cao khe của ống đầu tiên, và quãng ống trôi trong 300 ms.
- **Q2** Âm thanh trong bảng cài đặt thuộc module `sound`; ở đây chỉ độ khó.
- **Q4** REQ-SETTINGS-07 vs F-04a. ux-persona-fixes F-04a chốt "`Space` ở menu **bắt đầu lượt**". Hộp thoại cài đặt lại là
  `role="dialog" aria-modal="true"`: modal nghĩa là trang phía sau không nhận tương tác, và `Space` là phím chuẩn để bật
  một `switch` / bấm một nút có focus. Chốt: khi hộp thoại mở, quy tắc modal thắng — `Space` không được bắt đầu lượt phía
  sau nó. Hành vi đã ship (lượt bắt đầu sau hộp thoại, công tắc không đổi) ghi là BUG-SETTINGS-01.
  Riêng màn chờ **không** có hộp thoại (focus ở "Cài đặt" hay nút âm thanh rồi bấm `Space` → vào lượt, nút không được
  bấm): khớp đúng chữ của F-04a, `Enter` vẫn bấm được các nút đó → không ghi bug, chỉ ghi nhận ở đây.
- **Q3** Đổi độ khó chỉ làm được ở màn chờ (nút "Cài đặt" chỉ có trên thẻ menu) — không có case "đổi giữa lượt".

## Tài khoản test

Không có.

## Ngoài phạm vi

- Trọng lực và khoảng cách giữa các ống theo độ khó: đo được nhưng trùng ý với khe + tốc độ; bảng `TUNING` có unit test.

## Tech debt liên quan

_(không có)_
