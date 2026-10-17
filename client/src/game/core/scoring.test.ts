import { describe, expect, it } from "vitest";

import { PIPE_WIDTH } from "./constants";
import { updateScore } from "./scoring";
import type { Pipe } from "./types";

const makePipe = (overrides: Partial<Pipe> = {}): Pipe => ({
  id: 1,
  x: 100,
  gapY: 150,
  gapHeight: 108,
  passed: false,
  ...overrides
});

describe("updateScore", () => {
  it("chưa cộng điểm khi chim mới chỉ chạm mép phải ống", () => {
    const pipes = [makePipe({ x: 100 })];
    const result = updateScore(pipes, 100 + PIPE_WIDTH, 0);

    expect(result.score).toBe(0);
    expect(result.scored).toBe(false);
    expect(result.pipes[0].passed).toBe(false);
  });

  it("cộng điểm và đánh dấu passed khi chim vượt mép phải ống", () => {
    const pipes = [makePipe({ x: 100 })];
    const result = updateScore(pipes, 100 + PIPE_WIDTH + 1, 0);

    expect(result.score).toBe(1);
    expect(result.scored).toBe(true);
    expect(result.pipes[0].passed).toBe(true);
  });

  it("không bao giờ cộng điểm hai lần cho cùng một ống", () => {
    const pipes = [makePipe({ x: 0 })];
    const first = updateScore(pipes, 200, 0);
    const second = updateScore(first.pipes, 200, first.score);
    const third = updateScore(second.pipes, 200, second.score);

    expect(first.score).toBe(1);
    expect(second.score).toBe(1);
    expect(second.scored).toBe(false);
    expect(third.score).toBe(1);
    expect(third.scored).toBe(false);
  });

  it("cộng đủ điểm khi vượt nhiều ống trong cùng một bước", () => {
    const pipes = [makePipe({ id: 1, x: 0 }), makePipe({ id: 2, x: 50 })];
    const result = updateScore(pipes, 200, 3);

    expect(result.score).toBe(5);
    expect(result.pipes.every((pipe) => pipe.passed)).toBe(true);
  });

  it("không đổi mảng ống đầu vào", () => {
    const pipes = [makePipe({ x: 0 })];
    const snapshot = structuredClone(pipes);
    updateScore(pipes, 200, 0);

    expect(pipes).toEqual(snapshot);
  });
});
