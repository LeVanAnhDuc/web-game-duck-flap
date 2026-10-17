# LAYOUT — Test cases

Requirement: `docs/requirements/layout.md` · quyết định: `docs/decisions/layout.md`.
Lăng kính: 1 truy vết · 2 phân vùng · 3 biên · 4 chuyển trạng thái · 5 negative · 6 ngoài lề.

### TC-LAYOUT-001 — màn hình rộng: khung chơi cao kín vùng chơi, tỉ lệ 288:512, nằm giữa

- **Requirement:** REQ-LAYOUT-01
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke · **Lăng kính:** 1
- **Bước:** 1280 × 720 → mở trang → đo phần canvas được vẽ
- **Mong đợi:** cao = cao vùng chơi; rộng = cao × 288/512; lề trái = lề phải (± 2px)
- **Automated:** `tests/e2e/layout/world-box.e2e.ts`

### TC-LAYOUT-002 — điện thoại dọc: khung chơi rộng kín bề ngang và nằm giữa theo chiều dọc

- **Requirement:** REQ-LAYOUT-01
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 2
- **Bước:** 375 × 812 → mở trang → đo
- **Mong đợi:** rộng = rộng vùng chơi; cao = rộng × 512/288; lề trên = lề dưới (± 2px)
- **Automated:** `tests/e2e/layout/world-box.e2e.ts`

### TC-LAYOUT-003 — xoay / đổi kích thước cửa sổ thì khung chơi phóng lại cho vừa

- **Requirement:** REQ-LAYOUT-02
- **Layer:** e2e · **Priority:** P2 · **Lăng kính:** 4
- **Bước:** 1280 × 720 → mở trang → đổi sang 400 × 900
- **Mong đợi:** sau khi đổi: rộng = rộng vùng chơi, tỉ lệ 288:512
- **Automated:** `tests/e2e/layout/world-box.e2e.ts`

### TC-LAYOUT-004 — trang không cuộn ở mọi bề rộng và header cao 56px

- **Requirement:** REQ-LAYOUT-03
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 3
- **Bước:** mỗi test một bề rộng 320 / 375 / 768 / 1440 → mở trang → "Cài đặt" → đóng → "Chơi"
- **Mong đợi:** không tràn ngang, không tràn dọc ở màn chờ và màn sẵn sàng; header cao 56px
- **Automated:** `tests/e2e/layout/no-scroll.e2e.ts`

### TC-LAYOUT-005 — nhãn kỷ lục trên header đọc được bằng mắt

- **Requirement:** REQ-LAYOUT-04
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 1
- **Bước:** 375 × 812 → mở trang
- **Mong đợi:** chữ "Kỷ lục" hiện (không sr-only), cỡ ≥ 15px, cạnh con số kỷ lục
- **Automated:** `tests/e2e/layout/no-scroll.e2e.ts`

### TC-LAYOUT-006 — câu giải thích trò chơi nổi hơn tên thương hiệu

- **Requirement:** REQ-LAYOUT-05
- **Layer:** e2e · **Priority:** P2 · **Lăng kính:** 3
- **Bước:** mở trang → đo cỡ chữ tiêu đề và câu giải thích ở thẻ màn chờ
- **Mong đợi:** tiêu đề ≤ 28px; câu giải thích ≥ 16px
- **Automated:** `tests/e2e/layout/no-scroll.e2e.ts`

### TC-LAYOUT-007 — trang tắt zoom của trình duyệt

- **Requirement:** REQ-LAYOUT-06
- **Layer:** e2e · **Priority:** P2 · **Lăng kính:** 6
- **Bước:** đọc thẻ meta viewport
- **Mong đợi:** có `maximum-scale=1` và `user-scalable=no`
- **Automated:** `tests/e2e/layout/no-scroll.e2e.ts`
