import type { Difficulty } from "@/game/core/types";

export type Settings = {
  soundEnabled: boolean;
  difficulty: Difficulty;
};

export const DEFAULT_SETTINGS: Settings = {
  soundEnabled: true,
  difficulty: "normal"
};

export interface SettingsRepository {
  load(): Settings;
  save(settings: Settings): void;
}
