import { test, expect } from "@/fixtures";

// Design spec §8: one point per pipe, never twice. The bird is flown by gamePage.autopilot, which reads the canvas
// like a player does (decisions/scoring.md Q1) — no seed, no game state.

test("mỗi ống lách qua được đúng một điểm, thẻ thua ghi đúng điểm", { tag: ["@TC-SCORING-001", "@smoke"] }, async ({
  gamePage,
}) => {
  await gamePage.useFakeClock();
  await gamePage.goto();
  await gamePage.play();
  await gamePage.flap();

  expect(await gamePage.autopilot(1)).toBe(1);
  await expect(gamePage.hudScore()).toHaveText("1");
  expect(await gamePage.autopilot(2)).toBe(2);
  await expect(gamePage.hudScore()).toHaveText("2");

  await gamePage.letGo();
  await expect(gamePage.gameOverScore()).toHaveText("2");
  await expect(gamePage.zeroScoreHint()).toHaveCount(0);
});
