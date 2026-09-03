import { describe, expect, it } from "vitest";

import {
  FLOOR_Y,
  PIPE_MARGIN_BOTTOM,
  PIPE_MARGIN_TOP,
  PIPE_WIDTH
} from "./constants";
import { createPipe, movePipes, removeOffscreenPipes } from "./pipes";
import type { Pipe } from "./types";

const GAP_HEIGHT = 108;

const makePipe = (overrides: Partial<Pipe> = {}): Pipe => ({
  id: 1,
  x: 100,
  gapY: 150,
  gapHeight: GAP_HEIGHT,
  passed: false,
  ...overrides
});

describe("createPipe", () => {
  it("giữ khe hở trong biên trên/dưới cho phép", () => {
    const maxGapY = FLOOR_Y - PIPE_MARGIN_BOTTOM - GAP_HEIGHT;

    for (let seed = 0; seed < 200; seed += 1) {
      const [pipe] = createPipe(seed, 288, GAP_HEIGHT, seed);

      expect(pipe.gapY).toBeGreaterThanOrEqual(PIPE_MARGIN_TOP);
      expect(pipe.gapY).toBeLessThanOrEqual(maxGapY);
    }
  });

  it("gán id, x, gapHeight và cờ passed ban đầu", () => {
    const [pipe] = createPipe(7, 288, GAP_HEIGHT, 1234);

    expect(pipe.id).toBe(7);
    expect(pipe.x).toBe(288);
    expect(pipe.gapHeight).toBe(GAP_HEIGHT);
    expect(pipe.passed).toBe(false);
  });

  it("cùng seed cho cùng ống, và trả về state ngẫu nhiên kế tiếp", () => {
    const [first, nextRng] = createPipe(1, 288, GAP_HEIGHT, 42);
    const [again] = createPipe(1, 288, GAP_HEIGHT, 42);
    const [second] = createPipe(2, 288, GAP_HEIGHT, nextRng);

    expect(first).toEqual(again);
    expect(nextRng).not.toBe(42);
    expect(second.gapY).not.toBe(first.gapY);
  });
});

describe("movePipes", () => {
  it("dời ống sang trái theo tốc độ cuộn", () => {
    const pipes = [makePipe({ x: 100 }), makePipe({ id: 2, x: 200 })];
    const moved = movePipes(pipes, 0.5, 100);

    expect(moved.map((pipe) => pipe.x)).toEqual([50, 150]);
  });

  it("không đổi mảng đầu vào", () => {
    const pipes = [makePipe({ x: 100 })];
    const snapshot = structuredClone(pipes);
    movePipes(pipes, 0.5, 100);

    expect(pipes).toEqual(snapshot);
  });
});

describe("removeOffscreenPipes", () => {
  it("bỏ ống đã trôi hẳn khỏi mép trái", () => {
    const pipes = [
      makePipe({ id: 1, x: -PIPE_WIDTH - 1 }),
      makePipe({ id: 2, x: -PIPE_WIDTH }),
      makePipe({ id: 3, x: 10 })
    ];

    expect(removeOffscreenPipes(pipes).map((pipe) => pipe.id)).toEqual([2, 3]);
  });

  it("không đổi mảng đầu vào", () => {
    const pipes = [makePipe({ x: -1000 })];
    const snapshot = structuredClone(pipes);
    removeOffscreenPipes(pipes);

    expect(pipes).toEqual(snapshot);
  });
});
