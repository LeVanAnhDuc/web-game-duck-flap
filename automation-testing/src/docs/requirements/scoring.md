# SCORING — Điểm và kỷ lục theo độ khó

Truy vết phía app: design spec §7 (kỷ lục riêng cho từng độ khó, khoá `flappy-bird:best:<difficulty>`), §8 ("không cộng
điểm hai lần cho cùng một ống") · README "Three difficulties, three separate record tables".

- **REQ-SCORING-01** Mỗi ống chim lách qua được cộng đúng một điểm; điểm hiện ở đầu màn hình suốt lượt.
- **REQ-SCORING-02** Thẻ thua ghi đúng điểm của lượt; lượt có điểm thì không hiện lời giải thích "Vịt rơi vì ngừng chạm".
- **REQ-SCORING-03** Điểm cao hơn kỷ lục của độ khó đang chơi là kỷ lục mới: thẻ thua có huy hiệu "Kỷ lục mới!", kỷ lục trên thẻ và trên header đổi thành điểm đó, và được lưu (còn sau khi tải lại).
- **REQ-SCORING-04** Điểm bằng hoặc thấp hơn kỷ lục thì không phải kỷ lục: không huy hiệu, kỷ lục giữ nguyên.
- **REQ-SCORING-05** Mỗi độ khó một bảng kỷ lục: kỷ lục lập ở mức này không đổi kỷ lục của mức khác.
- **REQ-SCORING-06** Huy hiệu kỷ lục mới chỉ thuộc về lượt vừa lập; lượt sau không mang nó theo.
