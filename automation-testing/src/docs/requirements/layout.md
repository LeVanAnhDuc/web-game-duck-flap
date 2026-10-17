# LAYOUT — Khung chơi co giãn, trang không cuộn, chữ đọc được

Truy vết phía app: README "Plays the same everywhere" · design spec §4 (288 × 512, contain, canh giữa) · ux-persona-fixes
F-02 (nhãn kỷ lục nhìn thấy được, 15px), F-06 (tiêu đề 28px, câu giải thích 16px) · `layout.tsx` (viewport).

- **REQ-LAYOUT-01** Thế giới game là một khung 288 × 512 phóng vừa trọn vùng chơi (kiểu contain) và canh giữa: màn hình rộng thấy một cột chơi cao kín vùng chơi giữa nền tối; điện thoại dọc thì khung rộng kín bề ngang.
- **REQ-LAYOUT-02** Đổi kích thước cửa sổ thì khung chơi phóng lại cho vừa.
- **REQ-LAYOUT-03** Trang không bao giờ cuộn (ngang lẫn dọc) ở mọi bề rộng từ 320 đến 1440; header cao cố định 56px.
- **REQ-LAYOUT-04** Kỷ lục trên header có nhãn chữ "Kỷ lục" nhìn thấy được (không chỉ cho trình đọc màn hình), cỡ ≥ 15px.
- **REQ-LAYOUT-05** Ở thẻ màn chờ, câu giải thích trò chơi nổi hơn tên thương hiệu: tiêu đề ≤ 28px, câu giải thích ≥ 16px.
- **REQ-LAYOUT-06** Trang tắt zoom của trình duyệt (để chạm nhanh không thành double-tap zoom): viewport `maximum-scale=1`, `user-scalable=no`.
