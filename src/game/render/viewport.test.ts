import { describe, expect, it } from "vitest";

import { WORLD_HEIGHT, WORLD_WIDTH } from "@/game/core/constants";

import { computeViewport } from "./viewport";

const ASPECT = WORLD_WIDTH / WORLD_HEIGHT;

describe("computeViewport", () => {
  it("canh giữa theo chiều ngang khi khung rộng hơn thế giới", () => {
    const viewport = computeViewport(WORLD_WIDTH * 2, WORLD_HEIGHT, 1);

    expect(viewport.scale).toBe(1);
    expect(viewport.offsetX).toBe(WORLD_WIDTH / 2);
    expect(viewport.offsetY).toBe(0);
  });

  it("canh giữa theo chiều dọc khi khung cao hơn thế giới", () => {
    const viewport = computeViewport(WORLD_WIDTH, WORLD_HEIGHT * 2, 1);

    expect(viewport.scale).toBe(1);
    expect(viewport.offsetX).toBe(0);
    expect(viewport.offsetY).toBe(WORLD_HEIGHT / 2);
  });

  it("giữ nguyên tỉ lệ thế giới ở mọi khung", () => {
    const cases: [number, number][] = [
      [1000, 400],
      [320, 900],
      [288, 512],
      [37, 61]
    ];

    for (const [width, height] of cases) {
      const viewport = computeViewport(width, height, 1);
      const drawnWidth = width - viewport.offsetX * 2;
      const drawnHeight = height - viewport.offsetY * 2;

      expect(drawnWidth / drawnHeight).toBeCloseTo(ASPECT, 10);
      expect(drawnWidth).toBeLessThanOrEqual(width + 1e-9);
      expect(drawnHeight).toBeLessThanOrEqual(height + 1e-9);
    }
  });

  it("báo lại đúng kích thước canvas theo pixel CSS", () => {
    const viewport = computeViewport(500, 300, 2);

    expect(viewport.cssWidth).toBe(500);
    expect(viewport.cssHeight).toBe(300);
  });

  it("kẹp dpr ở mức 3", () => {
    expect(computeViewport(288, 512, 4).dpr).toBe(3);
    expect(computeViewport(288, 512, 3).dpr).toBe(3);
    expect(computeViewport(288, 512, 2).dpr).toBe(2);
  });

  it("đưa dpr không hợp lệ về 1", () => {
    expect(computeViewport(288, 512, Number.NaN).dpr).toBe(1);
    expect(computeViewport(288, 512, 0).dpr).toBe(1);
    expect(computeViewport(288, 512, -2).dpr).toBe(1);
    expect(computeViewport(288, 512, Number.POSITIVE_INFINITY).dpr).toBe(1);
    expect(computeViewport(288, 512, 0.5).dpr).toBe(1);
  });

  it("không sinh NaN với kích thước 0, âm hoặc NaN", () => {
    const cases: [number, number, number][] = [
      [0, 0, 1],
      [-100, -100, 1],
      [Number.NaN, Number.NaN, Number.NaN],
      [800, Number.NaN, 2],
      [Number.POSITIVE_INFINITY, 512, 1]
    ];

    for (const [width, height, dpr] of cases) {
      const viewport = computeViewport(width, height, dpr);

      for (const value of Object.values(viewport)) {
        expect(Number.isFinite(value)).toBe(true);
      }
      expect(viewport.scale).toBeGreaterThan(0);
      expect(viewport.dpr).toBeGreaterThan(0);
    }
  });
});
