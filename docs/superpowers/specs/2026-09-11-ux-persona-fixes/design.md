# Sửa 6 phát hiện UX từ persona review 2026-09-11

Liên quan: `docs/ux-reviews/2026-09-11-full-red-routes.md` (F-01…F-06) ·
`docs/superpowers/specs/2026-09-03-flappy-bird-design.md` §9 (YAGNI)

Ngày: 2026-09-11
Trạng thái: đã duyệt wireframe, đang triển khai

## 1. Vì sao làm

Bảy phiên persona mù trên bản deploy sinh ra 6 phát hiện, hai trong đó mức High.
Không phát hiện nào đụng vào §9 "Phạm vi cố ý bỏ qua" của spec gốc — đây là việc
thiết kế, không phải việc phạm vi.

## 2. Đối chiếu phát hiện → thay đổi

| # | Mức | Gốc trong code | Thay đổi |
| --- | --- | --- | --- |
| F-01 | High | `GameStage` ready-overlay: một `<Hand>` nảy + "Chạm để bay" | Ba nhịp nối nhau + "Chạm liên tục để bay" + câu phụ nói cơ chế. Thêm dòng giải thích ở màn thua **chỉ khi điểm = 0** |
| F-02 | High | `Header`: `text-[13px]`, nhãn `sr-only` | Nhãn "Kỷ lục" **nhìn thấy được**, cỡ chữ 13→15px |
| F-03 | Medium | Nút loa chỉ có icon + `aria-label` theo hành động | Thêm chữ trạng thái nhìn thấy được ở menu ("Bật"/"Tắt"); header thêm `title` |
| F-04a | Medium | `input.ts` bắt `Space` ở `window` và `preventDefault()` vô điều kiện | `Space` ở menu **bắt đầu lượt** (chỉ bàn phím, không đổi ngữ nghĩa chạm) |
| F-04b | Medium | `Header` đứng trước `game-container` trong DOM → Tab đầu vào nút loa | `autoFocus` nút Chơi ở menu |
| F-05 | Low | Màn thua: chạm ngoài hộp không phản hồi | Chạm ngoài hộp làm hộp **nháy một cái** — KHÔNG tự chơi lại |
| F-06 | Medium | `MenuOverlay`: h1 34px tiếng Anh, tagline 14px mờ | h1 34→28px, tagline 14→16px và sáng hơn |

## 2b. Bug thứ bảy, tìm ra trong lúc làm — và nó trả lời câu hỏi bỏ ngỏ của báo cáo

Báo cáo persona để ngỏ một câu, ghi rõ là "chưa giải được, cần kiểm bằng tay":

> *"Chuyển tab giữa lượt mà **không** kịp bấm tạm dừng thì có mất lượt không?"* — đo hai
> giây ẩn tab cho kết quả **không tái lập**: một lần vịt còn sống, một lần vịt chết.

**Nguyên nhân đã tìm ra bằng cách đọc code:** `GameEngine.bindVisibility` chỉ tự dừng khi
`phase === "playing"`, **không gồm `"ready"`**. Mà phase chỉ chuyển sang `"playing"` ở bước
mô phỏng KẾ TIẾP sau cú vỗ đầu tiên. Ai vỗ một cái rồi chuyển tab trong khe hở chưa tới một
frame đó sẽ mất lượt; ai chuyển tab muộn hơn vài mili-giây thì được cứu. Đó chính là lý do
phép đo không tái lập được — nó phụ thuộc vào việc phép đo rơi vào bên nào của khe hở.

`useGameEngine.togglePause` **đã** gộp `"ready"` và ghi chú thẳng lý do. Handler visibility
bị bỏ sót cùng cách xử lý ấy.

→ Sửa: gộp `"ready"` vào điều kiện tự dừng.
→ Test: `e2e/ux-fixes.spec.ts` "chuyển tab ngay sau cú vỗ đầu tiên thì KHÔNG mất lượt".
   Phải bắn phím vỗ cánh và `visibilitychange` trong **cùng một tác vụ đồng bộ**; tách làm
   hai lệnh Playwright thì rAF đã kịp chen vào và bài test đi ngang qua con bug. Đã xác minh
   test **đỏ trên code chưa sửa, xanh sau khi sửa**.

Đây là lời hứa `README.md:40` — "Pause, and never lose a run by accident".

## 3. Ba quyết định cần ghi lại

### 3.1 F-04a chỉ áp cho bàn phím, không áp cho chạm

`bindInput` gắn `pointerdown` lên chính `game-container`. Nếu cho cú chạm ở menu
khởi động lượt thì mọi cú chạm vào nền menu — kể cả chạm hụt khi định bấm Cài đặt —
đều vào thẳng game. Hạnh (nỗi đau thật) dùng bàn phím, nên sửa đúng đường bàn phím.
→ `InputBindingOptions` thêm `onKeyboardFlap?`, mặc định rơi về `onFlap`.

### 3.2 F-05 nháy chứ không tự chơi lại

Cô Liên khen đúng việc màn thua **đứng yên, không tự biến mất** để cô đọc kịp. Cho
chạm-ngoài-hộp tự chơi lại sẽ phá mất điều đó và còn cướp lượt của người đọc chậm.
Nháy hộp dạy được chỗ cần bấm mà không lấy mất quyền quyết định.

### 3.3 Dùng nhánh, không dùng worktree

`feature-flow` §3 gọi `using-git-worktrees`. Ở đây dùng nhánh thường vì bộ e2e cần
`node_modules`, mà một worktree mới thì không có — cài lại chỉ để chạy test là cái
giá không đáng. Yêu cầu cốt lõi "không commit lên `main`" vẫn giữ nguyên.

## 4. Không đụng vào

- `src/game/core/**` — vật lý, va chạm, sinh ống, tính điểm: không thay đổi.
- Độ khó và ngưỡng: không thay đổi. F-01 là vấn đề **từ ngữ và phản hồi**, không
  phải vấn đề độ khó. Không ai trong bảy persona nói game quá khó.
- `aria-label` của nút loa giữ nguyên dạng **hành động** + `aria-pressed` — đó là
  ARIA đúng cho nút gạt; phần thiếu là chữ cho người **nhìn bằng mắt**.

## 5. Cách kiểm

| Tầng | Chỗ nào |
| --- | --- |
| Vitest + happy-dom | `src/game/engine/input.test.ts` — `Space` ở menu gọi `onKeyboardFlap`, chạm thì không |
| Playwright e2e | `e2e/ux-fixes.spec.ts` — nhãn kỷ lục nhìn thấy được, Space khởi động lượt, Tab đầu tới nút Chơi, chữ trạng thái âm thanh, gợi ý khi điểm 0, nháy hộp khi chạm ngoài |
| Mắt người | Ảnh chụp thật ở 375 / 768 / 1024 / 1440 |
