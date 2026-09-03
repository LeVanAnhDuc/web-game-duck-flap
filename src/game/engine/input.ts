export type InputBindingOptions = {
  target: HTMLElement;
  onFlap: () => void;
  /** Bấm phím P hoặc Escape — tầng trên tự quyết làm gì. */
  onPause?: () => void;
};

const FLAP_CODES = new Set(["Space", "ArrowUp", "KeyW"]);
const PAUSE_CODES = new Set(["Escape", "KeyP"]);

/**
 * Khi con trỏ đang ở trong ô nhập liệu thì Space là ký tự trắng, không
 * phải lệnh vỗ cánh.
 */
const isTypingTarget = (target: EventTarget | null): boolean => {
  if (!(target instanceof HTMLElement)) {
    return false;
  }
  if (target.isContentEditable) {
    return true;
  }
  const tag = target.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT";
};

export const bindInput = (options: InputBindingOptions): (() => void) => {
  const { target, onFlap, onPause } = options;

  if (typeof window === "undefined") {
    return () => undefined;
  }

  const handleKeyDown = (event: KeyboardEvent) => {
    // Giữ phím sẽ bắn repeat liên tục, biến một cú nhấn thành cả tràng vỗ cánh.
    if (event.repeat || isTypingTarget(event.target)) {
      return;
    }
    if (FLAP_CODES.has(event.code)) {
      // Không chặn thì Space cuộn trang xuống mỗi lần vỗ cánh.
      event.preventDefault();
      onFlap();
      return;
    }
    if (onPause && PAUSE_CODES.has(event.code)) {
      event.preventDefault();
      onPause();
    }
  };

  /**
   * Chỉ dùng Pointer Events: đăng ký cả mousedown lẫn touchstart sẽ khiến
   * mobile bắn hai lần cho một cú chạm.
   */
  const handlePointerDown = (event: PointerEvent) => {
    // Chặn double-tap-to-zoom và thao tác kéo chọn trên mobile.
    event.preventDefault();
    onFlap();
  };

  window.addEventListener("keydown", handleKeyDown);
  target.addEventListener("pointerdown", handlePointerDown);

  return () => {
    window.removeEventListener("keydown", handleKeyDown);
    target.removeEventListener("pointerdown", handlePointerDown);
  };
};
