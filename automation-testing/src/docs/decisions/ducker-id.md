# DUCKERID — Quyết định

Đi cặp với `docs/requirements/ducker-id.md`.

## Nguồn

Đọc ngày 2026-10-17 (đường dẫn tính từ gốc repo app).

- **Tài liệu:** `docs/decisions/0001-ducker-id-sign-in.md` (cờ + 4 biến, ship tối, hồ sơ chỉ trong bộ nhớ, ngoại lệ
  storage/mạng, e2e cờ tắt), `docs/superpowers/specs/ducker-id-sign-in/design.md` (vị trí trên header, 44px, bàn phím),
  `README.md` §"Optional Ducker ID sign-in (local only)". Spec chung `web-game/docs/superpowers/specs/2026-10-04-ducker-id-
  sign-in-design.md` nằm ngoài repo — không đọc.
- **Code:** `client/src/auth/` (`config.ts`, `duckerAuth.ts` PKCE / callback, `duckerRequests.ts`
  `AbortSignal.timeout(15s)`), `client/src/hooks/{useDuckerAuth,useAccountMenu}.ts`,
  `client/src/components/AccountButton/index.tsx`, `client/scripts/build-e2e-auth.mjs` (bản cờ bật, issuer giả
  `http://ducker.test`, client `e2e-client`).
- **Test đã gom (gợi ý):** `client/e2e/ducker-sign-in-off.spec.ts`, `client/e2e/ducker-sign-in.spec.ts` (chạy bằng
  `playwright.auth.config.ts`, `next dev` cờ bật ở :3411) — chuẩn hoá tại chỗ thành `tests/e2e/ducker-id/flag-off.e2e.ts` và
  `sign-in.e2e.ts`; issuer giả tách thành fixture `fakeIssuer`.

## Quyết định chốt (Chốt bởi agent — user uỷ quyền)

- **Q1** Ducker ID thật không dùng: test chạy trên bản xuất tĩnh cờ bật (`pnpm build:e2e-auth` → `client/out-auth`,
  project `app-auth`, :3411) với issuer giả, mọi request tới nó do fixture `fakeIssuer` trả lời — đúng cách bộ cũ làm,
  nhưng trên bản build thay vì `next dev`.
- **Q2** "Issuer treo": token endpoint không bao giờ trả lời; client dùng `AbortSignal.timeout` (đồng hồ thật của trình
  duyệt, `page.clock` không tua được) → test chờ thật tới 20 giây.
- **Q3** Nút "Đăng nhập" khớp tên **chính xác**: nhãn lúc đang đi là "Đang đăng nhập…", chứa "đăng nhập".
- **Q4** "Không chạm sessionStorage" ở bản cờ tắt: page object tự đặt một cờ `e2e:seeded` vào sessionStorage để gieo
  localStorage đúng một lần; test bỏ qua đúng khoá đó và đòi không còn khoá nào khác.
- **Q5** Bản cờ tắt chạy ở project `app` (bản deploy), bản cờ bật ở `app-auth` (chỉ có trên dev: prd là bản deploy, cờ tắt).
- **Q6** Dưới 420px nút chỉ còn icon; tên truy cập vẫn là "Đăng nhập" (chữ `sr-only`) — test tìm nút theo tên ở mọi bề rộng.

## Tài khoản test

Không có tài khoản thật. Người dùng giả của issuer giả: `DUCKER.user` trong `src/data/test-data.ts`.

## Ngoài phạm vi

- Ảnh đại diện từ issuer (ADR cho phép tải URL ảnh) — issuer giả không trả `picture`.
- Đăng nhập với Ducker ID thật ở `localhost:3000` — thử tay.
- Bấm đúp / nút Back quanh redirect: unit test `client/src/auth/duckerAuth.test.ts` phủ cờ `starting` và bfcache.

## Tech debt liên quan

_(không có)_
