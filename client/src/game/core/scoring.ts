import { PIPE_WIDTH } from "./constants";
import type { Pipe } from "./types";

/**
 * Cờ `passed` nằm trên chính ống chứ không phải một bộ đếm riêng: đó là
 * cách duy nhất chắc chắn mỗi ống chỉ được tính điểm đúng một lần, kể cả
 * khi một frame chạy nhiều bước mô phỏng liên tiếp.
 */
export const updateScore = (
  pipes: Pipe[],
  birdX: number,
  score: number
): { pipes: Pipe[]; score: number; scored: boolean } => {
  let nextScore = score;
  const nextPipes = pipes.map((pipe) => {
    if (pipe.passed || birdX <= pipe.x + PIPE_WIDTH) {
      return pipe;
    }

    nextScore += 1;
    return { ...pipe, passed: true };
  });

  return { pipes: nextPipes, score: nextScore, scored: nextScore !== score };
};
