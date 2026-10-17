# SOUND — Test cases

Requirement: `docs/requirements/sound.md` · quyết định: `docs/decisions/sound.md`.
Lăng kính: 1 truy vết · 2 phân vùng · 3 biên · 4 chuyển trạng thái · 5 negative · 6 ngoài lề.

### TC-SOUND-001 — lần đầu âm thanh bật, nút nói trạng thái bằng chữ và bằng aria

- **Requirement:** REQ-SOUND-01
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 1
- **Bước:** mở trang với storage trống
- **Mong đợi:** chữ "Bật" trên nút ở màn chờ; nút header và nút màn chờ `aria-pressed=true`, tên "Tắt âm thanh"
- **Automated:** `tests/e2e/sound/toggles.e2e.ts`

### TC-SOUND-002 — tắt tiếng ở header thì màn chờ nói "Tắt" ngay

- **Requirement:** REQ-SOUND-01, REQ-SOUND-02
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke · **Lăng kính:** 4
- **Bước:** bấm nút âm thanh ở header
- **Mong đợi:** header `aria-pressed=false`, tên "Bật âm thanh"; màn chờ "Tắt", `aria-pressed=false`
- **Automated:** `tests/e2e/sound/toggles.e2e.ts`

### TC-SOUND-003 — nút ở màn chờ tắt rồi bật lại, header đi theo

- **Requirement:** REQ-SOUND-02
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 4
- **Bước:** bấm nút âm thanh ở màn chờ hai lần
- **Mong đợi:** lần 1: "Tắt", header `aria-pressed=false`; lần 2: "Bật", header `aria-pressed=true`
- **Automated:** `tests/e2e/sound/toggles.e2e.ts`

### TC-SOUND-004 — công tắc trong Cài đặt cùng đổi header và màn chờ

- **Requirement:** REQ-SOUND-02
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 2
- **Bước:** mở Cài đặt → bấm công tắc "Âm thanh" → đóng
- **Mong đợi:** công tắc `aria-checked=false`; header `aria-pressed=false`; sau khi đóng màn chờ "Tắt"
- **Automated:** `tests/e2e/sound/toggles.e2e.ts`

### TC-SOUND-005 — tắt tiếng được nhớ sau khi tải lại

- **Requirement:** REQ-SOUND-03
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke · **Lăng kính:** 4
- **Bước:** tắt tiếng → tải lại trang
- **Mong đợi:** màn chờ "Tắt"; header `aria-pressed=false`
- **Automated:** `tests/e2e/sound/toggles.e2e.ts`

### TC-SOUND-006 — tắt tiếng thì cả lượt chơi không mở bộ âm thanh nào

- **Requirement:** REQ-SOUND-04
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke · **Lăng kính:** 1
- **Bước:** tắt tiếng → chơi: Space vài lần → thua
- **Mong đợi:** 0 `AudioContext` được tạo, 0 oscillator
- **Automated:** `tests/e2e/sound/audio.e2e.ts`

### TC-SOUND-007 — bật tiếng thì vỗ cánh và lúc chết phát âm tổng hợp, không tải file âm thanh

- **Requirement:** REQ-SOUND-05
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 1
- **Bước:** chơi: Space → thua
- **Mong đợi:** đúng 1 `AudioContext`; có oscillator `triangle` (vỗ) và `sawtooth` (chết); không request media / file âm thanh
- **Automated:** `tests/e2e/sound/audio.e2e.ts`

### TC-SOUND-008 — trình duyệt không có WebAudio vẫn chơi trọn lượt không lỗi

- **Requirement:** REQ-SOUND-06
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 5
- **Tiền điều kiện:** `AudioContext` và `webkitAudioContext` không tồn tại
- **Bước:** chơi: Space → thua → "Chơi lại" → Space → thua
- **Mong đợi:** hai lần thẻ thua; không `pageerror`
- **Automated:** `tests/e2e/sound/audio.e2e.ts`
