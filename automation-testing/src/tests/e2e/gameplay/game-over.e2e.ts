import { test, expect } from "@/fixtures";
import { copy } from "@/data/copy";

// The game-over card waits for the player (ux-persona-fixes F-05, §3.2): a tap outside only nudges it, and a slow
// reader gets all the time they need. A zero-point run explains why the duck fell (F-01).

test.beforeEach(async ({ gamePage }) => {
  await gamePage.useFakeClock();
  await gamePage.goto();
  await gamePage.playUntilGameOver();
});

test("chạm ngoài thẻ thua thì thẻ nháy chứ không chơi lại; chạm trúng thẻ thì không nháy", { tag: ["@TC-GAMEPLAY-008"] }, async ({
  gamePage,
}) => {
  const card = gamePage.gameOverCard();
  await expect(card).toHaveAttribute("data-nudge-count", "0");

  await gamePage.gameOver().click({ position: { x: 6, y: 6 } });
  // a count, not the 400 ms data-nudge flag: under load the flag may be gone before it is read
  await expect(card).toHaveAttribute("data-nudge-count", "1");
  await expect(gamePage.gameOver()).toBeVisible();
  await expect(gamePage.ready()).toHaveCount(0);

  await card.getByText(copy.gameOver.title).click();
  await expect(card).toHaveAttribute("data-nudge-count", "1");
});

test("màn thua đứng yên nửa phút cho người đọc chậm", { tag: ["@TC-GAMEPLAY-009"] }, async ({ gamePage }) => {
  await gamePage.advance(30_000);
  await expect(gamePage.gameOver()).toBeVisible();
  await expect(gamePage.gameOverScore()).toHaveText("0");
});

test("thua với 0 điểm thì được giải thích vì sao vịt rơi", { tag: ["@TC-GAMEPLAY-010"] }, async ({ gamePage }) => {
  await expect(gamePage.gameOverScore()).toHaveText("0");
  await expect(gamePage.zeroScoreHint()).toHaveText(copy.gameOver.zeroHint);
});
