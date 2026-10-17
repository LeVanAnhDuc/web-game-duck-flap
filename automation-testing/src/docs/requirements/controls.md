# CONTROLS — Vỗ cánh bằng phím, chuột và chạm

Truy vết phía app: README "Built for touch as much as for a keyboard" + bảng Controls · design spec §6 (overlay
`pointer-events: none`, chạm nhanh trên mobile) · ux-persona-fixes F-04a (§3.1: Space ở menu, chỉ bàn phím).

- **REQ-CONTROLS-01** `Space`, `↑` và `W` đều vỗ cánh: ở màn sẵn sàng, mỗi phím đều bắt đầu được lượt.
- **REQ-CONTROLS-02** Bấm chuột / chạm vào vùng chơi vỗ cánh. Lớp phủ không nuốt cú chạm: ở màn sẵn sàng và lúc đang bay, điểm giữa vùng chơi là canvas (HUD và lời dạy không nhận chạm).
- **REQ-CONTROLS-03** `Space` ở màn chờ bắt đầu lượt (vào màn sẵn sàng); bấm/chạm vào nền màn chờ ngoài các nút thì **không**.
- **REQ-CONTROLS-04** Giữ phím không thành một tràng vỗ cánh: phím lặp (auto-repeat) bị bỏ qua, giữ lâu = một cú vỗ.
- **REQ-CONTROLS-05** Phím vỗ cánh không cuộn trang (trình duyệt không nhận được hành vi mặc định của `Space`).
- **REQ-CONTROLS-06** Trên điện thoại chơi được trọn một lượt chỉ bằng chạm (nút "Chơi" và vùng chơi), và vùng chơi tắt cử chỉ của trình duyệt: không kéo/zoom (`touch-action: none`), không bôi chọn chữ.
