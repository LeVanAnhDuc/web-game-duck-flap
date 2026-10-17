import type { RngState } from "./types";

/**
 * mulberry32 — bộ sinh số ngẫu nhiên thuần, gieo hạt được.
 * Trả về cả giá trị lẫn state kế tiếp để world giữ được tính thuần
 * (cùng state đầu vào luôn cho ra cùng chuỗi ống, nên test được).
 */
export const nextRandom = (state: RngState): [number, RngState] => {
  let t = (state + 0x6d2b79f5) >>> 0;
  const next = t;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  const value = ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  return [value, next];
};

/** Số thực ngẫu nhiên trong [min, max). */
export const randomBetween = (
  state: RngState,
  min: number,
  max: number
): [number, RngState] => {
  const [value, next] = nextRandom(state);
  return [min + value * (max - min), next];
};

export const createSeed = (): RngState => (Math.random() * 0xffffffff) >>> 0;
