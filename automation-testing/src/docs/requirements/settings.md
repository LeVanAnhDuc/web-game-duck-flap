# SETTINGS — Bảng cài đặt và độ khó

Truy vết phía app: design spec §7 · README "Three difficulties, three separate record tables" · `SettingsPanel`.

- **REQ-SETTINGS-01** "Cài đặt" ở màn chờ mở hộp thoại "Cài đặt"; nút "Đóng cài đặt" hoặc `Esc` đóng nó và trả về màn chờ.
- **REQ-SETTINGS-02** Có ba độ khó Dễ / Thường / Khó, luôn đúng một mức đang chọn; lần đầu là Thường.
- **REQ-SETTINGS-03** Đổi độ khó là đổi luôn bảng kỷ lục đang hiển thị: nhãn "Kỷ lục mức …" ở màn chờ và con số kỷ lục ở màn chờ + header là của mức vừa chọn; hộp thoại nói rõ điều này bằng một dòng ghi chú.
- **REQ-SETTINGS-04** Độ khó đã chọn được nhớ giữa các lần mở trang.
- **REQ-SETTINGS-05** Lượt kế tiếp chơi ở độ khó đã chọn: thẻ thua ghi đúng "Mức …".
- **REQ-SETTINGS-06** Độ khó đổi thật cách chơi: khe giữa hai ống hẹp dần và ống trôi nhanh dần theo Dễ → Thường → Khó.
- **REQ-SETTINGS-07** Hộp thoại cài đặt là modal: khi nó mở, bàn phím thuộc về nó — `Space` trên nút / công tắc đang có focus kích hoạt chính nút đó (công tắc âm thanh đổi trạng thái) và không bao giờ bắt đầu một lượt phía sau hộp thoại.
