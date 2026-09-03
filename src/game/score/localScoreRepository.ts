import type { Difficulty } from "@/game/core/types";
import { getStorage } from "@/game/storage/safeStorage";

import type { ScoreRepository } from "./ScoreRepository";

const KEY_PREFIX = "flappy-bird:best:";

/**
 * Mỗi độ khó một khoá riêng: kỷ lục ở "easy" dễ hơn nhiều nên trộn chung
 * sẽ khiến kỷ lục "hard" không bao giờ hiện ra được.
 */
const keyFor = (difficulty: Difficulty): string => `${KEY_PREFIX}${difficulty}`;

const readNumber = (key: string): number => {
  const storage = getStorage();
  if (!storage) {
    return 0;
  }
  try {
    const raw = storage.getItem(key);
    if (raw === null) {
      return 0;
    }
    const parsed = Number(raw);
    // Giá trị rác (chữ, rỗng, âm, Infinity) đều quy về 0 thay vì làm hỏng UI.
    if (!Number.isFinite(parsed) || parsed < 0) {
      return 0;
    }
    return Math.floor(parsed);
  } catch {
    return 0;
  }
};

export class LocalScoreRepository implements ScoreRepository {
  async getBest(difficulty: Difficulty): Promise<number> {
    return readNumber(keyFor(difficulty));
  }

  async saveBest(difficulty: Difficulty, score: number): Promise<boolean> {
    if (!Number.isFinite(score) || score < 0) {
      return false;
    }
    const normalized = Math.floor(score);
    const key = keyFor(difficulty);
    const best = readNumber(key);
    if (normalized <= best) {
      return false;
    }
    const storage = getStorage();
    if (!storage) {
      // Không lưu được nhưng vẫn là kỷ lục trong phiên này, báo true để UI ăn mừng.
      return true;
    }
    try {
      storage.setItem(key, String(normalized));
    } catch {
      return true;
    }
    return true;
  }
}
