# SETTINGS — Bug log

## Đang mở

| Bug | Mức | TC | Tóm tắt |
|---|---|---|---|
| [BUG-SETTINGS-01](#bug-settings-01) | Trung bình | TC-SETTINGS-008 | Space trong hộp thoại cài đặt không bật công tắc mà bắt đầu một lượt phía sau hộp thoại |

### BUG-SETTINGS-01

- **TC:** TC-SETTINGS-008 · **Requirement:** REQ-SETTINGS-07
- **Bước tái hiện:** mở "Cài đặt" → `Tab` tới công tắc "Âm thanh" → `Space`.
- **Mong đợi:** công tắc đổi sang tắt; hộp thoại vẫn mở, màn chờ phía sau giữ nguyên.
- **Thực tế:** công tắc không đổi (`aria-checked` vẫn `true`); thẻ màn chờ biến mất và màn sẵn sàng của một lượt mới hiện
  ra **phía sau** hộp thoại vẫn đang mở. `bindInput` (`client/src/game/engine/input.ts`) bắt `Space` ở `window` và
  `preventDefault()` nó — nên trình duyệt không còn "bấm" nút đang focus — rồi `onKeyboardFlap` ở phase "menu" gọi
  `beginRun` (`client/src/hooks/useGameEngine.ts`) mà không biết hộp thoại đang mở. `isTypingTarget` chỉ miễn ô nhập liệu.
- **Ghi chú:** ghi ngày 2026-10-17. `Enter` trên công tắc vẫn đổi được trạng thái, nên người dùng bàn phím có lối khác,
  nhưng `Space` là phím chuẩn của `switch` và lượt bị khởi động ngầm sau một modal.

## Đã sửa

_(chưa có)_
