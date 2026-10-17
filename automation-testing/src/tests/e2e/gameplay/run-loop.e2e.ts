import { test, expect } from "@/fixtures";
import { copy } from "@/data/copy";
import { FALL_MS } from "@/data/test-data";

// Design spec §5: menu → ready → playing → gameover → (restart) ready. Time-dependent cases run on the paused fake
// clock (gamePage.useFakeClock), so "a bird left alone lands" and "the ready screen waits forever" take no real time.

test("mở trang là màn chờ với tên game, lời giải thích, kỷ lục và ba nút", { tag: ["@TC-GAMEPLAY-001", "@smoke"] }, async ({
  gamePage,
}) => {
  await gamePage.goto();
  await expect(gamePage.menuTitle()).toHaveText(copy.menu.title);
  await expect(gamePage.menuTagline()).toHaveText(copy.menu.tagline);
  await expect(gamePage.menu()).toContainText(copy.menu.best("normal"));
  await expect(gamePage.overlayBest()).toHaveText("0");
  await expect(gamePage.playButton()).toBeVisible();
  await expect(gamePage.settingsButton()).toBeVisible();
  await expect(gamePage.menuSound()).toBeVisible();
  await expect(gamePage.hudScore()).toHaveCount(0);
});

test("bấm Chơi vào màn sẵn sàng, chim đợi mãi không rơi", { tag: ["@TC-GAMEPLAY-002", "@smoke"] }, async ({ gamePage }) => {
  await gamePage.useFakeClock();
  await gamePage.goto();
  await gamePage.play();
  await expect(gamePage.ready()).toContainText(copy.ready.title);
  await expect(gamePage.ready()).toContainText(copy.ready.hint);
  await expect(gamePage.hudScore()).toHaveText("0");

  await gamePage.advance(5_000);
  await expect(gamePage.ready()).toBeVisible();
  await expect(gamePage.gameOver()).toHaveCount(0);
  // it only bobs in place around the middle of the sky (y = 200 of a 400-high flight zone)
  const { birdY } = await gamePage.readWorld();
  expect(birdY).not.toBeNull();
  expect(Math.abs(birdY! - 200)).toBeLessThan(20);
});

test("vỗ cánh đầu tiên bắt đầu lượt và ống trôi vào", { tag: ["@TC-GAMEPLAY-003", "@smoke"] }, async ({ gamePage }) => {
  await gamePage.useFakeClock();
  await gamePage.goto();
  await gamePage.play();
  expect((await gamePage.readWorld()).pipes).toEqual([]);
  await gamePage.flap();
  await gamePage.advance(500);
  await expect(gamePage.ready()).toBeHidden();
  await expect(gamePage.hudScore()).toBeVisible();
  expect((await gamePage.readWorld()).pipes.length).toBeGreaterThan(0);
});

test("không vỗ nữa thì chim rơi xuống đất và hiện màn thua", { tag: ["@TC-GAMEPLAY-004", "@smoke"] }, async ({ gamePage }) => {
  await gamePage.useFakeClock();
  await gamePage.goto();
  await gamePage.play();
  await gamePage.flap();
  await gamePage.advance(FALL_MS);
  await expect(gamePage.gameOverCard()).toContainText(copy.gameOver.title);
  await expect(gamePage.gameOverCard()).toContainText(copy.gameOver.level("normal"));
  await expect(gamePage.gameOverScore()).toHaveText("0");
  await expect(gamePage.overlayBest()).toHaveText("0");
  await expect(gamePage.hudScore()).toHaveCount(0);
  await expect(gamePage.ready()).toHaveCount(0);
});

test("chạm trần chỉ bị chặn lại, lượt vẫn tiếp tục", { tag: ["@TC-GAMEPLAY-005"] }, async ({ gamePage }) => {
  await gamePage.useFakeClock();
  await gamePage.goto();
  await gamePage.play();
  // 1.5 s of flapping: the first pipe reaches the bird at ~1.7 s, and a top pipe would kill a bird at the ceiling
  for (let i = 0; i < 15; i += 1) {
    await gamePage.flap();
    await gamePage.advance(100);
  }
  await expect(gamePage.gameOver()).toHaveCount(0);
  const { birdY } = await gamePage.readWorld();
  expect(birdY).not.toBeNull();
  expect(birdY!).toBeLessThanOrEqual(16);
});

test("Chơi lại sau khi thua thì vào lượt mới với điểm 0", { tag: ["@TC-GAMEPLAY-006", "@smoke"] }, async ({ gamePage }) => {
  await gamePage.useFakeClock();
  await gamePage.goto();
  await gamePage.playUntilGameOver();
  await gamePage.restartButton().click();
  await expect(gamePage.ready()).toBeVisible();
  await expect(gamePage.hudScore()).toHaveText("0");
  await expect(gamePage.gameOver()).toHaveCount(0);
});

test("Về menu sau khi thua thì quay lại màn chờ", { tag: ["@TC-GAMEPLAY-007"] }, async ({ gamePage }) => {
  await gamePage.useFakeClock();
  await gamePage.goto();
  await gamePage.playUntilGameOver();
  await gamePage.toMenuButton().click();
  await expect(gamePage.menu()).toBeVisible();
  await expect(gamePage.gameOver()).toHaveCount(0);
});

test("chơi hai lượt liền không sinh lỗi nào trên console", { tag: ["@TC-GAMEPLAY-011"] }, async ({ page, gamePage }) => {
  const problems: string[] = [];
  // listeners before navigation, or errors during load slip through
  page.on("console", (m) => {
    if (m.type() === "error") problems.push(`console.error: ${m.text()}`);
  });
  page.on("pageerror", (e) => problems.push(`pageerror: ${e.message}`));
  await gamePage.goto();
  await gamePage.playUntilGameOver();
  await gamePage.restartButton().click();
  await expect(gamePage.ready()).toBeVisible();
  await gamePage.flap();
  await expect(gamePage.gameOver()).toBeVisible({ timeout: 15_000 });
  expect(problems).toEqual([]);
});
