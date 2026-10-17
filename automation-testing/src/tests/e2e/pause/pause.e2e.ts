import { test, expect } from "@/fixtures";
import { copy } from "@/data/copy";
import { FALL_MS } from "@/data/test-data";

// README "Pause, and never lose a run by accident": P or Esc freezes the run and says so on screen. Every case runs on
// the paused fake clock, so "frozen" is checked over 30 s of game time in no real time.

test.beforeEach(async ({ gamePage }) => {
  await gamePage.useFakeClock();
  await gamePage.goto();
});

test("nhấn P giữa lượt thì tạm dừng và nói rõ trên màn hình", { tag: ["@TC-PAUSE-001", "@smoke"] }, async ({ gamePage }) => {
  await gamePage.play();
  await gamePage.flap();
  await gamePage.advance(100);
  await gamePage.flap("KeyP");
  await expect(gamePage.pauseOverlay()).toContainText(copy.pause.title);
  await expect(gamePage.pauseOverlay()).toContainText(copy.pause.hint);
  await expect(gamePage.resumeButton()).toBeVisible();
});

test("Esc cũng tạm dừng, kể cả ở màn sẵn sàng trước cú vỗ đầu", { tag: ["@TC-PAUSE-002"] }, async ({ gamePage }) => {
  await gamePage.play();
  await gamePage.flap("Escape");
  await expect(gamePage.pauseOverlay()).toBeVisible();
  await expect(gamePage.ready()).toHaveCount(0);
});

test("đang tạm dừng thì nửa phút sau chim vẫn đứng yên", { tag: ["@TC-PAUSE-003", "@smoke"] }, async ({ gamePage }) => {
  await gamePage.play();
  await gamePage.flap();
  await gamePage.advance(100);
  await gamePage.flap("KeyP");
  await expect(gamePage.pauseOverlay()).toBeVisible();
  const before = await gamePage.readWorld();

  await gamePage.advance(30_000);
  await expect(gamePage.gameOver()).toHaveCount(0);
  expect((await gamePage.readWorld()).birdY).toBe(before.birdY);
  await expect(gamePage.hudScore()).toHaveText("0");
});

test("bấm Tiếp tục thì lượt chạy tiếp", { tag: ["@TC-PAUSE-004", "@smoke"] }, async ({ gamePage }) => {
  await gamePage.play();
  await gamePage.flap();
  await gamePage.advance(100);
  await gamePage.flap("KeyP");
  await gamePage.resumeButton().click();
  await expect(gamePage.pauseOverlay()).toHaveCount(0);
  // proof the run really goes on rather than sitting frozen: the bird falls and the run ends
  await gamePage.letGo();
});

test("nhấn P lần nữa cũng chạy tiếp", { tag: ["@TC-PAUSE-005"] }, async ({ gamePage }) => {
  await gamePage.play();
  await gamePage.flap();
  await gamePage.advance(100);
  await gamePage.flap("KeyP");
  await expect(gamePage.pauseOverlay()).toBeVisible();
  await gamePage.flap("KeyP");
  await expect(gamePage.pauseOverlay()).toHaveCount(0);
  await gamePage.letGo();
});

test("P và Esc ở màn chờ hay màn thua không làm gì", { tag: ["@TC-PAUSE-008"] }, async ({ gamePage }) => {
  await gamePage.flap("KeyP");
  await expect(gamePage.menu()).toBeVisible();
  await expect(gamePage.pauseOverlay()).toHaveCount(0);

  await gamePage.play();
  await gamePage.flap();
  await gamePage.advance(FALL_MS);
  await expect(gamePage.gameOver()).toBeVisible();
  await gamePage.flap("KeyP");
  await gamePage.flap("Escape");
  await expect(gamePage.pauseOverlay()).toHaveCount(0);
  await expect(gamePage.gameOver()).toBeVisible();
});
