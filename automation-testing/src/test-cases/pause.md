# PAUSE — Test cases

Requirement: `docs/requirements/pause.md` · quyết định: `docs/decisions/pause.md`.
Lăng kính: 1 truy vết · 2 phân vùng · 3 biên · 4 chuyển trạng thái · 5 negative · 6 ngoài lề.

### TC-PAUSE-001 — nhấn P giữa lượt thì tạm dừng và nói rõ trên màn hình

- **Requirement:** REQ-PAUSE-01
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke · **Lăng kính:** 1
- **Bước:** "Chơi" → Space → P
- **Mong đợi:** lớp phủ "Tạm dừng", "Nhấn P hoặc Esc để chơi tiếp", nút "Tiếp tục"
- **Automated:** `tests/e2e/pause/pause.e2e.ts`

### TC-PAUSE-002 — Esc cũng tạm dừng, kể cả ở màn sẵn sàng trước cú vỗ đầu

- **Requirement:** REQ-PAUSE-01
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 2
- **Bước:** "Chơi" → Esc
- **Mong đợi:** lớp phủ tạm dừng hiện, lời dạy của màn sẵn sàng ẩn đi
- **Automated:** `tests/e2e/pause/pause.e2e.ts`

### TC-PAUSE-003 — đang tạm dừng thì nửa phút sau chim vẫn đứng yên

- **Requirement:** REQ-PAUSE-02
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke · **Lăng kính:** 3
- **Bước:** "Chơi" → Space → tua 100 ms → P → đo chim → tua 30 giây → đo lại
- **Mong đợi:** chưa thua; chim ở đúng chỗ cũ; điểm `0`
- **Automated:** `tests/e2e/pause/pause.e2e.ts`

### TC-PAUSE-004 — bấm Tiếp tục thì lượt chạy tiếp

- **Requirement:** REQ-PAUSE-03
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke · **Lăng kính:** 4
- **Bước:** tạm dừng giữa lượt → "Tiếp tục" → tua 3 giây
- **Mong đợi:** lớp phủ biến mất; chim rơi và lượt kết thúc
- **Automated:** `tests/e2e/pause/pause.e2e.ts`

### TC-PAUSE-005 — nhấn P lần nữa cũng chạy tiếp

- **Requirement:** REQ-PAUSE-03
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 4
- **Bước:** tạm dừng bằng P → P → tua 3 giây
- **Mong đợi:** lớp phủ biến mất; lượt kết thúc
- **Automated:** `tests/e2e/pause/pause.e2e.ts`

### TC-PAUSE-006 — chuyển tab giữa lúc bay thì không mất lượt, quay lại thì chạy tiếp

- **Requirement:** REQ-PAUSE-04
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke · **Lăng kính:** 4
- **Bước:** "Chơi" → Space → tua 200 ms → ẩn tab → tua 10 giây → hiện tab → tua 3 giây
- **Mong đợi:** lúc quay lại chưa thua; sau đó chim rơi và lượt kết thúc
- **Automated:** `tests/e2e/pause/tab-switch.e2e.ts`

### TC-PAUSE-007 — chuyển tab ngay sau cú vỗ đầu tiên thì không mất lượt

- **Requirement:** REQ-PAUSE-04
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 3
- **Bước:** "Chơi" → trong cùng một tác vụ: phím Space + ẩn tab → tua 10 giây → hiện tab
- **Mong đợi:** không có màn thua
- **Automated:** `tests/e2e/pause/tab-switch.e2e.ts`

### TC-PAUSE-008 — P và Esc ở màn chờ hay màn thua không làm gì

- **Requirement:** REQ-PAUSE-05
- **Layer:** e2e · **Priority:** P2 · **Lăng kính:** 5
- **Bước:** màn chờ → P; thua → P, Esc
- **Mong đợi:** không lần nào có lớp phủ tạm dừng; màn chờ / màn thua vẫn nguyên
- **Automated:** `tests/e2e/pause/pause.e2e.ts`
