# PAUSE — Tạm dừng, tiếp tục, tự dừng khi chuyển tab

Truy vết phía app: README "Pause, and never lose a run by accident" · design spec §6 (tab bị ẩn giữa lúc chơi) ·
ux-persona-fixes §2b (khe hở ở "ready").

- **REQ-PAUSE-01** Trong một lượt (màn sẵn sàng hoặc đang bay), `P` hoặc `Esc` tạm dừng và nói rõ trên màn hình: "Tạm dừng", "Nhấn P hoặc Esc để chơi tiếp", nút "Tiếp tục".
- **REQ-PAUSE-02** Đang tạm dừng thì thế giới đứng yên: dừng bao lâu chim cũng không rơi, điểm không đổi, lượt không kết thúc.
- **REQ-PAUSE-03** "Tiếp tục", hoặc `P` / `Esc` lần nữa, chạy tiếp đúng lượt đó (lớp phủ biến mất, chim lại rơi).
- **REQ-PAUSE-04** Chuyển sang tab khác giữa lượt thì game tự dừng, quay lại thì chạy tiếp — kể cả khi chuyển tab ngay sau cú vỗ đầu tiên; không quay về với một con chim đã chết.
- **REQ-PAUSE-05** Ở màn chờ và màn thua, `P` / `Esc` không làm gì (không có lớp phủ tạm dừng).
