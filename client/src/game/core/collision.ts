import {
  BIRD_HITBOX_HEIGHT,
  BIRD_HITBOX_WIDTH,
  FLOOR_Y,
  PIPE_WIDTH
} from "./constants";
import type { Bird, Pipe, Rect } from "./types";

/**
 * Dùng so sánh chặt nên hai hình chạm mép nhau KHÔNG tính là va chạm.
 * Người chơi lách sát mép ống thì được thưởng, không bị phạt.
 */
export const aabbOverlap = (a: Rect, b: Rect): boolean =>
  a.x < b.x + b.width &&
  a.x + a.width > b.x &&
  a.y < b.y + b.height &&
  a.y + a.height > b.y;

export const getBirdHitbox = (bird: Bird): Rect => ({
  x: bird.x - BIRD_HITBOX_WIDTH / 2,
  y: bird.y - BIRD_HITBOX_HEIGHT / 2,
  width: BIRD_HITBOX_WIDTH,
  height: BIRD_HITBOX_HEIGHT
});

/** [ống trên, ống dưới]. Ống dưới dừng ở mặt đất chứ không chạm đáy màn. */
export const getPipeRects = (pipe: Pipe): [Rect, Rect] => {
  const gapBottom = pipe.gapY + pipe.gapHeight;

  return [
    { x: pipe.x, y: 0, width: PIPE_WIDTH, height: pipe.gapY },
    {
      x: pipe.x,
      y: gapBottom,
      width: PIPE_WIDTH,
      height: FLOOR_Y - gapBottom
    }
  ];
};

export const hitsGround = (bird: Bird): boolean =>
  bird.y + BIRD_HITBOX_HEIGHT / 2 >= FLOOR_Y;

export const hitsCeiling = (bird: Bird): boolean =>
  bird.y - BIRD_HITBOX_HEIGHT / 2 < 0;

/**
 * Chỉ ống và mặt đất mới giết chim. Đội trần chỉ bị chặn lại (world.ts lo),
 * giữ đúng cảm giác của bản gốc.
 */
export const checkCollision = (bird: Bird, pipes: Pipe[]): boolean => {
  const hitbox = getBirdHitbox(bird);

  return (
    hitsGround(bird) ||
    pipes.some((pipe) =>
      getPipeRects(pipe).some((rect) => aabbOverlap(hitbox, rect))
    )
  );
};
