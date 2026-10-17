import { test, expect } from "@/fixtures";

// README: "Switching browser tabs pauses the game by itself, so you do not come back to a dead bird — including the
// sliver of a frame between your first flap and the run proper" (ux-persona-fixes §2b).

test.beforeEach(async ({ gamePage }) => {
  await gamePage.useFakeClock();
  await gamePage.goto();
  await gamePage.play();
});

test("chuyển tab giữa lúc bay thì không mất lượt, quay lại thì chạy tiếp", { tag: ["@TC-PAUSE-006", "@smoke"] }, async ({
  gamePage,
}) => {
  await gamePage.flap();
  await gamePage.advance(200);
  await gamePage.setTabHidden(true);
  // away far longer than a bird left alone lives
  await gamePage.advance(10_000);
  await gamePage.setTabHidden(false);
  await expect(gamePage.gameOver()).toHaveCount(0);
  await gamePage.letGo();
});

test("chuyển tab ngay sau cú vỗ đầu tiên thì không mất lượt", { tag: ["@TC-PAUSE-007"] }, async ({ gamePage }) => {
  // one synchronous task: split into two Playwright calls, a frame could slip in between and the test would walk past
  // the gap without touching it
  await gamePage.flapThenHideTabAtOnce();
  await gamePage.advance(10_000);
  await gamePage.setTabHidden(false);
  await expect(gamePage.gameOver()).toHaveCount(0);
});
