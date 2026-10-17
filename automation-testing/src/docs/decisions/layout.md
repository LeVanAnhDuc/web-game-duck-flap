# LAYOUT — Quyết định

Đi cặp với `docs/requirements/layout.md`.

## Nguồn

Đọc ngày 2026-10-17 (đường dẫn tính từ gốc repo app).

- **Tài liệu:** `README.md` §Features "Plays the same everywhere"; `docs/superpowers/specs/2026-09-03-flappy-bird-design.md`
  §4, §6 (`userScalable: false`); `docs/superpowers/specs/2026-09-11-ux-persona-fixes/design.md` F-02, F-06.
- **Code:** `client/src/game/render/viewport.ts` (`computeViewport` contain + canh giữa), `client/src/game/render/
  renderer.ts` (xoá cả canvas, cắt đúng khung thế giới), `client/src/views/Home/index.tsx` (`h-[100dvh]`,
  `overflow-hidden`), `client/src/views/Home/mains/Header/index.tsx` (`h-14`), `client/src/app/layout.tsx` (viewport).
- **Test đã gom (gợi ý):** `client/e2e/ux-fixes.spec.ts` F-02 và F-06 — chuẩn hoá ở `tests/e2e/layout/`.

## Quyết định chốt (Chốt bởi agent — user uỷ quyền)

- **Q1** Khung chơi đo bằng chính pixel được vẽ: renderer xoá trong suốt cả canvas rồi chỉ vẽ trong khung thế giới, nên
  vùng có alpha > 0 trên hàng giữa / cột giữa của canvas là khung thật (`GamePage.paintedBox`). Không tính lại bằng công
  thức của app. Sai số cho phép 2px (làm tròn backing store).
- **Q2** Bề rộng kiểm: 320, 375, 768, 1440 (mỗi test một bề rộng) — biên nhỏ nhất của workspace, điện thoại phổ biến,
  tablet, desktop (feature-flow §1 dùng 375 / 768 / 1440).
- **Q3** F-02 / F-06 là ngưỡng có ghi trong design (15px, 28px, 16px) nên kiểm bằng style tính toán; độ tương phản màu
  không có ngưỡng ghi lại → ngoài phạm vi.

## Tài khoản test

Không có.

## Ngoài phạm vi

- Tỉ lệ thiết bị (dpr) > 3 bị kẹp: chi tiết hiệu năng, unit test `viewport.test.ts`.
- Độ tương phản màu chữ trên nền trời.

## Tech debt liên quan

_(không có)_
