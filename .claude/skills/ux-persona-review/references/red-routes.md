# Red Routes — Duck Flap

> Chốt ngày 2026-09-11. Đây là hợp đồng phạm vi: mọi lần chạy về sau đều so với file này.
> Sửa file này là mất khả năng so sánh giữa các lần chạy — chỉ sửa khi sản phẩm đổi bản chất.

**Quy ước `min_steps`:** số hành động người dùng trên đường đi tối ưu. Đoạn chơi thật
đếm bằng số thao tác tối thiểu của một người *đã biết chơi* thể loại đó.

**Quy ước `done_when`:** chỉ nói thứ nhìn thấy trên màn hình. Không nhắc tên hàm, tên
component, khoá lưu trữ — persona không được biết những thứ đó.

---

> **Lưu ý recon:** project này **không có** `docs/01-product/`. Mọi Red Route dưới đây
> suy ra từ `README.md` §Features và từ `docs/superpowers/specs/2026-09-03-flappy-bird-design.md`.
> Nếu sau này docs được dựng đủ, đối chiếu lại file này một lần.

## RR-01 · Bay qua được ống đầu tiên và ghi một điểm

- **id:** RR-01
- **name:** Bay qua được ống đầu tiên và ghi một điểm
- **actor:** người vừa mở link, chưa từng chơi Flappy Bird
- **entry:** `https://levananhduc.github.io/web-game-duck-flap/`
- **done_when:** bộ đếm điểm trên màn hình nhảy từ 0 lên **ít nhất 1**, rồi khi chết,
  màn kết thúc hiện điểm vừa đạt và điểm tốt nhất
- **min_steps:** 4 — 1 chạm để bắt đầu · 3 lần vỗ cánh để lách qua khe ống đầu
- **why_red:** toàn bộ sản phẩm là một hành động lặp lại. Nếu người chơi không ghi nổi
  một điểm trong ba lượt đầu thì họ đóng tab
- **status:** live
- **derived_from:** README.md:16 §Features "The game itself"

## RR-02 · Đổi độ khó và thấy bảng kỷ lục riêng của mức đó

- **id:** RR-02
- **name:** Đổi độ khó và thấy bảng kỷ lục riêng của mức đó
- **actor:** người đã chơi vài lượt ở mức mặc định
- **entry:** `https://levananhduc.github.io/web-game-duck-flap/`
- **done_when:** người chơi thấy điểm tốt nhất hiển thị **đổi theo mức vừa chọn**, và
  sau khi tải lại trang thì mức vừa chọn vẫn là mức đang chọn
- **min_steps:** 2 — mở chọn độ khó · chọn một mức khác
- **why_red:** ba bảng kỷ lục tách riêng là lời hứa lớn nhất README đưa ra. Người chơi
  hiểu nhầm thành một bảng chung thì mọi kỷ lục đều vô nghĩa với họ
- **status:** live
- **derived_from:** README.md:22 §Features "Three difficulties, three separate record tables"

## RR-03 · Tạm dừng giữa lượt rồi chơi tiếp đúng chỗ

- **id:** RR-03
- **name:** Tạm dừng giữa lượt rồi chơi tiếp đúng chỗ
- **actor:** người đang có lượt chơi tốt thì bị gọi
- **entry:** `https://levananhduc.github.io/web-game-duck-flap/`
- **done_when:** game đứng yên và **nói rõ trên màn hình** là đang tạm dừng; sau khi
  tiếp tục thì điểm vẫn nguyên và chim không chết vì khoảng thời gian đã dừng
- **min_steps:** 3 — bắt đầu lượt · bấm `P` hoặc `Esc` · tiếp tục
- **why_red:** mất một lượt kỷ lục vì chuyển tab là loại mất mát người chơi không tha
  thứ. README hứa thẳng "never lose a run by accident"
- **status:** live
- **derived_from:** README.md:40 §Features "Pause, and never lose a run by accident"

## RR-04 · Tắt tiếng trước khi tiếng đầu tiên phát ra

- **id:** RR-04
- **name:** Tắt tiếng trước khi tiếng đầu tiên phát ra
- **actor:** người mở game ở văn phòng
- **entry:** `https://levananhduc.github.io/web-game-duck-flap/`
- **done_when:** nút tắt tiếng nhìn thấy được **từ màn hình đầu tiên** (không phải chỉ
  trong cài đặt), bật được, và vẫn ở trạng thái tắt sau khi tải lại trang
- **min_steps:** 1 — bấm nút tắt tiếng trên header
- **why_red:** một game phát tiếng bất ngờ ở nơi công cộng bị đóng tab ngay lập tức,
  không có lần thứ hai
- **status:** live
- **derived_from:** README.md:45 §Features "Sound without a single audio file"

## RR-05 · Chơi trên điện thoại dọc, vỗ cánh thật nhanh

- **id:** RR-05
- **name:** Chơi trên điện thoại dọc, vỗ cánh thật nhanh
- **actor:** người cầm điện thoại một tay, đang đứng đợi
- **entry:** `https://levananhduc.github.io/web-game-duck-flap/` ở khung nhìn 375×720
- **done_when:** khu vực chơi **lấp đầy khung hình**, và người chơi chạm nhanh liên
  tiếp được mà trang không zoom, không kéo xuống làm mới, không bôi đen chữ
- **min_steps:** 4 — chạm bắt đầu · 3 lần chạm nhanh
- **why_red:** double-tap zoom và pull-to-refresh là hai thứ giết game vỗ-cánh trên
  điện thoại. Chúng chỉ lộ ra khi có người chạm thật nhanh
- **status:** live
- **derived_from:** README.md:28 §Features "Plays the same everywhere" · README.md:34
  §Features "Built for touch as much as for a keyboard"

---

## Đã loại khỏi mọi lượt chạy

| Route | Vì sao loại |
| --- | --- |
| Nghe bốn hiệu ứng WebAudio để xét "có hay không" | persona chạy trong trình duyệt headless, không nghe được |
| Đối chiếu vật lý ở 60Hz và 144Hz | phép đo kỹ thuật, không phải hành trình người dùng |
