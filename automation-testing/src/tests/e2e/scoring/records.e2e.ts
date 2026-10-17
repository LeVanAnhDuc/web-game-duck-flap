import { test, expect } from "@/fixtures";
import { copy } from "@/data/copy";
import { STORAGE } from "@/data/test-data";

// Design spec §7: one record table per difficulty, `flappy-bird:best:<difficulty>`; only a score strictly above the
// record is a record. Points are scored with gamePage.autopilot (decisions/scoring.md Q1).

test("điểm vượt kỷ lục thì có huy hiệu, kỷ lục mới hiện và được lưu", { tag: ["@TC-SCORING-002", "@smoke"] }, async ({
  gamePage,
}) => {
  await gamePage.useFakeClock();
  await gamePage.goto();
  await gamePage.play();
  await gamePage.flap();
  expect(await gamePage.autopilot(1)).toBe(1);
  await gamePage.letGo();

  const score = (await gamePage.gameOverScore().textContent())!;
  expect(Number(score)).toBeGreaterThanOrEqual(1);
  await expect(gamePage.newBestBadge()).toHaveText(copy.gameOver.newBest);
  await expect(gamePage.overlayBest()).toHaveText(score);
  await expect(gamePage.headerBest()).toHaveText(score);
  expect(await gamePage.storedBest("normal")).toBe(score);

  await gamePage.reload();
  await expect(gamePage.headerBest()).toHaveText(score);
});

test("điểm thấp hơn kỷ lục thì không phải kỷ lục", { tag: ["@TC-SCORING-003"] }, async ({ gamePage }) => {
  await gamePage.useFakeClock();
  await gamePage.goto({ storage: { [STORAGE.best("normal")]: "50" } });
  await gamePage.play();
  await gamePage.flap();
  expect(await gamePage.autopilot(1)).toBe(1);
  await gamePage.letGo();

  await expect(gamePage.newBestBadge()).toHaveCount(0);
  await expect(gamePage.overlayBest()).toHaveText("50");
  await expect(gamePage.headerBest()).toHaveText("50");
  expect(await gamePage.storedBest("normal")).toBe("50");
});

test("điểm bằng kỷ lục (0 = 0) không phải kỷ lục mới", { tag: ["@TC-SCORING-004"] }, async ({ gamePage }) => {
  await gamePage.useFakeClock();
  await gamePage.goto({ storage: { [STORAGE.best("normal")]: "0" } });
  await gamePage.playUntilGameOver();
  await expect(gamePage.gameOverScore()).toHaveText("0");
  await expect(gamePage.newBestBadge()).toHaveCount(0);
  expect(await gamePage.storedBest("normal")).toBe("0");
});

test("kỷ lục lập ở mức Dễ không đụng tới bảng mức Thường", { tag: ["@TC-SCORING-005"] }, async ({ gamePage }) => {
  await gamePage.useFakeClock();
  await gamePage.goto({
    storage: {
      [STORAGE.settings]: JSON.stringify({ soundEnabled: true, difficulty: "easy" }),
      [STORAGE.best("normal")]: "5",
    },
  });
  await gamePage.play();
  await gamePage.flap();
  expect(await gamePage.autopilot(1)).toBe(1);
  await gamePage.letGo();

  const score = (await gamePage.gameOverScore().textContent())!;
  await expect(gamePage.newBestBadge()).toBeVisible();
  expect(await gamePage.storedBest("easy")).toBe(score);
  expect(await gamePage.storedBest("normal")).toBe("5");
});

test("huy hiệu kỷ lục mới không theo sang lượt sau", { tag: ["@TC-SCORING-006"] }, async ({ gamePage }) => {
  await gamePage.useFakeClock();
  await gamePage.goto();
  await gamePage.play();
  await gamePage.flap();
  expect(await gamePage.autopilot(1)).toBe(1);
  await gamePage.letGo();
  await expect(gamePage.newBestBadge()).toBeVisible();

  await gamePage.restartButton().click();
  await expect(gamePage.ready()).toBeVisible();
  await gamePage.flap();
  await gamePage.letGo();
  await expect(gamePage.gameOverScore()).toHaveText("0");
  await expect(gamePage.newBestBadge()).toHaveCount(0);
});
