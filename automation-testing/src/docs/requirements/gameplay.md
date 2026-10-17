# GAMEPLAY — Vòng một lượt chơi: menu, sẵn sàng, bay, thua, chơi lại

Truy vết phía app: design spec §1, §5 (vòng đời `menu → ready → playing → gameover → ready`), §6 (chạm trần không chết) ·
ux-persona-fixes F-01 / F-05 · README "The game itself".

- **REQ-GAMEPLAY-01** Mở trang là màn chờ (menu): thẻ có tên "Duck Flap", câu giải thích trò chơi, kỷ lục của độ khó đang chọn, nút "Chơi", "Cài đặt" và nút âm thanh; chưa có điểm trên màn hình.
- **REQ-GAMEPLAY-02** "Chơi" đưa vào màn sẵn sàng: lời dạy "Chạm liên tục để bay" kèm câu nói cơ chế, điểm 0 hiện trên đầu; chim chỉ nhấp nhô tại chỗ, đợi bao lâu cũng không rơi.
- **REQ-GAMEPLAY-03** Cú vỗ cánh đầu tiên bắt đầu lượt: lời dạy biến mất, điểm còn trên màn hình, ống bắt đầu trôi vào.
- **REQ-GAMEPLAY-04** Không vỗ nữa thì chim rơi xuống đất và lượt kết thúc: thẻ "Hết lượt" ghi mức độ khó, điểm của lượt và kỷ lục.
- **REQ-GAMEPLAY-05** Chạm trần không chết: chim bị chặn lại ở mép trên và lượt vẫn tiếp tục.
- **REQ-GAMEPLAY-06** Ở màn thua, "Chơi lại" vào ngay màn sẵn sàng của lượt mới với điểm 0; "Về menu" quay về màn chờ.
- **REQ-GAMEPLAY-07** Màn thua đứng yên tới khi người chơi chọn: không tự biến mất theo thời gian; chạm ra ngoài thẻ chỉ làm thẻ nháy (đếm được), không tự chơi lại; chạm trúng thẻ thì không nháy.
- **REQ-GAMEPLAY-08** Thua với 0 điểm thì thẻ thua giải thích vì sao vịt rơi ("Vịt rơi vì ngừng chạm…").
- **REQ-GAMEPLAY-09** Chơi trọn hai lượt (thua, chơi lại, thua) không sinh lỗi console hay lỗi trang nào.
