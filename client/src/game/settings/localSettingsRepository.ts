import { DIFFICULTIES } from "@/game/core/constants";
import type { Difficulty } from "@/game/core/types";
import { getStorage } from "@/game/storage/safeStorage";

import type { Settings, SettingsRepository } from "./types";
import { DEFAULT_SETTINGS } from "./types";

const STORAGE_KEY = "flappy-bird:settings";

const isDifficulty = (value: unknown): value is Difficulty =>
  typeof value === "string" && DIFFICULTIES.includes(value as Difficulty);

/**
 * Hợp lệ hoá từng trường một chứ không phải cả object: dữ liệu cũ từ
 * phiên bản trước có thể thiếu trường mới, giữ lại được trường nào hay
 * trường đó thay vì vứt hết về mặc định.
 */
const parseSettings = (raw: string): Settings => {
  const value: unknown = JSON.parse(raw);
  if (typeof value !== "object" || value === null) {
    return DEFAULT_SETTINGS;
  }
  const record = value as Record<string, unknown>;
  return {
    soundEnabled:
      typeof record.soundEnabled === "boolean"
        ? record.soundEnabled
        : DEFAULT_SETTINGS.soundEnabled,
    difficulty: isDifficulty(record.difficulty)
      ? record.difficulty
      : DEFAULT_SETTINGS.difficulty
  };
};

export class LocalSettingsRepository implements SettingsRepository {
  load(): Settings {
    const storage = getStorage();
    if (!storage) {
      return DEFAULT_SETTINGS;
    }
    try {
      const raw = storage.getItem(STORAGE_KEY);
      if (raw === null) {
        return DEFAULT_SETTINGS;
      }
      return parseSettings(raw);
    } catch {
      return DEFAULT_SETTINGS;
    }
  }

  save(settings: Settings): void {
    const storage = getStorage();
    if (!storage) {
      return;
    }
    try {
      storage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {
      // Hết dung lượng hoặc bị chặn: cài đặt chỉ sống trong phiên này, không sao.
    }
  }
}
