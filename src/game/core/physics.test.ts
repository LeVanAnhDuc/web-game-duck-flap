import { describe, expect, it } from "vitest";

import {
  BIRD_ROTATION_DOWN,
  BIRD_ROTATION_UP,
  ROTATION_VELOCITY_RANGE,
  getTuning
} from "./constants";
import { applyFlap, applyGravity, computeRotation } from "./physics";
import type { Bird } from "./types";

const tuning = getTuning("normal");

const makeBird = (overrides: Partial<Bird> = {}): Bird => ({
  x: 64,
  y: 200,
  velocityY: 0,
  rotation: 0,
  ...overrides
});

describe("computeRotation", () => {
  it("trả góc ngẩng tối đa khi bay lên hết cỡ", () => {
    expect(computeRotation(-ROTATION_VELOCITY_RANGE)).toBeCloseTo(
      BIRD_ROTATION_UP
    );
  });

  it("trả góc chúi tối đa khi rơi hết cỡ", () => {
    expect(computeRotation(ROTATION_VELOCITY_RANGE)).toBeCloseTo(
      BIRD_ROTATION_DOWN
    );
  });

  it("nội suy tuyến tính ở giữa khoảng", () => {
    expect(computeRotation(0)).toBeCloseTo(
      (BIRD_ROTATION_UP + BIRD_ROTATION_DOWN) / 2
    );
  });

  it("kẹp hai đầu khi vận tốc vượt khoảng", () => {
    expect(computeRotation(-99999)).toBeCloseTo(BIRD_ROTATION_UP);
    expect(computeRotation(99999)).toBeCloseTo(BIRD_ROTATION_DOWN);
  });
});

describe("applyGravity", () => {
  it("tăng vận tốc rồi dời vị trí theo vận tốc mới", () => {
    const bird = makeBird();
    const dt = 0.1;
    const next = applyGravity(bird, dt, tuning);
    const expectedVelocity = tuning.gravity * dt;

    expect(next.velocityY).toBeCloseTo(expectedVelocity);
    expect(next.y).toBeCloseTo(bird.y + expectedVelocity * dt);
  });

  it("kẹp vận tốc rơi ở maxFallSpeed", () => {
    const bird = makeBird({ velocityY: tuning.maxFallSpeed });
    const next = applyGravity(bird, 1, tuning);

    expect(next.velocityY).toBe(tuning.maxFallSpeed);
  });

  it("cập nhật góc nghiêng theo vận tốc mới", () => {
    const next = applyGravity(makeBird(), 0.1, tuning);

    expect(next.rotation).toBeCloseTo(computeRotation(next.velocityY));
  });

  it("không đổi chim đầu vào", () => {
    const bird = makeBird();
    const snapshot = { ...bird };
    applyGravity(bird, 0.1, tuning);

    expect(bird).toEqual(snapshot);
  });
});

describe("applyFlap", () => {
  it("đặt vận tốc dọc bằng flapVelocity", () => {
    const next = applyFlap(makeBird({ velocityY: 300 }), tuning);

    expect(next.velocityY).toBe(tuning.flapVelocity);
  });

  it("không đổi chim đầu vào", () => {
    const bird = makeBird({ velocityY: 300 });
    const snapshot = { ...bird };
    applyFlap(bird, tuning);

    expect(bird).toEqual(snapshot);
  });
});
