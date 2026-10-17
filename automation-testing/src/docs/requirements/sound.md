# SOUND — Âm thanh tổng hợp và nút tắt tiếng

Truy vết phía app: README "Sound without a single audio file" · design spec §6 (trình duyệt chặn WebAudio) ·
ux-persona-fixes F-03 (chữ trạng thái "Bật" / "Tắt").

- **REQ-SOUND-01** Âm thanh bật sẵn lần đầu. Trạng thái hiện cho người nhìn bằng mắt ("Bật" / "Tắt" trên nút ở màn chờ) và cho trình đọc màn hình (nút gạt `aria-pressed`, tên nút là hành động "Tắt âm thanh" / "Bật âm thanh").
- **REQ-SOUND-02** Tắt / bật từ bất kỳ chỗ nào (header, màn chờ, công tắc trong Cài đặt) thì cả ba chỗ cùng đổi theo.
- **REQ-SOUND-03** Lựa chọn tắt tiếng được nhớ giữa các lần mở trang.
- **REQ-SOUND-04** Tắt tiếng thì một lượt chơi không tạo ra âm thanh nào (không mở bộ âm thanh của trình duyệt).
- **REQ-SOUND-05** Bật tiếng thì vỗ cánh và lúc chết phát âm tổng hợp bằng WebAudio, không tải file âm thanh nào.
- **REQ-SOUND-06** Trình duyệt không có WebAudio vẫn chơi trọn lượt bình thường, không lỗi.
