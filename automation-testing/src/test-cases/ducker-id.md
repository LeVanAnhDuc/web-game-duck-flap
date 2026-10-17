# DUCKERID — Test cases

Requirement: `docs/requirements/ducker-id.md` · quyết định: `docs/decisions/ducker-id.md`.
Lăng kính: 1 truy vết · 2 phân vùng · 3 biên · 4 chuyển trạng thái · 5 negative · 6 ngoài lề. TC-DUCKERID-001 chạy trên
bản cờ tắt (project `app`); còn lại trên bản cờ bật (project `app-auth`) với `fakeIssuer`.

### TC-DUCKERID-001 — cờ tắt thì không có nút đăng nhập, không chạm storage, không request ra ngoài

- **Requirement:** REQ-DUCKERID-01
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke · **Lăng kính:** 6
- **Bước:** mở `./?code=x&state=y` trên bản deploy
- **Mong đợi:** màn chờ hiện; không nút "Đăng nhập", không nút tài khoản; `sessionStorage` không có khoá nào của app; `?code=x` vẫn trên URL; không request ra ngoài
- **Automated:** `tests/e2e/ducker-id/flag-off.e2e.ts`

### TC-DUCKERID-002 — đăng nhập: thấy tài khoản và menu, URL sạch; đăng xuất trả lại nút

- **Requirement:** REQ-DUCKERID-02, REQ-DUCKERID-03, REQ-DUCKERID-04
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke · **Lăng kính:** 1
- **Bước:** "Đăng nhập" → mở menu → "Đăng xuất"
- **Mong đợi:** nút tài khoản hiện; URL không `code=` / `state=`; menu có tên, email, "Mở hồ sơ Ducker ID" → `http://ducker.test/profile`; sau đăng xuất nút "Đăng nhập" hiện và có focus; không lỗi hydration
- **Automated:** `tests/e2e/ducker-id/sign-in.e2e.ts`

### TC-DUCKERID-003 — Esc đóng menu tài khoản và trả focus về nút tài khoản

- **Requirement:** REQ-DUCKERID-03
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 4
- **Bước:** đăng nhập → mở menu → Esc
- **Mong đợi:** menu biến mất; nút tài khoản có focus
- **Automated:** `tests/e2e/ducker-id/sign-in.e2e.ts`

### TC-DUCKERID-004 — đã đăng nhập vẫn chơi được như thường

- **Requirement:** REQ-DUCKERID-05
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 1
- **Bước:** đăng nhập → "Chơi" → Space → để thua
- **Mong đợi:** màn sẵn sàng → lời dạy biến mất → màn thua; nút tài khoản vẫn còn
- **Automated:** `tests/e2e/ducker-id/sign-in.e2e.ts`

### TC-DUCKERID-005 — hồ sơ chỉ nằm trong bộ nhớ: tải lại là chưa đăng nhập, storage không giữ gì

- **Requirement:** REQ-DUCKERID-06
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke · **Lăng kính:** 6
- **Bước:** đăng nhập → đọc `localStorage` + `sessionStorage` → tải lại
- **Mong đợi:** không chỗ nào chứa email; không còn `ducker.pkce`; sau tải lại nút "Đăng nhập" hiện
- **Automated:** `tests/e2e/ducker-id/sign-in.e2e.ts`

### TC-DUCKERID-006 — từ chối ở Ducker ID thì về chưa đăng nhập, URL sạch

- **Requirement:** REQ-DUCKERID-07
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 5
- **Bước:** issuer trả `error=access_denied` → "Đăng nhập"
- **Mong đợi:** nút "Đăng nhập" hiện; URL không còn query; `ducker.pkce` đã xoá
- **Automated:** `tests/e2e/ducker-id/sign-in.e2e.ts`

### TC-DUCKERID-007 — state bị sửa thì về chưa đăng nhập và không bao giờ gọi tới token

- **Requirement:** REQ-DUCKERID-07
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke · **Lăng kính:** 6
- **Bước:** issuer trả về `state=tampered` → "Đăng nhập"
- **Mong đợi:** chưa đăng nhập; URL sạch; token endpoint 0 lần
- **Automated:** `tests/e2e/ducker-id/sign-in.e2e.ts`

### TC-DUCKERID-008 — issuer treo thì sau tối đa 15 giây về lại chưa đăng nhập

- **Requirement:** REQ-DUCKERID-08
- **Layer:** e2e · **Priority:** P2 · **Lăng kính:** 5
- **Bước:** token endpoint không trả lời → "Đăng nhập"
- **Mong đợi:** token được gọi đúng 1 lần; nút "Đăng nhập" (tên chính xác) hiện lại trong 20 giây; URL sạch
- **Automated:** `tests/e2e/ducker-id/sign-in.e2e.ts`

### TC-DUCKERID-009 — sessionStorage bị chặn thì bấm đăng nhập không đưa đi đâu cả

- **Requirement:** REQ-DUCKERID-09
- **Layer:** e2e · **Priority:** P2 · **Lăng kính:** 5
- **Tiền điều kiện:** truy cập `sessionStorage` ném `SecurityError`
- **Bước:** "Đăng nhập"
- **Mong đợi:** không request nào tới issuer; nút "Đăng nhập" vẫn bật
- **Automated:** `tests/e2e/ducker-id/sign-in.e2e.ts`

### TC-DUCKERID-010 — 375px: nút đăng nhập ≥ 44px, nằm giữa pill kỷ lục và nút âm thanh, không đè ai

- **Requirement:** REQ-DUCKERID-10
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 3
- **Bước:** 375 × 700 → mở trang (chưa đăng nhập) → đo
- **Mong đợi:** ≥ 44 × 44; sau pill kỷ lục, trước nút âm thanh; không giao với hai cái đó
- **Automated:** `tests/e2e/ducker-id/sign-in.e2e.ts`

### TC-DUCKERID-011 — header vừa một hàng ở cả ba trạng thái, menu nằm trọn trong màn hình

- **Requirement:** REQ-DUCKERID-10
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 3
- **Bước:** mỗi test một bề rộng 320 / 375: trang không JS (nút khoá) → trang thường → đăng nhập → mở menu
- **Mong đợi:** cả ba trạng thái: không cuộn ngang, tên game một dòng (< 28px), nút ≥ 44px, không chồng nhau; menu nằm trong màn hình, định vị `absolute`, nút tài khoản không xê dịch khi mở menu
- **Automated:** `tests/e2e/ducker-id/sign-in.e2e.ts`

### TC-DUCKERID-012 — phím mũi tên trong menu tài khoản không vào lượt, Esc chỉ đóng menu

- **Requirement:** REQ-DUCKERID-11
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 5
- **Bước:** đăng nhập → mở menu → `↑`, `↓` → Esc
- **Mong đợi:** màn chờ vẫn hiện, không màn sẵn sàng; sau Esc menu đóng, màn chờ vẫn hiện
- **Automated:** `tests/e2e/ducker-id/sign-in.e2e.ts`
