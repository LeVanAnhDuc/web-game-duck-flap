# STORAGE — Quyết định

Đi cặp với `docs/requirements/storage.md`.

## Nguồn

Đọc ngày 2026-10-17 (đường dẫn tính từ gốc repo app).

- **Tài liệu:** `README.md` §Features "No game accounts, no server" ("Blocked storage (private windows) or corrupted data
  degrades to defaults instead of crashing"); `docs/superpowers/specs/2026-09-03-flappy-bird-design.md` §2, §6, §7;
  `docs/decisions/0001-ducker-id-sign-in.md` (cờ tắt thì không chạm storage, không gọi mạng).
- **Code:** `client/src/game/storage/safeStorage.ts`, `client/src/game/settings/localSettingsRepository.ts`
  (`parseSettings` từng trường), `client/src/game/score/localScoreRepository.ts` (`readNumber`).
- **Test đã gom (gợi ý):** `client/e2e/settings.spec.ts` đọc `flappy-bird:settings` sau khi chọn Khó.

## Quyết định chốt (Chốt bởi agent — user uỷ quyền)

- **Q1** "Storage bị chặn" mô phỏng đúng cách trình duyệt chặn: getter `window.localStorage` ném `SecurityError`
  (`GamePage.refuseLocalStorage`).
- **Q2** Dạng lưu (khoá + JSON) là hợp đồng có thật: design spec §7 nêu tên khoá kỷ lục, và người chơi cũ phải đọc lại
  được dữ liệu của mình sau mỗi bản deploy — nên test đọc storage trực tiếp ở đây (các module khác kiểm qua UI).
- **Q3** Kỷ lục rác: một test cho mỗi giá trị (`abc`, `-5`, `Infinity`, rỗng), cùng một TC — phân vùng tương đương "không
  phải số tự nhiên hữu hạn".

## Tài khoản test

Không có.

## Ngoài phạm vi

- Hết dung lượng khi ghi (`QuotaExceededError`): cùng nhánh `catch` với bị chặn; unit test repository phủ.
- Phiên ẩn danh thật của trình duyệt.

## Tech debt liên quan

_(không có)_
