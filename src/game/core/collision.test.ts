import { describe, expect, it } from "vitest";

import {
  BIRD_HITBOX_HEIGHT,
  BIRD_HITBOX_WIDTH,
  FLOOR_Y,
  PIPE_WIDTH
} from "./constants";
import {
  aabbOverlap,
  checkCollision,
  getBirdHitbox,
  getPipeRects,
  hitsCeiling,
  hitsGround
} from "./collision";
import type { Bird, Pipe } from "./types";

const makeBird = (overrides: Partial<Bird> = {}): Bird => ({
  x: 64,
  y: 200,
  velocityY: 0,
  rotation: 0,
  ...overrides
});

const makePipe = (overrides: Partial<Pipe> = {}): Pipe => ({
  id: 1,
  x: 100,
  gapY: 150,
  gapHeight: 108,
  passed: false,
  ...overrides
});

describe("aabbOverlap", () => {
  it("trả true khi hai hình chồng nhau", () => {
    const a = { x: 0, y: 0, width: 10, height: 10 };
    const b = { x: 5, y: 5, width: 10, height: 10 };

    expect(aabbOverlap(a, b)).toBe(true);
  });

  it("trả false khi hai hình chỉ chạm mép ngang", () => {
    const a = { x: 0, y: 0, width: 10, height: 10 };
    const b = { x: 10, y: 0, width: 10, height: 10 };

    expect(aabbOverlap(a, b)).toBe(false);
    expect(aabbOverlap(b, a)).toBe(false);
  });

  it("trả false khi hai hình chỉ chạm mép dọc", () => {
    const a = { x: 0, y: 0, width: 10, height: 10 };
    const b = { x: 0, y: 10, width: 10, height: 10 };

    expect(aabbOverlap(a, b)).toBe(false);
    expect(aabbOverlap(b, a)).toBe(false);
  });

  it("trả false khi hai hình rời nhau", () => {
    const a = { x: 0, y: 0, width: 10, height: 10 };
    const b = { x: 50, y: 50, width: 10, height: 10 };

    expect(aabbOverlap(a, b)).toBe(false);
  });
});

describe("getBirdHitbox", () => {
  it("căn giữa quanh tâm chim", () => {
    const bird = makeBird({ x: 100, y: 200 });

    expect(getBirdHitbox(bird)).toEqual({
      x: 100 - BIRD_HITBOX_WIDTH / 2,
      y: 200 - BIRD_HITBOX_HEIGHT / 2,
      width: BIRD_HITBOX_WIDTH,
      height: BIRD_HITBOX_HEIGHT
    });
  });
});

describe("getPipeRects", () => {
  it("dựng ống trên từ đỉnh màn tới khe hở", () => {
    const pipe = makePipe();
    const [top] = getPipeRects(pipe);

    expect(top).toEqual({
      x: pipe.x,
      y: 0,
      width: PIPE_WIDTH,
      height: pipe.gapY
    });
  });

  it("dựng ống dưới từ đáy khe hở tới mặt đất", () => {
    const pipe = makePipe();
    const [, bottom] = getPipeRects(pipe);
    const gapBottom = pipe.gapY + pipe.gapHeight;

    expect(bottom).toEqual({
      x: pipe.x,
      y: gapBottom,
      width: PIPE_WIDTH,
      height: FLOOR_Y - gapBottom
    });
  });
});

describe("hitsGround", () => {
  it("true khi mép dưới hitbox chạm mặt đất", () => {
    expect(hitsGround(makeBird({ y: FLOOR_Y - BIRD_HITBOX_HEIGHT / 2 }))).toBe(
      true
    );
  });

  it("false khi chim còn lơ lửng", () => {
    expect(
      hitsGround(makeBird({ y: FLOOR_Y - BIRD_HITBOX_HEIGHT / 2 - 1 }))
    ).toBe(false);
  });
});

describe("hitsCeiling", () => {
  it("true khi mép trên hitbox vượt lên khỏi đỉnh màn", () => {
    expect(hitsCeiling(makeBird({ y: BIRD_HITBOX_HEIGHT / 2 - 1 }))).toBe(true);
  });

  it("false khi mép trên vừa chạm đỉnh màn", () => {
    expect(hitsCeiling(makeBird({ y: BIRD_HITBOX_HEIGHT / 2 }))).toBe(false);
  });
});

describe("checkCollision", () => {
  it("false khi chim lọt giữa khe hở", () => {
    const pipe = makePipe({ x: 50, gapY: 150, gapHeight: 108 });

    expect(checkCollision(makeBird({ x: 64, y: 200 }), [pipe])).toBe(false);
  });

  it("true khi chim đâm vào ống trên", () => {
    const pipe = makePipe({ x: 50, gapY: 150, gapHeight: 108 });

    expect(checkCollision(makeBird({ x: 64, y: 100 }), [pipe])).toBe(true);
  });

  it("true khi chim đâm vào ống dưới", () => {
    const pipe = makePipe({ x: 50, gapY: 150, gapHeight: 108 });

    expect(checkCollision(makeBird({ x: 64, y: 300 }), [pipe])).toBe(true);
  });

  it("true khi chim chạm đất dù không có ống", () => {
    expect(checkCollision(makeBird({ y: FLOOR_Y }), [])).toBe(true);
  });

  it("false khi chim đội trần — chạm trần không giết chim", () => {
    expect(checkCollision(makeBird({ y: -50 }), [])).toBe(false);
  });
});
