import { test, expect } from "@/fixtures";
import { copy } from "@/data/copy";

// README "Mute from the header or from settings; the choice is remembered" · ux-persona-fixes F-03: the state is
// written in words on the menu, the buttons stay ARIA toggles named after the action.

test.beforeEach(async ({ gamePage }) => {
  await gamePage.goto();
});

test("lần đầu âm thanh bật, nút nói trạng thái bằng chữ và bằng aria", { tag: ["@TC-SOUND-001"] }, async ({ gamePage }) => {
  await expect(gamePage.soundState()).toHaveText(copy.menu.soundOn);
  for (const button of [gamePage.headerSound(), gamePage.menuSound()]) {
    await expect(button).toHaveAttribute("aria-pressed", "true");
    await expect(button).toHaveAccessibleName(copy.header.mute);
  }
});

test("tắt tiếng ở header thì màn chờ nói \"Tắt\" ngay", { tag: ["@TC-SOUND-002", "@smoke"] }, async ({ gamePage }) => {
  await gamePage.headerSound().click();
  await expect(gamePage.headerSound()).toHaveAttribute("aria-pressed", "false");
  await expect(gamePage.headerSound()).toHaveAccessibleName(copy.header.unmute);
  await expect(gamePage.headerSound()).toHaveAttribute("title", copy.header.unmute);
  await expect(gamePage.soundState()).toHaveText(copy.menu.soundOff);
  await expect(gamePage.menuSound()).toHaveAttribute("aria-pressed", "false");
});

test("nút ở màn chờ tắt rồi bật lại, header đi theo", { tag: ["@TC-SOUND-003"] }, async ({ gamePage }) => {
  await gamePage.menuSound().click();
  await expect(gamePage.soundState()).toHaveText(copy.menu.soundOff);
  await expect(gamePage.headerSound()).toHaveAttribute("aria-pressed", "false");
  await gamePage.menuSound().click();
  await expect(gamePage.soundState()).toHaveText(copy.menu.soundOn);
  await expect(gamePage.headerSound()).toHaveAttribute("aria-pressed", "true");
});

test("công tắc trong Cài đặt cùng đổi header và màn chờ", { tag: ["@TC-SOUND-004"] }, async ({ gamePage }) => {
  await gamePage.settings.open();
  await expect(gamePage.settings.soundSwitch()).toHaveAttribute("aria-checked", "true");
  await gamePage.settings.soundSwitch().click();
  await expect(gamePage.settings.soundSwitch()).toHaveAttribute("aria-checked", "false");
  await expect(gamePage.headerSound()).toHaveAttribute("aria-pressed", "false");
  await gamePage.settings.closeButton().click();
  await expect(gamePage.soundState()).toHaveText(copy.menu.soundOff);
});

test("tắt tiếng được nhớ sau khi tải lại", { tag: ["@TC-SOUND-005", "@smoke"] }, async ({ gamePage }) => {
  await gamePage.headerSound().click();
  await expect(gamePage.soundState()).toHaveText(copy.menu.soundOff);
  await gamePage.reload();
  await expect(gamePage.soundState()).toHaveText(copy.menu.soundOff);
  await expect(gamePage.headerSound()).toHaveAttribute("aria-pressed", "false");
});
