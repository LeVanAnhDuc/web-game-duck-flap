import { WORLD_HEIGHT, WORLD_WIDTH } from "@/game/core/constants";

export type Viewport = {
  /** Hệ số phóng từ toạ độ logic sang pixel CSS. */
  scale: number;
  /** Lề canh giữa, tính bằng pixel CSS. */
  offsetX: number;
  offsetY: number;
  /** Kích thước canvas tính bằng pixel CSS. */
  cssWidth: number;
  cssHeight: number;
  dpr: number;
};

/**
 * Trên màn hình siêu nét, vẽ ở dpr 4 tốn gấp đôi số pixel của dpr 3 mà mắt
 * gần như không phân biệt được — kẹp lại để giữ frame rate.
 */
const MAX_DPR = 3;

/**
 * Sàn dpr là 1: backing store không bao giờ nhỏ hơn kích thước CSS,
 * tránh ảnh bị nhoè khi trình duyệt đang thu nhỏ.
 */
const MIN_DPR = 1;

/** Khung nhỏ hơn 1px (hoặc chưa đo được) vẫn phải cho ra số hữu hạn. */
const MIN_SIZE = 1;

const sanitizeSize = (value: number): number =>
  Number.isFinite(value) && value > MIN_SIZE ? value : MIN_SIZE;

const sanitizeDpr = (value: number): number => {
  if (!Number.isFinite(value) || value <= 0) return MIN_DPR;
  return Math.min(Math.max(value, MIN_DPR), MAX_DPR);
};

/**
 * Kiểu "contain": thế giới 288x512 vừa trọn trong khung và được canh giữa,
 * phần thừa để trống cho nền trang lấp. Nhờ vậy mọi thiết bị đều chơi trên
 * đúng một kích thước logic nên độ khó công bằng như nhau.
 */
export const computeViewport = (
  containerWidth: number,
  containerHeight: number,
  dpr: number
): Viewport => {
  const cssWidth = sanitizeSize(containerWidth);
  const cssHeight = sanitizeSize(containerHeight);
  const scale = Math.min(cssWidth / WORLD_WIDTH, cssHeight / WORLD_HEIGHT);

  return {
    scale,
    offsetX: (cssWidth - WORLD_WIDTH * scale) / 2,
    offsetY: (cssHeight - WORLD_HEIGHT * scale) / 2,
    cssWidth,
    cssHeight,
    dpr: sanitizeDpr(dpr)
  };
};

/** Đặt kích thước thật của canvas + transform sẵn sàng để vẽ theo toạ độ logic. */
export const resizeCanvas = (
  canvas: HTMLCanvasElement,
  viewport: Viewport
): void => {
  const width = Math.max(1, Math.round(viewport.cssWidth * viewport.dpr));
  const height = Math.max(1, Math.round(viewport.cssHeight * viewport.dpr));

  // Gán lại width/height sẽ xoá sạch canvas, nên chỉ đụng vào khi thật sự đổi.
  if (canvas.width !== width) canvas.width = width;
  if (canvas.height !== height) canvas.height = height;

  canvas.style.width = `${viewport.cssWidth}px`;
  canvas.style.height = `${viewport.cssHeight}px`;
};
