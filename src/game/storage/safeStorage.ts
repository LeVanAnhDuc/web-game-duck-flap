/**
 * localStorage vắng mặt khi render phía máy chủ và ném lỗi khi bị chặn
 * (chế độ ẩn danh, cookie bị khoá). Bọc lại một lần ở đây để mọi nơi khác
 * chỉ cần kiểm tra null thay vì rải try/catch khắp nơi.
 */
export const getStorage = (): Storage | null => {
  try {
    if (typeof window === "undefined" || !window.localStorage) {
      return null;
    }
    return window.localStorage;
  } catch {
    return null;
  }
};
