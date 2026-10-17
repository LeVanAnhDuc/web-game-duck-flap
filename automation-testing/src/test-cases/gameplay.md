# GAMEPLAY — Test cases

Requirement: `docs/requirements/gameplay.md` · quyết định: `docs/decisions/gameplay.md`.
Lăng kính: 1 truy vết · 2 phân vùng · 3 biên · 4 chuyển trạng thái · 5 negative · 6 ngoài lề.

### TC-GAMEPLAY-001 — mở trang là màn chờ với tên game, lời giải thích, kỷ lục và ba nút

- **Requirement:** REQ-GAMEPLAY-01
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke · **Lăng kính:** 1
- **Bước:** mở trang với storage trống
- **Mong đợi:** thẻ menu có "Duck Flap", câu giải thích, "Kỷ lục mức Thường" = 0, nút "Chơi", "Cài đặt", nút âm thanh; không có điểm HUD
- **Automated:** `tests/e2e/gameplay/run-loop.e2e.ts`

### TC-GAMEPLAY-002 — bấm Chơi vào màn sẵn sàng, chim đợi mãi không rơi

- **Requirement:** REQ-GAMEPLAY-02
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke · **Lăng kính:** 4
- **Bước:** "Chơi" → tua 5 giây thời gian giả
- **Mong đợi:** lời dạy "Chạm liên tục để bay" + câu cơ chế; điểm `0`; sau 5 giây vẫn ở màn sẵn sàng, chim vẫn quanh giữa trời
- **Automated:** `tests/e2e/gameplay/run-loop.e2e.ts`

### TC-GAMEPLAY-003 — vỗ cánh đầu tiên bắt đầu lượt và ống trôi vào

- **Requirement:** REQ-GAMEPLAY-03
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke · **Lăng kính:** 4
- **Bước:** "Chơi" → Space → tua 0,5 giây
- **Mong đợi:** lời dạy biến mất; điểm còn hiện; canvas có ống
- **Automated:** `tests/e2e/gameplay/run-loop.e2e.ts`

### TC-GAMEPLAY-004 — không vỗ nữa thì chim rơi xuống đất và hiện màn thua

- **Requirement:** REQ-GAMEPLAY-04
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke · **Lăng kính:** 1
- **Bước:** "Chơi" → Space → tua 3 giây
- **Mong đợi:** thẻ "Hết lượt", "Mức Thường", điểm `0`, kỷ lục `0`; HUD và lời dạy đã biến mất
- **Automated:** `tests/e2e/gameplay/run-loop.e2e.ts`

### TC-GAMEPLAY-005 — chạm trần chỉ bị chặn lại, lượt vẫn tiếp tục

- **Requirement:** REQ-GAMEPLAY-05
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 3
- **Bước:** "Chơi" → vỗ mỗi 100 ms trong 1,5 giây
- **Mong đợi:** chim nằm sát mép trên (tâm ≤ 16 đơn vị thế giới); chưa có màn thua
- **Automated:** `tests/e2e/gameplay/run-loop.e2e.ts`

### TC-GAMEPLAY-006 — Chơi lại sau khi thua thì vào lượt mới với điểm 0

- **Requirement:** REQ-GAMEPLAY-06
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke · **Lăng kính:** 4
- **Bước:** thua một lượt → "Chơi lại"
- **Mong đợi:** màn sẵn sàng; điểm `0`; thẻ thua biến mất
- **Automated:** `tests/e2e/gameplay/run-loop.e2e.ts`

### TC-GAMEPLAY-007 — Về menu sau khi thua thì quay lại màn chờ

- **Requirement:** REQ-GAMEPLAY-06
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 4
- **Bước:** thua một lượt → "Về menu"
- **Mong đợi:** thẻ menu hiện, thẻ thua biến mất
- **Automated:** `tests/e2e/gameplay/run-loop.e2e.ts`

### TC-GAMEPLAY-008 — chạm ngoài thẻ thua thì thẻ nháy chứ không chơi lại; chạm trúng thẻ thì không nháy

- **Requirement:** REQ-GAMEPLAY-07
- **Layer:** e2e · **Priority:** P2 · **Lăng kính:** 5
- **Bước:** thua → bấm góc trên trái của lớp phủ → bấm vào chữ "Hết lượt" trên thẻ
- **Mong đợi:** số lần nháy 0 → 1 → vẫn 1; thẻ thua vẫn hiện, không có màn sẵn sàng
- **Automated:** `tests/e2e/gameplay/game-over.e2e.ts`

### TC-GAMEPLAY-009 — màn thua đứng yên nửa phút cho người đọc chậm

- **Requirement:** REQ-GAMEPLAY-07
- **Layer:** e2e · **Priority:** P2 · **Lăng kính:** 3
- **Bước:** thua → tua 30 giây
- **Mong đợi:** thẻ thua vẫn hiện, vẫn điểm `0`
- **Automated:** `tests/e2e/gameplay/game-over.e2e.ts`

### TC-GAMEPLAY-010 — thua với 0 điểm thì được giải thích vì sao vịt rơi

- **Requirement:** REQ-GAMEPLAY-08
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 3
- **Bước:** thua với 0 điểm
- **Mong đợi:** dòng "Vịt rơi vì ngừng chạm. Chạm đều tay, mỗi lần chạm là một nhịp."
- **Automated:** `tests/e2e/gameplay/game-over.e2e.ts`

### TC-GAMEPLAY-011 — chơi hai lượt liền không sinh lỗi nào trên console

- **Requirement:** REQ-GAMEPLAY-09
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 6
- **Bước:** thua → "Chơi lại" → Space → thua lần nữa (thời gian thật)
- **Mong đợi:** không `console.error`, không `pageerror`
- **Automated:** `tests/e2e/gameplay/run-loop.e2e.ts`
