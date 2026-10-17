# DEPLOY — Quyết định

Đi cặp với `docs/requirements/deploy.md`.

## Nguồn

Đọc ngày 2026-10-17 (đường dẫn tính từ gốc repo app).

- **Tài liệu:** `README.md` §"How it is put together", §"Releases and versioning"; `docs/decisions/0001-ducker-id-sign-in.md`
  (`NEXT_PUBLIC_BASE_PATH`).
- **Code:** `client/next.config.ts`, `.github/workflows/deploy.yml` (build với `NEXT_PUBLIC_BASE_PATH=/<repo>`,
  `.nojekyll`, đăng `client/out`).

## Quyết định chốt (Chốt bởi agent — user uỷ quyền)

- **Q1** Base path kiểm ở đâu? → Cùng spec chạy hai nơi: dev (gốc `/`, bản build tại chỗ) và `ENV=prd` (GitHub Pages dưới
  `/web-game-duck-flap/`). CI chỉ chạy dev; prd là lệnh tay sau deploy (`ENV=prd pnpm test src/tests/e2e/deploy`).
- **Q2** Không dựng thêm một bản build có base path trong CI chỉ để test: deploy workflow đã build đúng bản đó, và
  `ENV=prd` kiểm chính thứ được đăng.

## Tài khoản test

Không có.

## Ngoài phạm vi

- Workflow deploy tự nó (xem `gh run list` sau khi merge).

## Tech debt liên quan

_(không có)_
