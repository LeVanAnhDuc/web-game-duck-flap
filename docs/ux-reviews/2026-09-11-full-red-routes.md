# Duck Flap — UX persona review · 2026-09-11

> 7 phiên tính điểm (+2 phiên phải chạy lại do lỗi dụng cụ) · 7 persona · 5 Red Route
> Công cụ trình duyệt: **playwright (hạng 1)** — không rơi hạng về năng lực (đủ cả 7: goto 101 ms,
> Space 9 ms, screenshot 378 ms, viewport 375×720 dpr 2 touch bật, throttle Slow 4G cắn thật
> 2047 ms/123 KB). **Nhưng có một giới hạn cứng:** server chỉ một instance / một context → 7 phiên
> chạy **tuần tự**; và `browser_click`/CDP `Input.dispatchTouchEvent` **treo khi vòng lặp hoạt hình
> của game đang chạy** → **không đo được bất kỳ thao tác nào đòi phản xạ trong-lượt-chơi**.
> Red route chốt ngày: 2026-09-11
> Đích đo: bản deploy <https://levananhduc.github.io/web-game-duck-flap/> dựng từ `main`.

## Ấn tượng đầu

Tính trên toàn bộ persona — ấn tượng đầu chỉ xảy ra một lần.

| Thước | Kết quả |
| --- | --- |
| Đoán đúng đây là trang gì | **6/7** — sai duy nhất là Ông Tám (p07): *"Chắc là cái gì cháu nó gửi cho coi hình con vịt vậy thôi, **không biết để làm gì**."* |
| Dám nhập email | **0/7** — không ai trả lời "có". 4/7 trả lời kiểu "không có chỗ nào để nhập nên khỏi phải nghĩ" (Tuấn, Hạnh, Linh, Liên); **3/7 nói thẳng là sẽ không đưa** (Ngân, Phát, Ông Tám) |
| Lý do người không dám | Ngân: *"mà có đòi chắc tôi cũng lướt qua không cho."* · Phát: *"nếu có thì chắc tôi ngại — **trông như sản phẩm cá nhân nhỏ**, không phải thứ tôi tin tưởng để đưa thông tin."* · Ông Tám: *"nếu bắt nhập chắc tôi không dám, **sợ máy nó lấy mất gì đó của mình**."* |

**Ba từ trước khi dùng:** tò mò (5/7) · đơn giản (4/7) · một nhóm từ dè chừng lặp ở **5/7**:
*hơi vội* (Ngân), *hơi lo* (Hạnh), *hơi cảnh giác/dè dặt* (Linh), *hơi ngại* (Liên), *hơi ngại* (Ông Tám)

**Ba từ sau khi dùng:** **yên tâm** (Tuấn, Linh, Liên — **3/7**, từ tích cực lặp nhiều nhất) ·
nhẹ nhõm (Ngân, Linh) · rõ ràng, minh bạch, hài lòng, dễ chịu · **chán** (Phát, Ông Tám — **2/7**,
từ tiêu cực lặp) · bối rối, ngại thử tiếp (Ông Tám) · hờ hững (Phát) · bực, thất vọng, mất tin tưởng (Hạnh)

**Đổi theo hướng:**

- **Tốt lên rõ ở 3 người** có nỗi sợ được gỡ bằng một câu chữ đặt đúng chỗ: Tuấn, Linh, Liên.
- **Xấu đi ở Ông Tám** — **hợp lệ hoàn toàn**, không dính lỗi dụng cụ.
- **Xấu đi ở Hạnh** — ba từ này sinh ra từ một **kết luận SAI do dụng cụ đo**; không dùng làm bằng
  chứng chống lại tính năng tạm dừng. Phần dùng được: *nếu* một người thật không tìm ra cách tạm
  dừng, họ rời bỏ **ở đúng mức độ này**.
- **Không đổi ở Phát** — đúng kỳ vọng với negative persona; từ "chán" của anh **không** tính là tín hiệu hỏng.

## Bảng điểm theo Red Route

| Red Route | Hiệu quả | Hiệu suất | Hài lòng |
| --- | --- | --- | --- |
| **RR-01** Ghi một điểm | **Đạt một nửa.** Vế "màn kết thúc hiện điểm + kỷ lục, đọc được": **ĐẠT**. Vế "bộ đếm nhảy 0 → ≥1": **KHÔNG KẾT LUẬN ĐƯỢC** (giới hạn dàn đo) | 21 hành động / min_steps 4 — **không so sánh được** | "yên tâm, vẫn hơi tiếc, dễ chịu". Liên **không đổ lỗi cho game** |
| **RR-02** Đổi độ khó, kỷ lục riêng | **1/1 ĐẠT** (cả hai vế) | **2 / 2** — đúng `min_steps` | "yên tâm, rõ ràng, minh bạch" — cao nhất lượt chạy |
| **RR-03** Tạm dừng rồi chơi tiếp | **Cơ chế ĐẠT đủ 3 vế** (kiểm chứng máy, tái lập được) · **persona tự đạt 0/1** — do **dụng cụ** | 28 lệnh / min_steps 3 — **không so sánh được** | "bực, thất vọng, mất tin tưởng" — **ô nhiễm bởi kết luận sai** |
| **RR-04** Tắt tiếng | **1/1 ĐẠT** (3/3 vế) | **1 / 1** — đúng `min_steps` | "nhẹ nhõm, yên tâm, hài lòng" |
| **RR-05** Điện thoại, chạm nhanh | **1/1 ĐẠT** (4/4 vế) | 25 hành động / min_steps 4 — **không đọc được thành hiệu suất thật** | "hồi hộp, hơi khó chịu, nhẹ nhõm" |

*Hai phiên mù (p06, p07) không gắn Red Route — chúng đo "người lạ tự mò thì ra cái gì".*

## Phát hiện

### F-01 · **High** · Trigger words · Interaction Design · ISO 9241-11

**Ở đâu:** Phiên mù p07 — màn hình bắt đầu lượt chơi, 375×720, Slow 4G.

**Chuyện gì xảy ra:** Câu "**Chạm để bay**" được Ông Tám hiểu là **một lệnh đã hoàn tất**, không phải
một nhịp phải lặp lại. Ông bấm "Chơi", màn chơi hiện ra, ông **ngồi đợi** cho game "chạy", vịt rơi,
"Hết lượt" điểm 0. Làm lại y hệt lần hai rồi bỏ cuộc — **không phải vì hết kiên nhẫn, mà vì không
hiểu**. Persona duy nhất **đoán sai** đây là trang gì, và là persona duy nhất thất bại mà **không**
dính lỗi dụng cụ: dù máy nhanh tới đâu ông cũng thua, vì ông **không bao giờ nghĩ tới cú chạm thứ hai**.

**Dẫn chứng:** Ông Tám bước 3 — *"chắc bấm vậy là xong, để coi nó chạy."* → bước 4 — *"ủa, **tôi có
bấm gì nữa đâu, sao tự nhiên hết vậy ta?**"* → *"'Chạm để bay lên' = chạm mấy cái?" → **Một cái.**"*;
*"Hiểu vì sao vịt rơi không? → **Không**"*. Ông **đổ cho cái máy**: *"chắc cái máy này nó vậy,
**không phải tại mình đâu**, hay là tại mạng chậm."* Bước 1: chạm vào **dòng chữ** chứ không chạm nút
(*"vì nó là chữ, đọc được"*).

Ảnh: `2026-09-11-anh/p07-blind-3-sau-cham-choi.png`, `p07-blind-4-dang-choi-doi.png` — màn bắt đầu chỉ
có **một** biểu tượng bàn tay tĩnh + dòng "Chạm để bay", **không gợi ý tính lặp lại**.
`p07-blind-6-het-luot-boi-roi.png`, `p07-blind-2-cham-chu-huong-dan.png`.

**Bao nhiêu người vấp:** 1/7 (không nâng bậc). Vẫn **High** vì nó **chặn hoàn toàn `done_when` của
RR-01** với đúng nhóm README nhắm tới khi nói "mở từ một cái link ai đó gửi", và hậu quả là rời bỏ
vĩnh viễn: *"tự mình mở lại chắc cũng vậy, thua hoài không biết vì sao thì thôi khỏi chơi."*

**Hướng xử lý:** Chỗ hỏng nằm ở **từ ngữ** và ở **phản hồi của lần chạm đầu**, không nằm ở độ khó.
Cần cách nói cho thấy đây là **hành động lặp**, và cho người chơi thấy **hậu quả của việc không chạm
tiếp** trước khi nó thành thua cuộc.

---

### F-02 · **High** (Medium, nâng một bậc vì 2 persona cùng vấp) · Visual hierarchy · Visual craft · LATCH

**Ở đâu:** Header mọi màn hình — ô "biểu tượng cúp + con số" góc trên phải.

**Chuyện gì xảy ra:** Con số kỷ lục là **chữ nhỏ nhất toàn trang (13px)**, trong khi tiêu đề trong
khung là 34px. Nhãn "điểm cao nhất" kích thước **1×1 px** — chỉ trình đọc màn hình thấy. Người **nhìn
bằng mắt** chỉ thấy **một biểu tượng cúp và một con số trần**. Hậu quả không chỉ là khó đọc mà là
**hiểu sai trục thông tin**.

**Dẫn chứng:** Cô Liên — *"con số '0' nhỏ ở góc trên [...] **bé hơn hẳn phần chữ còn lại** [...]
**tôi phải nhìn thật kỹ mới đọc ra được**."* và cô đoán *"cái ô điểm ở góc chắc là điểm mình đang
có"* — **đoán sai**, đó là kỷ lục. Ba từ sau khi dùng giữ lại chữ "tiếc" đúng vì chuyện này.
Ông Tám — *"mấy chữ tiếng Việt thì **nhỏ xíu**."*

Ảnh: `2026-09-11-anh/00-identity-check-1440x900.png`, `00-lab-check-375x720.png`,
`p05-RR-01-01-mo-trang.png` (720×450 = zoom 200%).

Cỡ chữ đo được: tiêu đề 34px · nút "Chơi" 16px · tên game header 15px · câu hướng dẫn 14px ·
**số kỷ lục header 13px ← nhỏ nhất toàn trang**.

**Bao nhiêu người vấp:** 2/7 → nâng một bậc lên **High**.

**Hướng xử lý:** Một con số không có nhãn nhìn-thấy-được thì người dùng phải đoán, và họ đoán sai.
Điểm đối chiếu tích cực đã có sẵn trong chính sản phẩm: màn "Hết lượt" làm **đúng**.

---

### F-03 · **Medium** (Low, nâng một bậc vì 2 persona cùng vấp) · Trigger words · Interaction Design · Visual craft

**Ở đâu:** RR-04 và RR-01 — nút tắt/bật tiếng ở header và bản sao cạnh nút "Chơi".

**Chuyện gì xảy ra:** Nhãn viết theo **hành động sẽ xảy ra** ("Tắt âm thanh") chứ không theo **trạng
thái hiện tại**, và trên màn hình nút này **chỉ là một biểu tượng loa, không có chữ**. Người sợ tiếng
động phải **bấm thử mới biết** — đúng thứ họ muốn tránh. RR-04 vẫn ĐẠT → điểm gợn, không phải điểm chặn.

**Dẫn chứng:** Linh — *"tôi đoán là hiện tại tiếng đang BẬT [...] nhưng thú thật nhìn cái nút thôi thì
**tôi không chắc 100%** [...] 'chắc là vậy, thử bấm xem sao'."*
Cô Liên — *"**tôi không rõ nó đổi màu hay đổi chữ để báo**, nên nếu chỉ dựa màu thì tôi khó biết đang
bật hay tắt."*

Đối chiếu: trong hộp Cài đặt, cùng chức năng ấy **lại có chữ "Âm thanh" kèm công tắc rõ ràng** — hai
cách nói về cùng một thứ ở hai chỗ.

**Bao nhiêu người vấp:** 2/7 → nâng một bậc lên **Medium**.

**Hướng xử lý:** Quyết một lần cho toàn sản phẩm: nút này nói **trạng thái** hay nói **hành động**.
Hộp Cài đặt đã có sẵn cách nói tốt hơn.

---

### F-04 · **Medium** · Interaction Design · Visual hierarchy · Trigger words

**Ở đâu:** RR-03 và RR-02 — màn hình menu đầu tiên (màn hình tĩnh, **đo được bình thường**).

**Chuyện gì xảy ra:** (a) bấm **Space** ở menu **không làm gì cả**; (b) **Tab lần đầu rơi vào nút
"Tắt âm thanh"**, phải Tab lần hai mới tới "Chơi". Với người chỉ dùng bàn phím, đường vào lượt chơi
không phải đường ngắn nhất, và phím mà cả thể loại này dạy người ta bấm lại là phím không ăn.

**Dẫn chứng:** Hạnh — *"Tôi tưởng bấm Space là bắt đầu ngay được (như Flappy Bird cổ điển) [...]
**không có gì xảy ra**"* và *"con trỏ nhảy vào nút 'Tắt âm thanh' ở góc trên trước [...] **Hơi bất ngờ
vì nút chính đáng ra phải được ưu tiên trước**."*
Tuấn — *"Bấm Space ở màn hình menu → không có gì xảy ra"*; Tuấn (có chuột) đọc chuyện này là **"an toàn"**.

**Bao nhiêu người vấp:** 2/7 gặp, nhưng **chỉ 1/7 trải nghiệm nó như ma sát**. Vì hai persona muốn hai
thứ ngược nhau, **không áp dụng luật nâng bậc** — giữ **Medium**, và ghi rõ sự bất đồng thay vì làm
tròn nó thành phát hiện to hơn thực tế.

**Hướng xử lý:** "Space ở menu" là quyết định sản phẩm, không phải lỗi hiển nhiên. Riêng **thứ tự tiêu
điểm** chỉ có một chiều đúng: hành động chính nên đứng trước. Giữ nguyên điểm tốt: Hạnh khen viền tiêu
điểm — *"có viền sáng active rõ ràng, **cái này thì tốt**"*.

---

### F-05 · **Low** · Interaction Design

**Ở đâu:** Màn "Hết lượt" trên điện thoại 375×720.

**Chuyện gì xảy ra:** Phản xạ đầu tiên của người chơi mobile là **chạm bừa vào giữa màn hình để chơi
lại** mà không tìm nút. Cú chạm đó rơi ra ngoài nút và **không có phản hồi nào**.

**Dẫn chứng:** Ngân — *"bấm bừa vào giữa màn hình để chơi lại (**đúng phản xạ, không nhìn nút Chơi lại
nằm đâu**) — hoá ra bấm trật, không trúng nút gì, **màn hình đứng yên không phản hồi**."*
(Quan sát này nói về **vùng bấm trên màn hình tĩnh**, không về tốc độ → hợp lệ dù phiên p01 lần 1 đã huỷ.)

**Bao nhiêu người vấp:** 1/7. Không cản trở — cả Ngân lẫn Ông Tám sau đó đều bấm trúng "Chơi lại".

**Hướng xử lý:** Quyết xem vùng ngoài hộp nên là vùng chết hay nhận cú chạm phản xạ. **Lưu ý mặt trái:**
Cô Liên khen chính việc màn này **không tự biến mất** — bất kỳ thay đổi nào cũng phải giữ được điều đó.

---

### F-06 · **Medium** · Visual hierarchy · Trigger words · Trust & desirability

**Ở đâu:** Màn hình đầu — tiêu đề "Duck Flap" 34px, thành phần to nhất trang.

**Chuyện gì xảy ra:** Thứ **to nhất, sáng nhất, đứng đầu** là một cụm **tiếng Anh**. Câu duy nhất giải
thích trang này là gì chỉ có **14px**, đặt dưới và mờ hơn. Với người trình độ số thấp, **thông điệp
chính không tới**.

**Dẫn chứng:** Ông Tám — *"**chữ nước ngoài (Duck Flap) tôi không đọc được**, còn mấy chữ tiếng Việt
thì nhỏ xíu"* và *"không biết để làm gì"*.
Ảnh: `2026-09-11-anh/00-identity-check-1440x900.png`.

**Bao nhiêu người vấp:** 1/7. Để **Medium** vì nó không tự mình chặn ai, nhưng góp vào một lần đoán sai
— và theo `lib/frameworks.md`, đoán sai là *"thước gắt nhất của trang chủ"*.

**Hướng xử lý:** Quyết xem trên màn hình đầu, **tên thương hiệu** hay **câu nói trò này là gì** mới là
thứ đáng được nhìn thấy trước.

## Không phát hiện được gì ở

- **RR-02 — sạch, và là điểm sáng nhất lượt chạy.** Đúng `min_steps` = 2, 0 quay lui, 0 bấm hụt. Câu
  *"Mỗi độ khó có bảng kỷ lục riêng. Đổi độ khó là đổi luôn kỷ lục đang hiển thị."* gỡ đúng nỗi sợ của
  Tuấn trước khi cậu kịp lo. **Ví dụ mẫu nên nhân bản sang ô cúp ở F-02.**
- **RR-04 — sạch cả ba vế.** *"không phải mò vào 'Cài đặt' tìm"*; sau reload *"trang **nhớ** được là
  tôi đã tắt"*.
- **RR-05 — sạch.** Ba thứ giết game vỗ-cánh trên mobile đều bị chặn ở tầng CSS/meta
  (`user-scalable=no, maximum-scale=1`; `scrollHeight == innerHeight` + `body overflow:hidden` +
  `overscroll-behavior-y: none`; `touch-action: none` + `user-select: none`). Ngân xác nhận bằng trải nghiệm.
- **Phóng to 200% — sạch.** Không cuộn ngang, không cuộn dọc ở 720×450. Gỡ đúng nỗi sợ lớn nhất của Cô Liên.
- **Màn "Hết lượt" — làm đúng, đừng đụng vào.** *"có ghi rõ hai chữ 'Điểm' và 'Kỷ lục' [...] **không bị
  lẫn, vì có chữ ghi rõ chứ không chỉ dựa màu sắc**"*, và nó *"đứng yên (không tự biến mất)"*.
- **Lớp phủ tạm dừng — làm đúng, kiểm chứng ba cách.** "**Tạm dừng** · Nhấn P hoặc Esc để chơi tiếp ·
  [Tiếp tục]" — vừa nói trạng thái, vừa dạy phím, vừa cho một nút bấm được bằng chuột.
- **Visual craft — người khó tính nhất về thẩm mỹ không tìm ra lỗi nào.** Phát (dân thiết kế):
  *"giống một sản phẩm nhỏ đã hoàn thiện chứ không giống bài tập viết vội"* · *"không đến mức thô hay
  giả — màu sắc nhẹ nhàng, hợp tông"* · *"không thấy chỗ nào chật chội hay thừa thãi"* · *"mọi thứ nhìn
  cùng một 'gu'"*. Project không có `.claude/uiux/` nên không có token để đối chiếu.
- **Console: 0 lỗi, 0 cảnh báo ở cả 7/7 phiên** — kể cả trên Slow 4G và zoom 200%.
- **Một quan sát KHÔNG tính là phát hiện:** trên desktop 1440×900, khung chơi là cột dọc hẹp giữa hai
  dải nền tối. **Không persona nào nhắc tới**, và người có thẩm quyền thẩm mỹ nói ngược lại. Theo luật
  chống bịa, đây là quan sát của người viết báo cáo, **không phải phát hiện**.
- **Phát bỏ đi trong chưa tới 1 phút = XÁC NHẬN THIẾT KẾ ĐÚNG.** `personas/p06` viết sẵn luật đọc, kết
  quả rơi đúng vào vế "đúng thiết kế". Đáng chú ý cho LATCH: anh vét cạn toàn bộ sản phẩm trong **một
  bước** (nút Cài đặt) và tự tin là đã thấy hết — điểm mạnh về kiến trúc thông tin.

## Ghi chú về chính lần chạy này

**1. Sự cố dụng cụ đo — đã chẩn đoán, đã chữa, và nó cắt mất một phần phạm vi.**
Giả thuyết ban đầu ("server suy giảm sau ~40 lệnh") **sai**. Chẩn đoán đúng: `browser_click` và cả CDP
`Input.dispatchTouchEvent` **treo khi vòng lặp hoạt hình của game đang chạy**; trên màn hình tĩnh thì
phản hồi tức thì. **Cú bấm vẫn ăn thật**, chỉ là công cụ không nhận được xác nhận.
Đã loại khỏi báo cáo: 13/18 cú chạm timeout của Ngân và toàn bộ cảm nhận độ trễ của cô; hai lượt 0 điểm
của Tuấn (chính cậu quy cho dụng cụ). **Kết luận "không tạm dừng được" của Hạnh là SAI ở cả hai lần chạy.**

**2. Giới hạn cứng — hai vế của Red Route không đo được.**
Vịt chết vì trọng lực trong **~1,5–2 giây** sau một cú vỗ cánh; độ trễ giữa hai lệnh của persona-agent
là **vài giây**. Nên **không persona nào ghi nổi một điểm**, và **không persona nào bấm kịp phím tạm
dừng**. `persona-rules.md` §8.3 đã ghi trước: *"'Persona chết nhanh' không phải một phát hiện UX."*
**RR-01 chỉ đạt một nửa** — không bịa ra con số Hiệu quả cho vế không đo được.
Ngoại lệ: **F-01 (Ông Tám) không dính giới hạn này.**

**3. Chạy tuần tự.** Server chỉ một instance → 7 phiên chạy lần lượt. Tốn thời gian, **không cắt phạm
vi**: cả 5 Red Route đều được chạm tới, cộng 2 phiên mù. Giữa các phiên: đóng page, xoá
localStorage/cookies, dựng lại viewport + touch + throttle.

**4. Một câu CHƯA GIẢI ĐƯỢC — cần kiểm lại bằng tay.**
*"Chuyển tab giữa lượt mà **không** kịp bấm tạm dừng thì có mất lượt không?"* — phép đo 2 giây ẩn tab
cho kết quả **không tái lập** (một lần sống, một lần chết), vì ở mốc ≥2 giây trọng lực đã chi phối.
Trường hợp *đã* bấm tạm dừng rồi mới chuyển tab thì **an toàn** (tái lập được).
Đây **đúng là nỗi sợ số một của Hạnh** và **đúng là lời hứa README** "Pause, and never lose a run by
accident" (`README.md:40`). Chừng nào chưa trả lời được, **RR-03 chưa coi là đã kiểm xong**.

**5. Trần của phương pháp.** Dàn 7 persona này là **proto-persona** — không có phỏng vấn người thật nào
đứng sau (`persona-rules.md` §2). Báo cáo này **thu hẹp danh sách câu hỏi cần hỏi năm người thật**, nó
**không thay** năm người đó. Với F-01 và F-02, hai người cần tìm ngoài đời: một người trình độ số thấp
mở game từ link người nhà gửi, và một người dùng phóng đại màn hình.

---

**Log thô từng phiên:** `2026-09-11-logs/` · **Ảnh của phát hiện High:** `2026-09-11-anh/`
Bản gốc đầy đủ (kèm mọi ảnh): `.claude/skills/ux-persona-review/runs/2026-09-11/` (gitignored)
