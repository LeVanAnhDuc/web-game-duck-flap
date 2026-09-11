# p01 · Ngân · RR-05 — LẦN 1, ĐÃ HUỶ (lỗi dụng cụ đo)

> **Không dùng phần "Chuyện đã xảy ra" và "Con số" của file này để chấm sản phẩm.**
> Mọi `browser_click` trong phiên này timeout 5000 ms → Ngân chạm được ~0,2 lần/giây thay vì
> 4 lần/giây như persona định nghĩa. Xem `00-RUN-NOTES.md` §Sự cố đo lường.
> Phiên hợp lệ thay thế: `p01b-RR-05.md`.

## Phần VẪN CÒN GIÁ TRỊ — Ấn tượng 5 giây
(xảy ra trước khi chạm bất cứ thứ gì, nên không dính lỗi dụng cụ)

- **Đây là trang gì?** "Game con vịt bay qua ống, kiểu giống Flappy Bird."
- **Dành cho ai?** "Chắc dành cho mình, ai rảnh rỗi chơi giải trí, kiểu thách điểm với bạn bè."
- **Có dám nhập email không?** "Không thấy chỗ nào đòi nhập gì cả nên không phải lo, thấy nhẹ cả người."
- **Ba từ:** dễ thương, đơn giản, quen tay

## Phần vẫn còn giá trị — quan sát tĩnh

- Vào trang thấy ngay: chữ "Duck Flap", câu "Chạm để bay lên, luồn qua khe giữa hai ống,
  đừng chạm đất", nút vàng to "Chơi". Bấm Chơi liền, không đọc gì thêm.
- Màn "Hết lượt" hiện: "Mức Thường", "Điểm 0", "Kỷ lục 0", nút "Chơi lại", nút "Về menu".
- Một lần bấm vào giữa màn hình lúc "Hết lượt" mà không trúng nút nào → màn hình đứng yên,
  không phản hồi. Nguyên văn: *"bấm bừa vào giữa màn hình để chơi lại (đúng phản xạ, không
  nhìn nút Chơi lại nằm đâu) — hoá ra bấm trật, không trúng nút gì, màn hình đứng yên không
  phản hồi."*
  → Quan sát này **không** dính lỗi dụng cụ (nó nói về vùng bấm, không về tốc độ) và đáng xét.

## Console
```
Total messages: 0 (Errors: 0, Warnings: 0)
```

## Ảnh
- p01-RR-05-01-mo-trang.png — màn hình đầu, 375×720
- p01-RR-05-02-sau-bam-choi.png
- p01-RR-05-03-cham-lien-tuc.png — vịt nằm đất cạnh ống đầu tiên (dấu vết của lỗi dụng cụ)
- p01-RR-05-04-cuoi-bo-cuoc.png
