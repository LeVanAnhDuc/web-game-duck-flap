import {
  FLOOR_Y,
  PIPE_MARGIN_BOTTOM,
  PIPE_MARGIN_TOP,
  PIPE_WIDTH
} from "./constants";
import { randomBetween } from "./rng";
import type { Pipe, RngState } from "./types";

/**
 * Trả về cả state rng kế tiếp thay vì tự giữ: nhờ vậy cùng một seed luôn
 * sinh ra đúng một chuỗi ống, tái hiện lại được lượt chơi để debug.
 */
export const createPipe = (
  id: number,
  x: number,
  gapHeight: number,
  rng: RngState
): [Pipe, RngState] => {
  const [gapY, nextRng] = randomBetween(
    rng,
    PIPE_MARGIN_TOP,
    FLOOR_Y - PIPE_MARGIN_BOTTOM - gapHeight
  );

  return [{ id, x, gapY, gapHeight, passed: false }, nextRng];
};

/** Ống chạy về phía chim; chim không bao giờ dịch theo trục X. */
export const movePipes = (
  pipes: Pipe[],
  dt: number,
  scrollSpeed: number
): Pipe[] => pipes.map((pipe) => ({ ...pipe, x: pipe.x - scrollSpeed * dt }));

/** Dọn ống đã khuất hẳn để mảng không phình ra theo thời gian chơi. */
export const removeOffscreenPipes = (pipes: Pipe[]): Pipe[] =>
  pipes.filter((pipe) => pipe.x + PIPE_WIDTH >= 0);
