# DEPLOY — Bản xuất tĩnh chạy được dưới đường dẫn con của GitHub Pages

Truy vết phía app: README "How it is put together" (static export, GitHub Pages) · `next.config.ts` (`output: "export"`,
`basePath` / `assetPrefix` từ `NEXT_PUBLIC_BASE_PATH`) · ADR 0001 (`NEXT_PUBLIC_BASE_PATH` thay `GITHUB_PAGES`).

- **REQ-DEPLOY-01** Bản xuất tĩnh mở được không cần máy chủ Node: trang, script, style và favicon đều trả về < 400 (không tài nguyên nào trỏ sai đường dẫn gốc), không request nào thất bại, và màn chờ hiện lên chơi được.
