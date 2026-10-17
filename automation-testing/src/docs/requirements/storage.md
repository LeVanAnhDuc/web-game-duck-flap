# STORAGE — Dữ liệu chỉ trên máy người chơi, và không bao giờ làm sập game

Truy vết phía app: README "No game accounts, no server" · design spec §2 (localStorage), §6 (storage bị chặn, dữ liệu hỏng,
hydration), §7 (khoá kỷ lục).

- **REQ-STORAGE-01** Cài đặt lưu trong localStorage của trình duyệt ở khoá `flappy-bird:settings`, dạng JSON `{ soundEnabled, difficulty }`.
- **REQ-STORAGE-02** Cài đặt hỏng (không phải JSON) thì dùng mặc định (Thường, âm thanh bật); hỏng một phần thì từng trường được hợp lệ hoá riêng — trường nào còn đúng thì giữ.
- **REQ-STORAGE-03** Kỷ lục rác (chữ, số âm, Infinity, rỗng) hiển thị là 0; số lẻ được làm tròn xuống.
- **REQ-STORAGE-04** Trình duyệt chặn localStorage (chế độ riêng tư, khoá dữ liệu trang) thì game vẫn mở với mặc định, kỷ lục 0, chơi trọn lượt không lỗi.
- **REQ-STORAGE-05** Không gì rời khỏi máy: cả một lượt chơi không có request nào ra ngoài trang (bản deploy, cờ đăng nhập tắt).
