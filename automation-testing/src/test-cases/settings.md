# SETTINGS — Test cases

Requirement: `docs/requirements/settings.md` · quyết định: `docs/decisions/settings.md`.
Lăng kính: 1 truy vết · 2 phân vùng · 3 biên · 4 chuyển trạng thái · 5 negative · 6 ngoài lề.

### TC-SETTINGS-001 — mở Cài đặt từ màn chờ và đóng bằng nút X

- **Requirement:** REQ-SETTINGS-01
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke · **Lăng kính:** 1
- **Bước:** "Cài đặt" → "Đóng cài đặt"
- **Mong đợi:** hộp thoại "Cài đặt" hiện; sau khi đóng thì biến mất, màn chờ còn đó
- **Automated:** `tests/e2e/settings/panel.e2e.ts`

### TC-SETTINGS-002 — Esc đóng hộp thoại cài đặt

- **Requirement:** REQ-SETTINGS-01
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 4
- **Bước:** "Cài đặt" → Esc
- **Mong đợi:** hộp thoại biến mất, màn chờ còn đó, không vào lượt
- **Automated:** `tests/e2e/settings/panel.e2e.ts`

### TC-SETTINGS-003 — lần đầu là mức Thường và luôn chỉ một mức được chọn

- **Requirement:** REQ-SETTINGS-02
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 2
- **Bước:** mở cài đặt → lần lượt chọn Dễ, Khó
- **Mong đợi:** ban đầu chỉ Thường `aria-pressed=true`; sau mỗi lần chọn, đúng mức đó là mức duy nhất được chọn; dòng ghi chú về bảng kỷ lục hiện
- **Automated:** `tests/e2e/settings/panel.e2e.ts`

### TC-SETTINGS-004 — đổi độ khó thì kỷ lục đang hiển thị đổi theo bảng của mức đó

- **Requirement:** REQ-SETTINGS-03
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke · **Lăng kính:** 1
- **Tiền điều kiện:** kỷ lục Thường = 7, Khó = 2
- **Bước:** mở trang → mở cài đặt → chọn Khó → đóng
- **Mong đợi:** trước: header 7, menu "Kỷ lục mức Thường" 7; sau: header 2, menu "Kỷ lục mức Khó" 2
- **Automated:** `tests/e2e/settings/difficulty.e2e.ts`

### TC-SETTINGS-005 — chọn mức Khó thì lần sau mở game vẫn giữ nguyên

- **Requirement:** REQ-SETTINGS-04
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke · **Lăng kính:** 4
- **Bước:** chọn Khó → đóng → tải lại trang → mở cài đặt
- **Mong đợi:** "Kỷ lục mức Khó"; Khó đang được chọn
- **Automated:** `tests/e2e/settings/difficulty.e2e.ts`

### TC-SETTINGS-006 — lượt kế tiếp chơi ở độ khó vừa chọn

- **Requirement:** REQ-SETTINGS-05
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 1
- **Bước:** chọn Dễ → đóng → chơi và thua
- **Mong đợi:** thẻ thua ghi "Mức Dễ"
- **Automated:** `tests/e2e/settings/difficulty.e2e.ts`

### TC-SETTINGS-007 — khe hẹp dần và ống trôi nhanh dần theo Dễ, Thường, Khó

- **Requirement:** REQ-SETTINGS-06
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 2
- **Bước:** với từng mức: chọn mức → "Chơi" → Space → tua 300 ms → đo khe + vị trí ống → Space → tua 300 ms → đo lại → để thua → "Về menu"
- **Mong đợi:** khe Dễ > Thường > Khó; quãng ống trôi Dễ < Thường < Khó
- **Automated:** `tests/e2e/settings/difficulty.e2e.ts`

### TC-SETTINGS-008 — Space trong hộp thoại cài đặt bật công tắc, không bắt đầu lượt phía sau

- **Requirement:** REQ-SETTINGS-07
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 5
- **Bước:** mở Cài đặt → focus công tắc "Âm thanh" → Space
- **Mong đợi:** công tắc `aria-checked=false`; hộp thoại vẫn mở; màn chờ còn phía sau, không có màn sẵn sàng
- **Automated:** `tests/e2e/settings/panel.e2e.ts`
