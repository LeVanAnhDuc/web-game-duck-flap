# CONTROLS — Test cases

Requirement: `docs/requirements/controls.md` · quyết định: `docs/decisions/controls.md`.
Lăng kính: 1 truy vết · 2 phân vùng · 3 biên · 4 chuyển trạng thái · 5 negative · 6 ngoài lề.

### TC-CONTROLS-001 — Space, mũi tên lên và W đều bắt đầu được lượt

- **Requirement:** REQ-CONTROLS-01
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke · **Lăng kính:** 2
- **Bước:** mỗi test một phím: "Chơi" → nhấn phím → tua 0,3 giây
- **Mong đợi:** lời dạy biến mất; chim đã bay lên trên vị trí chờ
- **Automated:** `tests/e2e/controls/flap-input.e2e.ts`

### TC-CONTROLS-002 — bấm giữa vùng chơi ở màn sẵn sàng thì bắt đầu bay, lớp phủ không nuốt cú bấm

- **Requirement:** REQ-CONTROLS-02
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke · **Lăng kính:** 1
- **Bước:** "Chơi" → đo phần tử trên cùng ở giữa vùng chơi → bấm chuột vào giữa → tua 0,3 giây → đo lại
- **Mong đợi:** cả hai lần phần tử trên cùng là canvas; lời dạy biến mất
- **Automated:** `tests/e2e/controls/flap-input.e2e.ts`

### TC-CONTROLS-003 — Space ở màn chờ vào thẳng màn sẵn sàng

- **Requirement:** REQ-CONTROLS-03
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 4
- **Bước:** mở trang → Space
- **Mong đợi:** menu biến mất, màn sẵn sàng hiện
- **Automated:** `tests/e2e/controls/flap-input.e2e.ts`

### TC-CONTROLS-004 — bấm vào nền màn chờ không ném người chơi vào lượt mới

- **Requirement:** REQ-CONTROLS-03
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 5
- **Bước:** mở trang → bấm góc trên trái vùng chơi (ngoài thẻ menu)
- **Mong đợi:** menu vẫn hiện, không có màn sẵn sàng
- **Automated:** `tests/e2e/controls/flap-input.e2e.ts`

### TC-CONTROLS-005 — giữ phím chỉ tính một cú vỗ

- **Requirement:** REQ-CONTROLS-04
- **Layer:** e2e · **Priority:** P2 · **Lăng kính:** 5
- **Bước:** "Chơi" → giữ Space (1 nhấn + 5 phím lặp) → tua 250 ms → nhấn Space thêm một lần riêng → tua 50 ms
- **Mong đợi:** sau khi giữ: đúng 1 tiếng vỗ cánh; sau lần nhấn riêng: 2
- **Automated:** `tests/e2e/controls/flap-input.e2e.ts`

### TC-CONTROLS-006 — phím vỗ cánh không để trình duyệt cuộn trang

- **Requirement:** REQ-CONTROLS-05
- **Layer:** e2e · **Priority:** P2 · **Lăng kính:** 6
- **Bước:** "Chơi" → Space, `↑`
- **Mong đợi:** cả hai `keydown` tới `window` với `defaultPrevented = true`
- **Automated:** `tests/e2e/controls/flap-input.e2e.ts`

### TC-CONTROLS-007 — chơi được trọn một lượt chỉ bằng cách chạm

- **Requirement:** REQ-CONTROLS-06
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke · **Lăng kính:** 1
- **Tiền điều kiện:** project `app-touch` (Pixel 7)
- **Bước:** chạm "Chơi" → chạm vùng chơi → không chạm nữa
- **Mong đợi:** màn sẵn sàng → lời dạy biến mất → màn thua
- **Automated:** `tests/e2e/controls/tap.touch.e2e.ts`

### TC-CONTROLS-008 — vùng chơi tắt kéo, zoom và bôi chọn chữ của trình duyệt

- **Requirement:** REQ-CONTROLS-06
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 6
- **Tiền điều kiện:** project `app-touch` (Pixel 7)
- **Bước:** mở trang → đọc style tính toán của vùng chơi
- **Mong đợi:** `touch-action: none`, `user-select: none`
- **Automated:** `tests/e2e/controls/tap.touch.e2e.ts`
