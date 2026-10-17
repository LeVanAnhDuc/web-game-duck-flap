// Constants and generators for test input. No .env, no network: values only.

export type Difficulty = "easy" | "normal" | "hard";
export const DIFFICULTIES: Difficulty[] = ["easy", "normal", "hard"];

// localStorage keys the game owns: ../client/src/game/settings/localSettingsRepository.ts (STORAGE_KEY) and
// ../client/src/game/score/localScoreRepository.ts (KEY_PREFIX + difficulty). The design spec §7 names them too.
export const STORAGE = {
  settings: "flappy-bird:settings",
  best: (d: Difficulty) => `flappy-bird:best:${d}`,
} as const;

// ../client/src/game/settings/types.ts → DEFAULT_SETTINGS
export const DEFAULT_SETTINGS = { soundEnabled: true, difficulty: "normal" as Difficulty } as const;

// The world: a fixed 288 × 512 logical box (README "Plays the same everywhere", design spec §4), scaled to fit with
// "contain". The ground strip starts at y = 400 (../client/src/game/core/constants.ts FLOOR_Y); the bird never moves
// along x (BIRD_X = 64). The tests read the canvas through these numbers, never through the game's code.
export const WORLD = { width: 288, height: 512, floorY: 400, birdX: 64, birdHitboxHalfWidth: 13 } as const;

// A bird left alone after its first flap reaches the ground in about a second (old suite: "Một lượt không vỗ cánh chỉ
// kéo dài khoảng một giây"). Fake-clock tests advance this much to be sure it has landed.
export const FALL_MS = 3_000;

// The flag-on e2e export (../client/scripts/build-e2e-auth.mjs) signs in against this fake issuer. It is never resolved:
// the issuer fixture answers every request to it (docs/decisions/0001-ducker-id-sign-in.md).
export const DUCKER = {
  issuer: "http://ducker.test",
  profilePath: "/profile",
  user: { sub: "u1", name: "Lê Văn Anh Đức", email: "duc@ducker.id" },
  pkceKey: "ducker.pkce",
} as const;
