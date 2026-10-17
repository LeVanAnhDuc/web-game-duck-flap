# DEPLOY — Test cases

Requirement: `docs/requirements/deploy.md` · quyết định: `docs/decisions/deploy.md`.
Lăng kính: 1 truy vết · 2 phân vùng · 3 biên · 4 chuyển trạng thái · 5 negative · 6 ngoài lề.

### TC-DEPLOY-001 — bản xuất tĩnh tải đủ mọi tài nguyên dưới đường dẫn gốc và vào chơi được

- **Requirement:** REQ-DEPLOY-01
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke · **Lăng kính:** 1
- **Bước:** mở `./` (dev: gốc; prd: `/web-game-duck-flap/`) → "Chơi"
- **Mong đợi:** mọi response < 400, không request thất bại; script và style tải từ cùng đường dẫn gốc với trang; màn sẵn sàng hiện
- **Automated:** `tests/e2e/deploy/static-export.e2e.ts`
