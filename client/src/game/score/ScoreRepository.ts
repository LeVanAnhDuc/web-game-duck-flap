import type { Difficulty } from "@/game/core/types";

/**
 * Cổng lưu điểm cao. Bản hiện tại chỉ có localStorage, nhưng interface
 * để bất đồng bộ ngay từ đầu để sau này cắm leaderboard online vào
 * không phải sửa lời gọi ở tầng trên.
 */
export interface ScoreRepository {
  getBest(difficulty: Difficulty): Promise<number>;
  /** Chỉ ghi khi điểm mới cao hơn. Trả về true nếu đã phá kỷ lục. */
  saveBest(difficulty: Difficulty, score: number): Promise<boolean>;
}
