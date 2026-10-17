"use client";

// libs
import { useEffect } from "react";

/**
 * Esc đóng lớp phủ đang mở. Ghost: chỉ chạy side-effect, không vẽ gì (R-04).
 *
 * Listener chỉ được gắn khi `active` — engine dùng Space/chuột để vỗ cánh, nên một
 * listener bàn phím sống suốt phiên là hai luồng bàn phím giẫm chân nhau.
 *
 * Ghost này render vô điều kiện và tự tắt bằng prop `active`, KHÔNG được gắn sau một
 * `&&` ở chỗ gọi: mount/unmount theo điều kiện thì tháo và gắn lại listener mỗi lần
 * lớp phủ đóng mở, còn ở đây `useEffect` đã lo đúng việc đó rồi.
 */
const CloseOnEscape = ({
  active,
  onClose
}: {
  active: boolean;
  onClose: () => void;
}) => {
  useEffect(() => {
    if (!active) {
      return;
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active, onClose]);

  return null;
};

export default CloseOnEscape;
