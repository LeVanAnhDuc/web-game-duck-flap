import { test, expect } from "@/fixtures";
import { copy } from "@/data/copy";

// Design spec §6: localStorage blocked (private mode) → swallow the error, record = 0, the game still plays.

test("trình duyệt chặn localStorage thì game vẫn chơi được với mặc định", { tag: ["@TC-STORAGE-006", "@smoke"] }, async ({
  page,
  gamePage,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await gamePage.refuseLocalStorage();
  await gamePage.useFakeClock();
  await gamePage.goto();
  await expect(gamePage.menu()).toContainText(copy.menu.best("normal"));
  await expect(gamePage.headerBest()).toHaveText("0");

  await gamePage.playUntilGameOver();
  await gamePage.toMenuButton().click();
  await gamePage.settings.open();
  await gamePage.settings.choose("hard");
  await gamePage.settings.closeButton().click();
  await expect(gamePage.menu()).toContainText(copy.menu.best("hard"));
  expect(errors).toEqual([]);
});
