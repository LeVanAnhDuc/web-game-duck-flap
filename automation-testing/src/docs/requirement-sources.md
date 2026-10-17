# Nguồn requirement của Duck Flap

**Requirement của module lấy ở đâu.** `/write-tests` đọc file này ở bước 1 và chỉ đọc các nơi liệt kê dưới đây, cộng với
những gì user nói trong chat. Không dùng Jira/Confluence.

Đường dẫn tính từ thư mục gốc repo test. Danh sách này được user xác nhận lúc scaffold; khi user chỉ thêm nơi khác, hoặc
một nơi bị bỏ/đóng băng, sửa bảng này trong cùng lượt.

## Tài liệu

- `../docs/superpowers/specs/2026-09-03-flappy-bird-design.md` — thiết kế gốc: luật chơi, vòng đời phase, độ khó, kỷ lục theo độ khó, xử lý lỗi và trường hợp biên (§6), phạm vi cố ý bỏ (§9)
- `../docs/superpowers/specs/2026-09-11-ux-persona-fixes/design.md` — 6 phát hiện UX (F-01…F-06) và bug tự dừng khi ẩn tab ở "ready": hành vi đã ship sau persona review
- `../docs/superpowers/specs/ducker-id-sign-in/design.md` — đăng nhập Ducker ID: vị trí, giao diện, bàn phím, redirect URI
- `../docs/decisions/0001-ducker-id-sign-in.md` — ADR duy nhất: cờ tính năng, ship tối, hồ sơ chỉ trong bộ nhớ, ngoại lệ mạng/storage
- `../README.md` — mục Features + Controls: hợp đồng hành vi hướng tới người chơi (repo không có `docs/README.md` / FR / NFR riêng)

## Code

- `../client/src/views/Home/` — màn hình duy nhất: header, canvas, HUD, overlay menu / sẵn sàng / tạm dừng / thua, bảng cài đặt (mọi chuỗi UI tiếng Việt viết thẳng trong component — nguồn của `src/data/copy.ts`)
- `../client/src/hooks/useGameEngine.ts` — cầu nối engine ↔ React: tạm dừng, chơi lại, về menu, độ khó, âm thanh, kỷ lục
- `../client/src/game/` — luật chơi thuần (`core/`: vật lý, ống, va chạm, điểm, bảng độ khó), input (`engine/input.ts`), vòng lặp + tự dừng khi ẩn tab (`engine/GameEngine.ts`), viewport, kỷ lục / cài đặt / storage, âm thanh WebAudio
- `../client/src/auth/`, `../client/src/components/AccountButton/`, `../client/src/hooks/useDuckerAuth.ts`, `useAccountMenu.ts` — đăng nhập Ducker ID sau cờ tính năng
- `../client/scripts/build-e2e-auth.mjs`, `../client/scripts/serve.mjs` — bản build bật cờ đăng nhập (issuer giả) và server tĩnh mà suite này dùng

## Không đọc như nguồn đúng

- `../docs/superpowers/specs/*/plan.md` — danh sách task lúc build, không phải hành vi
- `../docs/ux-reviews/` — nhật ký phiên persona 2026-09-11 (phát hiện lịch sử, đã xử lý ở `2026-09-11-ux-persona-fixes`)
- `../docs/code-conventions.md` — quy ước viết code dùng chung, không nói về hành vi
- `../.claude/skills/ux-persona-review/` — persona + red route để soi UX, không phải requirement
- `../client/src/**/*.test.ts(x)` — unit/component test của app: gợi ý hành vi, không phải requirement

## Thứ tự thẩm quyền

User (chat) > tài liệu trên > code. Code cho biết app *đang* làm gì, không cho biết *nên* làm gì.
