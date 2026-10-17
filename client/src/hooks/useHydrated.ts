"use client";

// libs
import { useEffect, useState } from "react";

/**
 * `false` ở lần render đầu, `true` sau khi mount xong.
 *
 * Dùng cho mọi giá trị đọc từ localStorage: bản build là static export nên lần render
 * đầu chạy lúc build, nơi không có localStorage. Hiển thị đúng giá trị mặc định
 * (giống hệt server) rồi mới đổi sang giá trị thật — tránh lệch hydration mà không
 * cần `suppressHydrationWarning`.
 *
 * Đây là hook chứ KHÔNG phải ghost (R-04): nó sinh ra state dùng trong render, không
 * phải một side-effect thuần. Ghost là thứ `return null`.
 */
export const useHydrated = (): boolean => {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  return hydrated;
};
