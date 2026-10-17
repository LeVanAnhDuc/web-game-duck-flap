# ACCESSIBILITY — Test cases

Requirement: `docs/requirements/accessibility.md` · quyết định: `docs/decisions/accessibility.md`.
Lăng kính: 1 truy vết · 2 phân vùng · 3 biên · 4 chuyển trạng thái · 5 negative · 6 ngoài lề.

### TC-ACCESSIBILITY-001 — mở trang là nút Chơi đã có focus, Enter vào lượt ngay

- **Requirement:** REQ-ACCESSIBILITY-01
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke · **Lăng kính:** 1
- **Bước:** mở trang → Enter
- **Mong đợi:** nút "Chơi" có focus (không phải nút âm thanh ở header); sau Enter là màn sẵn sàng
- **Automated:** `tests/e2e/accessibility/keyboard.e2e.ts`

### TC-ACCESSIBILITY-002 — chơi trọn một lượt và chơi lại chỉ bằng bàn phím

- **Requirement:** REQ-ACCESSIBILITY-02
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 4
- **Bước:** Enter → Space → thua → Tab (tối đa 6 lần) tới "Chơi lại" → Enter
- **Mong đợi:** tới được "Chơi lại"; sau Enter là màn sẵn sàng với điểm `0`
- **Automated:** `tests/e2e/accessibility/keyboard.e2e.ts`

### TC-ACCESSIBILITY-003 — nút đang focus có vòng focus nhìn thấy được

- **Requirement:** REQ-ACCESSIBILITY-02
- **Layer:** e2e · **Priority:** P2 · **Lăng kính:** 6
- **Bước:** mở trang → Tab
- **Mong đợi:** nút "Cài đặt" có focus, `box-shadow` khác `none`
- **Automated:** `tests/e2e/accessibility/keyboard.e2e.ts`

### TC-ACCESSIBILITY-004 — nút âm thanh chỉ có icon vẫn có tên, icon trang trí bị ẩn

- **Requirement:** REQ-ACCESSIBILITY-03
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 1
- **Bước:** mở trang → đọc nút âm thanh ở header
- **Mong đợi:** tên "Tắt âm thanh", `title` cùng chữ; mọi icon trong header `aria-hidden="true"`
- **Automated:** `tests/e2e/accessibility/semantics.e2e.ts`

### TC-ACCESSIBILITY-005 — Cài đặt là hộp thoại modal có tên, focus ở nút đóng, nhóm độ khó có nhãn

- **Requirement:** REQ-ACCESSIBILITY-04
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 1
- **Bước:** mở Cài đặt
- **Mong đợi:** `dialog` tên "Cài đặt", `aria-modal="true"`; focus ở "Đóng cài đặt"; `group` tên "Độ khó" chứa 3 nút có `aria-pressed`; `switch` "Âm thanh" có `aria-checked`
- **Automated:** `tests/e2e/accessibility/semantics.e2e.ts`

### TC-ACCESSIBILITY-006 — bật giảm chuyển động thì ba bàn tay ở màn sẵn sàng đứng yên

- **Requirement:** REQ-ACCESSIBILITY-05
- **Layer:** e2e · **Priority:** P2 · **Lăng kính:** 2
- **Bước:** không giảm chuyển động → "Chơi" → đọc animation; giảm chuyển động → đọc lại
- **Mong đợi:** không giảm: 3 bàn tay có animation; giảm: cả 3 `animation-name: none`
- **Automated:** `tests/e2e/accessibility/semantics.e2e.ts`

### TC-ACCESSIBILITY-007 — trang khai báo tiếng Việt và có tiêu đề Duck Flap

- **Requirement:** REQ-ACCESSIBILITY-06
- **Layer:** e2e · **Priority:** P2 · **Lăng kính:** 1
- **Bước:** mở trang
- **Mong đợi:** `<html lang="vi">`; tiêu đề "Duck Flap"
- **Automated:** `tests/e2e/accessibility/semantics.e2e.ts`
