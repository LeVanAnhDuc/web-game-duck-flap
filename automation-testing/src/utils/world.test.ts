import { test, expect } from "@playwright/test";
import { shouldFlap } from "./world";

const pipe = (left: number, gapTop: number, gapBottom: number) => ({ left, right: left + 52, gapTop, gapBottom });

test("autopilot holds the middle of the sky before any pipe", () => {
  expect(shouldFlap({ birdY: 200, pipes: [] })).toBe(false);
  expect(shouldFlap({ birdY: 230, pipes: [] })).toBe(true);
});

test("autopilot flaps only once the bird sinks into the bottom quarter of the next gap", () => {
  const p = pipe(150, 100, 208);
  expect(shouldFlap({ birdY: 170, pipes: [p] })).toBe(false);
  expect(shouldFlap({ birdY: 190, pipes: [p] })).toBe(true);
});

test("autopilot aims at the pipe after one the bird has already cleared", () => {
  const passed = pipe(-10, 50, 158);
  const next = pipe(160, 250, 358);
  expect(shouldFlap({ birdY: 200, pipes: [passed, next] })).toBe(false);
});

test("autopilot flaps a frame early for a bird falling fast", () => {
  const p = pipe(150, 100, 208);
  expect(shouldFlap({ birdY: 175, pipes: [p] }, 174)).toBe(false);
  expect(shouldFlap({ birdY: 175, pipes: [p] }, 160)).toBe(true);
});

test("autopilot never flaps for a bird it cannot see", () => {
  expect(shouldFlap({ birdY: null, pipes: [] })).toBe(false);
});
