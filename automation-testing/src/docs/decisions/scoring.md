# SCORING — Quyết định

Đi cặp với `docs/requirements/scoring.md`.

## Nguồn

Đọc ngày 2026-10-17 (đường dẫn tính từ gốc repo app).

- **Tài liệu:** `docs/superpowers/specs/2026-09-03-flappy-bird-design.md` §7, §8; `README.md` §Features "Three
  difficulties, three separate record tables".
- **Code:** `client/src/game/core/scoring.ts` (cờ `passed` trên ống), `client/src/game/score/localScoreRepository.ts`
  (`saveBest`: chỉ ghi khi lớn hơn hẳn), `client/src/hooks/useGameEngine.ts` (`onRunEnd`, `isNewBest`, tắt huy hiệu
  khi vào lượt mới), `client/src/views/Home/components/GameOverOverlay/index.tsx`.
- **Test đã gom (gợi ý):** `client/e2e/settings.spec.ts` "mỗi độ khó có bảng kỷ lục riêng" (chỉ hiển thị) — phần hiển
  thị theo độ khó nằm ở `settings`; ở đây là phần **lập** kỷ lục.

## Quyết định chốt (Chốt bởi agent — user uỷ quyền)

- **Q1** Ghi điểm thật bằng cách chơi thật: `GamePage.autopilot(n)` đọc canvas mỗi khung hình (chim vàng, ống xanh) và
  vỗ cánh khi chim sắp chìm xuống dưới một vạch gần đáy khe kế tiếp; thời gian giả bị dừng nên mỗi quyết định ứng đúng
  một khung hình, máy nhanh hay chậm như nhau. Không gieo hạt, không đọc state game: dãy ống là ngẫu nhiên như người
  chơi thật gặp. Đã chạy thử 5 lượt × 10 điểm ở Dễ và Thường: xanh cả. Ở Khó (khe 92) autopilot hay rơi ở điểm 3–6, nên
  module chỉ chơi Dễ / Thường.
- **Q2** "Đúng một điểm mỗi ống": autopilot dừng ngay khi HUD đạt 1 rồi 2 (hỏi DOM mỗi 8 khung hình, mỗi ống cách nhau
  ~85 khung) và HUD phải đúng bằng số đó — cộng hai lần cho một ống sẽ nhảy qua. Thả tay sau đó thì chim rơi xuống đất
  trước khi tới ống kế tiếp, nên điểm trên thẻ thua = điểm HUD lúc thả.
- **Q3** Biên "bằng kỷ lục" (REQ-SCORING-04) kiểm ở 0 = 0: kỷ lục 0 gieo sẵn và một lượt 0 điểm. Ép một lượt đúng N > 0
  điểm bằng kỷ lục N thì autopilot làm được (dừng ở N), nhưng biên ở 0 chứng minh cùng nhánh `normalized <= best` mà
  không tốn 10 giây chơi.
- **Q4** Kỷ lục gieo sẵn qua localStorage (khoá của app), không qua UI — không có UI nào đặt kỷ lục tay.

## Tài khoản test

Không có.

## Ngoài phạm vi

- Mức Khó với autopilot (xem Q1). Tách bảng kỷ lục của Khó vẫn được kiểm ở `settings` (hiển thị) và ở đây qua Dễ ↔ Thường.
- Lưu kỷ lục khi storage bị chặn ("vẫn là kỷ lục trong phiên"): module `storage`.

## Tech debt liên quan

_(không có)_
