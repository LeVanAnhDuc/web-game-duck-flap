# STORAGE — Test cases

Requirement: `docs/requirements/storage.md` · quyết định: `docs/decisions/storage.md`.
Lăng kính: 1 truy vết · 2 phân vùng · 3 biên · 4 chuyển trạng thái · 5 negative · 6 ngoài lề.

### TC-STORAGE-001 — cài đặt được lưu thành JSON ở khoá flappy-bird:settings

- **Requirement:** REQ-STORAGE-01
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 1
- **Bước:** chọn Khó → tắt tiếng
- **Mong đợi:** `flappy-bird:settings` = `{ "soundEnabled": false, "difficulty": "hard" }`
- **Automated:** `tests/e2e/storage/local-data.e2e.ts`

### TC-STORAGE-002 — cài đặt không phải JSON thì game mở với mặc định

- **Requirement:** REQ-STORAGE-02
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 5
- **Tiền điều kiện:** `flappy-bird:settings` = `{oops`
- **Bước:** mở trang
- **Mong đợi:** "Kỷ lục mức Thường"; âm thanh "Bật"; không lỗi trang
- **Automated:** `tests/e2e/storage/local-data.e2e.ts`

### TC-STORAGE-003 — cài đặt hỏng một phần thì giữ trường còn đúng

- **Requirement:** REQ-STORAGE-02
- **Layer:** e2e · **Priority:** P2 · **Lăng kính:** 2
- **Tiền điều kiện:** `{ "soundEnabled": false, "difficulty": "insane" }`
- **Bước:** mở trang
- **Mong đợi:** âm thanh "Tắt" (giữ); "Kỷ lục mức Thường" (độ khó lạ → mặc định)
- **Automated:** `tests/e2e/storage/local-data.e2e.ts`

### TC-STORAGE-004 — kỷ lục rác hiển thị là 0

- **Requirement:** REQ-STORAGE-03
- **Layer:** e2e · **Priority:** P2 · **Lăng kính:** 2
- **Bước:** mỗi test một giá trị của `flappy-bird:best:normal`: `abc`, `-5`, `Infinity`, rỗng → mở trang
- **Mong đợi:** header và màn chờ hiện `0`
- **Automated:** `tests/e2e/storage/local-data.e2e.ts`

### TC-STORAGE-005 — kỷ lục số lẻ được làm tròn xuống

- **Requirement:** REQ-STORAGE-03
- **Layer:** e2e · **Priority:** P2 · **Lăng kính:** 3
- **Tiền điều kiện:** `flappy-bird:best:normal` = `12.9`
- **Bước:** mở trang
- **Mong đợi:** `12`
- **Automated:** `tests/e2e/storage/local-data.e2e.ts`

### TC-STORAGE-006 — trình duyệt chặn localStorage thì game vẫn chơi được với mặc định

- **Requirement:** REQ-STORAGE-04
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke · **Lăng kính:** 5
- **Tiền điều kiện:** truy cập `localStorage` ném `SecurityError`
- **Bước:** mở trang → chơi và thua → "Chơi lại" → đổi sang Khó
- **Mong đợi:** "Kỷ lục mức Thường", kỷ lục 0; thẻ thua hiện; đổi độ khó vẫn chạy ("Kỷ lục mức Khó"); không lỗi trang
- **Automated:** `tests/e2e/storage/blocked.e2e.ts`

### TC-STORAGE-007 — cả một lượt chơi không có request nào ra ngoài trang

- **Requirement:** REQ-STORAGE-05
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 6
- **Bước:** mở trang → đổi cài đặt → chơi và thua (thời gian thật)
- **Mong đợi:** mọi request đều cùng origin với trang
- **Automated:** `tests/e2e/storage/local-data.e2e.ts`
