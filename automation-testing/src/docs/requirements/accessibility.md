# ACCESSIBILITY — Bàn phím, trình đọc màn hình, giảm chuyển động

Truy vết phía app: README "Built for touch as much as for a keyboard" ("Play holds focus from the first frame, so a
keyboard never has to hunt for the button") · ux-persona-fixes F-04b, §4 (ARIA nút gạt) · `SettingsPanel` (dialog).

- **REQ-ACCESSIBILITY-01** Mở trang là nút "Chơi" đã có focus: `Enter` vào ngay màn sẵn sàng, không phải đi tìm nút.
- **REQ-ACCESSIBILITY-02** Chơi trọn được bằng bàn phím: vào lượt, vỗ cánh, và từ màn thua tới được "Chơi lại" bằng `Tab` rồi `Enter`; focus luôn nhìn thấy được (vòng focus).
- **REQ-ACCESSIBILITY-03** Nút chỉ có icon có tên đọc được (nút âm thanh ở header: `aria-label` + `title`); icon trang trí bị ẩn khỏi trình đọc màn hình.
- **REQ-ACCESSIBILITY-04** Cài đặt là hộp thoại modal có tên "Cài đặt"; mở ra thì focus ở nút đóng; nhóm độ khó có nhãn "Độ khó" và mỗi nút báo trạng thái chọn (`aria-pressed`); âm thanh là công tắc (`switch`, `aria-checked`).
- **REQ-ACCESSIBILITY-05** Người dùng bật giảm chuyển động (`prefers-reduced-motion`) thì ba bàn tay nhịp ở màn sẵn sàng đứng yên.
- **REQ-ACCESSIBILITY-06** Trang khai báo ngôn ngữ tiếng Việt (`lang="vi"`) và có tiêu đề "Duck Flap".
