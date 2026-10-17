# SCORING — Test cases

Requirement: `docs/requirements/scoring.md` · quyết định: `docs/decisions/scoring.md`.
Lăng kính: 1 truy vết · 2 phân vùng · 3 biên · 4 chuyển trạng thái · 5 negative · 6 ngoài lề.
Mọi case chơi trên đồng hồ giả, điểm ghi bằng `autopilot` (Q1).

### TC-SCORING-001 — mỗi ống lách qua được đúng một điểm, thẻ thua ghi đúng điểm

- **Requirement:** REQ-SCORING-01, REQ-SCORING-02
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke · **Lăng kính:** 1
- **Bước:** "Chơi" → autopilot tới 1 điểm → tới 2 điểm → thả tay cho chim rơi
- **Mong đợi:** HUD `1` rồi `2`; thẻ thua ghi điểm `2`; không có dòng "Vịt rơi vì ngừng chạm"
- **Automated:** `tests/e2e/scoring/points.e2e.ts`

### TC-SCORING-002 — điểm vượt kỷ lục thì có huy hiệu, kỷ lục mới hiện và được lưu

- **Requirement:** REQ-SCORING-03
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke · **Lăng kính:** 1
- **Tiền điều kiện:** chưa có kỷ lục (0)
- **Bước:** autopilot tới 1 điểm → thả tay → tải lại trang
- **Mong đợi:** "Kỷ lục mới!"; kỷ lục trên thẻ thua và header = điểm của lượt; `flappy-bird:best:normal` = điểm đó; sau tải lại header vẫn hiện nó
- **Automated:** `tests/e2e/scoring/records.e2e.ts`

### TC-SCORING-003 — điểm thấp hơn kỷ lục thì không phải kỷ lục

- **Requirement:** REQ-SCORING-04
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 2
- **Tiền điều kiện:** kỷ lục mức Thường = 50
- **Bước:** autopilot tới 1 điểm → thả tay
- **Mong đợi:** không huy hiệu; kỷ lục trên thẻ và header vẫn 50; storage vẫn `50`
- **Automated:** `tests/e2e/scoring/records.e2e.ts`

### TC-SCORING-004 — điểm bằng kỷ lục (0 = 0) không phải kỷ lục mới

- **Requirement:** REQ-SCORING-04
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 3
- **Tiền điều kiện:** kỷ lục mức Thường = 0 (gieo sẵn)
- **Bước:** thua với 0 điểm
- **Mong đợi:** không huy hiệu; storage vẫn `0`
- **Automated:** `tests/e2e/scoring/records.e2e.ts`

### TC-SCORING-005 — kỷ lục lập ở mức Dễ không đụng tới bảng mức Thường

- **Requirement:** REQ-SCORING-05
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 2
- **Tiền điều kiện:** độ khó Dễ; kỷ lục Thường = 5, Dễ chưa có
- **Bước:** autopilot tới 1 điểm → thả tay
- **Mong đợi:** "Kỷ lục mới!"; `flappy-bird:best:easy` = điểm của lượt; `flappy-bird:best:normal` vẫn `5`
- **Automated:** `tests/e2e/scoring/records.e2e.ts`

### TC-SCORING-006 — huy hiệu kỷ lục mới không theo sang lượt sau

- **Requirement:** REQ-SCORING-06
- **Layer:** e2e · **Priority:** P2 · **Lăng kính:** 4
- **Bước:** lập kỷ lục (autopilot 1 điểm) → "Chơi lại" → thua với 0 điểm
- **Mong đợi:** lượt đầu có huy hiệu; lượt sau không
- **Automated:** `tests/e2e/scoring/records.e2e.ts`
