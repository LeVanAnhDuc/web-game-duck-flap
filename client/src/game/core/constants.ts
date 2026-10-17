import type { Difficulty, Tuning } from "./types";

/**
 * Thế giới game dùng hệ toạ độ logic cố định 288x512 (tỉ lệ của bản gốc,
 * cũng gần đúng 9:16 của điện thoại dựng đứng). Mọi thiết bị chơi trên
 * cùng một kích thước logic rồi mới scale ra pixel thật, nên độ khó và
 * điểm số công bằng như nhau ở mọi màn hình.
 */
export const WORLD_WIDTH = 288;
export const WORLD_HEIGHT = 512;

/** Chiều cao dải đất ở đáy. Vùng bay thực tế là 0 .. WORLD_HEIGHT - GROUND_HEIGHT. */
export const GROUND_HEIGHT = 112;

/** Mép dưới của vùng bay. */
export const FLOOR_Y = WORLD_HEIGHT - GROUND_HEIGHT;

/** Chim luôn đứng yên theo trục X, thế giới cuộn về phía nó. */
export const BIRD_X = 64;
export const BIRD_START_Y = FLOOR_Y / 2;

/** Kích thước hình vẽ của chim. */
export const BIRD_WIDTH = 34;
export const BIRD_HEIGHT = 24;

/**
 * Hitbox nhỏ hơn hình vẽ một chút. Đây là thủ thuật kinh điển của game
 * arcade: người chơi cảm thấy "suýt thoát" thay vì "bị ăn gian".
 */
export const BIRD_HITBOX_WIDTH = 26;
export const BIRD_HITBOX_HEIGHT = 18;

export const PIPE_WIDTH = 52;

/** Khe hở không bao giờ sát mép trên/dưới quá mức này. */
export const PIPE_MARGIN_TOP = 48;
export const PIPE_MARGIN_BOTTOM = 24;

/** Góc nghiêng tối đa khi bay lên / lao xuống (radian). */
export const BIRD_ROTATION_UP = -0.5;
export const BIRD_ROTATION_DOWN = 1.4;

/** Vận tốc rơi tương ứng với góc chúi xuống tối đa. */
export const ROTATION_VELOCITY_RANGE = 520;

/** Biên độ và tốc độ nhấp nhô của chim ở màn hình chờ. */
export const IDLE_BOB_AMPLITUDE = 6;
export const IDLE_BOB_SPEED = 4;

/** Nền trời cuộn chậm hơn mặt đất để tạo chiều sâu. */
export const BACKGROUND_PARALLAX = 0.35;

const TUNING: Record<Difficulty, Tuning> = {
  easy: {
    gravity: 1250,
    flapVelocity: -380,
    maxFallSpeed: 520,
    scrollSpeed: 100,
    pipeGapHeight: 132,
    pipeSpacing: 200
  },
  normal: {
    gravity: 1400,
    flapVelocity: -400,
    maxFallSpeed: 560,
    scrollSpeed: 125,
    pipeGapHeight: 108,
    pipeSpacing: 175
  },
  hard: {
    gravity: 1600,
    flapVelocity: -420,
    maxFallSpeed: 620,
    scrollSpeed: 158,
    pipeGapHeight: 92,
    pipeSpacing: 162
  }
};

export const getTuning = (difficulty: Difficulty): Tuning => TUNING[difficulty];

export const DIFFICULTIES: Difficulty[] = ["easy", "normal", "hard"];

/**
 * Bước mô phỏng cố định. Vật lý luôn chạy ở 120Hz bất kể màn hình 30Hz,
 * 60Hz hay 144Hz, nên hành vi game giống hệt nhau trên mọi máy.
 */
export const FIXED_TIMESTEP = 1 / 120;

/** Trần số bước mỗi frame, tránh "vòng xoáy tử thần" khi tab bị treo lâu. */
export const MAX_STEPS_PER_FRAME = 5;
