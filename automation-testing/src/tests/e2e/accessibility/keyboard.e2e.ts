import { test, expect } from "@/fixtures";
import { copy } from "@/data/copy";

// README: "Play holds focus from the first frame, so a keyboard never has to hunt for the button" (ux-persona-fixes
// F-04b). Everything here is done with the keyboard only.

test("mở trang là nút Chơi đã có focus, Enter vào lượt ngay", { tag: ["@TC-ACCESSIBILITY-001", "@smoke"] }, async ({
  page,
  gamePage,
}) => {
  await gamePage.goto();
  await expect(gamePage.playButton()).toBeFocused();
  await expect(gamePage.headerSound()).not.toBeFocused();
  await page.keyboard.press("Enter");
  await expect(gamePage.ready()).toBeVisible();
});

test("chơi trọn một lượt và chơi lại chỉ bằng bàn phím", { tag: ["@TC-ACCESSIBILITY-002"] }, async ({ page, gamePage }) => {
  await gamePage.useFakeClock();
  await gamePage.goto();
  await page.keyboard.press("Enter");
  await expect(gamePage.ready()).toBeVisible();
  await gamePage.letGoAfterFlap();

  let reached = false;
  for (let i = 0; i < 6 && !reached; i += 1) {
    await page.keyboard.press("Tab");
    reached = (await gamePage.focusedName()) === copy.gameOver.restart;
  }
  expect(reached, "Tab reaches \"Chơi lại\"").toBe(true);
  await page.keyboard.press("Enter");
  await expect(gamePage.ready()).toBeVisible();
  await expect(gamePage.hudScore()).toHaveText("0");
});

test("nút đang focus có vòng focus nhìn thấy được", { tag: ["@TC-ACCESSIBILITY-003"] }, async ({ page, gamePage }) => {
  await gamePage.goto();
  await page.keyboard.press("Tab");
  await expect(gamePage.settingsButton()).toBeFocused();
  const shadow = await gamePage.cssValue(gamePage.settingsButton(), "box-shadow");
  expect(shadow).not.toBe("none");
});
