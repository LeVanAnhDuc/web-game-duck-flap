import { test, expect } from "@/fixtures";
import { DIFFICULTIES } from "@/data/test-data";

// The settings dialog: open from the menu, close with X or Esc, exactly one difficulty selected.

test.beforeEach(async ({ gamePage }) => {
  await gamePage.goto();
  await gamePage.settings.open();
});

test("mở Cài đặt từ màn chờ và đóng bằng nút X", { tag: ["@TC-SETTINGS-001", "@smoke"] }, async ({ gamePage }) => {
  await expect(gamePage.settings.dialog()).toBeVisible();
  await gamePage.settings.closeButton().click();
  await expect(gamePage.settings.dialog()).toHaveCount(0);
  await expect(gamePage.menu()).toBeVisible();
});

test("Esc đóng hộp thoại cài đặt", { tag: ["@TC-SETTINGS-002"] }, async ({ page, gamePage }) => {
  await page.keyboard.press("Escape");
  await expect(gamePage.settings.dialog()).toHaveCount(0);
  await expect(gamePage.menu()).toBeVisible();
  await expect(gamePage.ready()).toHaveCount(0);
});

test("lần đầu là mức Thường và luôn chỉ một mức được chọn", { tag: ["@TC-SETTINGS-003"] }, async ({ gamePage }) => {
  const pressed = async () => {
    const out = [];
    for (const d of DIFFICULTIES) if ((await gamePage.settings.difficulty(d).getAttribute("aria-pressed")) === "true") out.push(d);
    return out;
  };
  expect(await pressed()).toEqual(["normal"]);
  await gamePage.settings.choose("easy");
  expect(await pressed()).toEqual(["easy"]);
  await gamePage.settings.choose("hard");
  expect(await pressed()).toEqual(["hard"]);
  await expect(gamePage.settings.note()).toBeVisible();
});

test("Space trong hộp thoại cài đặt bật công tắc, không bắt đầu lượt phía sau", { tag: ["@TC-SETTINGS-008"] }, async ({
  page,
  gamePage,
}) => {
  // BUG: defects/settings.md#bug-settings-01
  test.fail();
  await gamePage.settings.soundSwitch().focus();
  await page.keyboard.press("Space");
  await expect(gamePage.settings.soundSwitch()).toHaveAttribute("aria-checked", "false");
  await expect(gamePage.settings.dialog()).toBeVisible();
  await expect(gamePage.menu()).toBeVisible();
  await expect(gamePage.ready()).toHaveCount(0);
});
