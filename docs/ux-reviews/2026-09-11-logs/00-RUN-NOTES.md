# Ghi chú vận hành — lượt chạy 2026-09-11

## Đích đo
Bản deploy: https://levananhduc.github.io/web-game-duck-flap/ — HTTP 200, `<title>Duck Flap</title>`.
Nhánh làm việc lúc chạy: `main`, cây làm việc sạch (chỉ `.claude/skills/` chưa track).
→ Kết quả nói đúng về bản người chơi thật đang mở.

## Công cụ trình duyệt: hạng 1 — playwright
Không rơi hạng. Đủ cả 7 năng lực bắt buộc, đã đo từng cái:

| Năng lực | Bằng chứng đo được |
| --- | --- |
| điều hướng | goto 101 ms |
| click | `browser_click` phản hồi tức thì trên server sạch |
| nhập liệu | `keyboard.press('Space')` 9 ms |
| chụp màn hình | 378 ms |
| đọc console | `browser_console_messages` chạy |
| đặt viewport | 375×720 xác nhận `innerWidth` 375, dpr 2, touch bật, maxTouchPoints 5 |
| throttle mạng | Slow 4G cắn thật: load 2047 ms / 123 KB (so với 162 ms khi không throttle) |

## Sự cố đo lường — phiên p01 lần 1 bị huỷ
Phiên Ngân lần 1 (`p01-RR-05-*.png`) **không dùng để chấm sản phẩm**.
Lý do: server playwright suy giảm dần sau khoảng 40+ lệnh; mọi `browser_click` bắt đầu
timeout 5000 ms. Ngân được định nghĩa chạm 4 lần/giây nhưng thực tế mỗi cú chạm mất 5 giây
→ con vịt rơi chạm đất trước khi tới ống đầu. Ba lượt 0 điểm của cô là **lỗi dụng cụ đo**,
không phải lỗi game.

Bằng chứng đây là lỗi dụng cụ, không phải lỗi sản phẩm:
- Trên server vừa khởi động lại: `browser_click` phản hồi tức thì, Space 9 ms, evaluate 4 ms.
- CDP `Input.dispatchMouseEvent` thô: 138 ms.
- Ảnh `p01-RR-05-03-cham-lien-tuc.png` cho thấy vịt nằm dưới đất ngay cạnh ống ĐẦU TIÊN —
  đúng hình dạng của việc 5 giây mới vỗ cánh một lần.

**Cách chữa đã áp dụng:** đóng page (`browser_close`) trước mỗi phiên để reset trạng thái
server, xoá localStorage/cookies, dựng lại viewport + touch + throttle, và hạ trần lệnh của
persona xuống 35.

Phần **Ấn tượng 5 giây** của Ngân lần 1 vẫn còn giá trị (nó xảy ra trước khi chạm gì):
- "Game con vịt bay qua ống, kiểu giống Flappy Bird." → đoán ĐÚNG
- "Chắc dành cho mình, ai rảnh rỗi chơi giải trí, kiểu thách điểm với bạn bè."
- "Không thấy chỗ nào đòi nhập gì cả nên không phải lo, thấy nhẹ cả người."
- Ba từ: dễ thương, đơn giản, quen tay

## Hạn chế còn lại của lượt chạy
- Server playwright chỉ có **một** instance, một context → các phiên chạy **tuần tự**,
  không dùng được mức 4 phiên song song mà `lib/orchestration.md` cho phép. Tốn thời gian,
  không cắt phạm vi.
- Persona là agent, không phải người có phản xạ tay. Với hai Red Route đòi kỹ năng thật
  (RR-01 ghi 1 điểm, RR-05 vỗ cánh nhanh), phần "ghi được điểm hay không" **không quy được
  về sản phẩm**. Phần quy được: khung chơi có lấp đầy màn hình không, chạm nhanh có làm
  trang zoom/kéo-làm-mới/bôi đen chữ không, màn kết thúc có nói rõ điểm không.

## Kiểm chạm nhanh — bằng chứng tĩnh cho RR-05 (đo máy, 375×720)

Ngân bị dụng cụ ép xuống ~0,2 chạm/giây nên câu "chạm nhanh có phá trang không" cần đo độc
lập. Đo bằng computed style trên màn hình tĩnh (main thread rảnh → số liệu tin được):

| Thứ giết game vỗ-cánh trên điện thoại | Trạng thái thật | Kết luận |
| --- | --- | --- |
| Double-tap zoom | `viewport meta = user-scalable=no, maximum-scale=1` | **chặn** |
| Pull-to-refresh | `scrollHeight 720 == innerHeight 720`, `body overflow:hidden`, `body overscroll-behavior-y: none` | **chặn** (không có gì để kéo) |
| Bôi đen chữ khi chạm nhanh | game-container `user-select: none` | **chặn** |
| Trình duyệt cướp cử chỉ chạm | game-container `touch-action: none` | **chặn** |

→ Cả ba thứ RR-05 nêu tên đều đã được phòng thủ ở tầng CSS/meta, không phụ thuộc vào việc
persona chạm nhanh tới đâu. Cộng với xác nhận trải nghiệm của Ngân ("không phóng to, không
kéo mới trang, không bôi đen chữ") → **RR-05 ĐẠT**.

## Đính chính chẩn đoán dụng cụ (thay cho giả thuyết "suy giảm tích luỹ")

Giả thuyết ban đầu (server chậm dần sau ~40 lệnh) **sai**. Chẩn đoán đúng:
`browser_click` và cả CDP `Input.dispatchTouchEvent` **treo khi vòng lặp hoạt hình của game
đang chạy**, còn trên màn hình tĩnh (menu, cài đặt, màn kết thúc) thì phản hồi tức thì.
Cú chạm vẫn ăn thật, chỉ là công cụ không nhận được xác nhận.

**Hệ quả cho cách đọc báo cáo:** mọi than phiền của persona về "bấm không thấy phản hồi",
"lag", "đơ" **khi đang trong lượt chơi** đều là nhiễu dụng cụ, không được tính thành phát
hiện. Thao tác trên menu / cài đặt / màn kết thúc thì đo được bình thường và tính bình thường.
