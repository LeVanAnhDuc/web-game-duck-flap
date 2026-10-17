# ACCESSIBILITY — Quyết định

Đi cặp với `docs/requirements/accessibility.md`.

## Nguồn

Đọc ngày 2026-10-17 (đường dẫn tính từ gốc repo app).

- **Tài liệu:** `README.md` §Features "Built for touch as much as for a keyboard"; `docs/superpowers/specs/2026-09-11-
  ux-persona-fixes/design.md` F-04b (`autoFocus` nút Chơi), §4; `.claude/skills/ux-persona-review/references/personas/
  p03-hanh-chi-dung-ban-phim.md` (persona chỉ dùng bàn phím — bối cảnh, không phải nguồn requirement).
- **Code:** `client/src/views/Home/components/{MenuOverlay,SettingsPanel,GameOverOverlay}/index.tsx`,
  `client/src/views/Home/mains/{Header,GameStage}/index.tsx` (`motion-reduce:animate-none`), `client/src/app/layout.tsx`.
- **Test đã gom (gợi ý):** `client/e2e/ux-fixes.spec.ts` F-04b ("Tab lần đầu tới nút Chơi") — chuẩn hoá ở
  `tests/e2e/accessibility/keyboard.e2e.ts`.

## Quyết định chốt (Chốt bởi agent — user uỷ quyền)

- **Q1** Từ màn thua, "Chơi lại" không tự nhận focus (code không `autoFocus` nó). README chỉ hứa focus cho nút Chơi ở màn
  chờ, nên requirement là "tới được bằng Tab" (tối đa 6 lần Tab), không phải "có sẵn focus". Ghi nhận như một cải tiến
  khả dĩ, không phải bug.
- **Q2** "Vòng focus nhìn thấy được" đo bằng `box-shadow` tính toán của nút đang focus (Tailwind `focus-visible:ring-2`
  vẽ bằng box-shadow) — khác `none`.
- **Q3** Ba bàn tay đứng yên đo bằng `animation-name` tính toán (`none` khi `prefers-reduced-motion: reduce`); đối chứng:
  không giảm chuyển động thì có animation.

## Tài khoản test

Không có.

## Ngoài phạm vi

- Canvas không có mô tả thay thế cho trình đọc màn hình (trò chơi hành động thời gian thực; design không hứa).
- Tương phản màu: không có ngưỡng ghi lại.

## Tech debt liên quan

_(không có)_
