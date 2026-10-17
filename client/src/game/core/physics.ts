import {
  BIRD_ROTATION_DOWN,
  BIRD_ROTATION_UP,
  ROTATION_VELOCITY_RANGE
} from "./constants";
import type { Bird, Tuning } from "./types";

const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max);

/**
 * Góc nghiêng chỉ là hàm của vận tốc, không có state riêng: nhờ vậy
 * tua lại state ở bất kỳ thời điểm nào cũng vẽ ra đúng tư thế con chim.
 */
export const computeRotation = (velocityY: number): number => {
  const t = clamp(
    (velocityY + ROTATION_VELOCITY_RANGE) / (2 * ROTATION_VELOCITY_RANGE),
    0,
    1
  );
  return BIRD_ROTATION_UP + (BIRD_ROTATION_DOWN - BIRD_ROTATION_UP) * t;
};

/**
 * Tích phân Euler nửa ẩn: cập nhật vận tốc trước rồi mới dời vị trí.
 * Cách này ổn định hơn Euler thường khi dt thay đổi, và quan trọng hơn
 * là khiến cú vỗ cánh có hiệu lực ngay trong cùng một bước.
 */
export const applyGravity = (bird: Bird, dt: number, tuning: Tuning): Bird => {
  const velocityY = Math.min(
    bird.velocityY + tuning.gravity * dt,
    tuning.maxFallSpeed
  );

  return {
    ...bird,
    velocityY,
    y: bird.y + velocityY * dt,
    rotation: computeRotation(velocityY)
  };
};

/**
 * Vỗ cánh ĐẶT vận tốc chứ không cộng dồn, đúng như bản gốc: mỗi cú vỗ
 * cho cùng một lực nâng bất kể chim đang rơi nhanh cỡ nào.
 */
export const applyFlap = (bird: Bird, tuning: Tuning): Bird => ({
  ...bird,
  velocityY: tuning.flapVelocity,
  rotation: computeRotation(tuning.flapVelocity)
});
