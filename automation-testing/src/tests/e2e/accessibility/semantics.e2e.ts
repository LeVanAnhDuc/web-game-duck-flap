import { test, expect } from "@/fixtures";
import { copy } from "@/data/copy";
import { DIFFICULTIES } from "@/data/test-data";

// What a screen reader is told: names of icon buttons, the settings dialog, toggles and switches; and motion that stops
// for people who asked the system for less of it.

test("nút âm thanh chỉ có icon vẫn có tên, icon trang trí bị ẩn", { tag: ["@TC-ACCESSIBILITY-004"] }, async ({ gamePage }) => {
  await gamePage.goto();
  await expect(gamePage.headerSound()).toHaveAccessibleName(copy.header.mute);
  await expect(gamePage.headerSound()).toHaveAttribute("title", copy.header.mute);
  const icons = gamePage.headerIcons();
  expect(await icons.count()).toBeGreaterThan(0);
  for (const icon of await icons.all()) await expect(icon).toHaveAttribute("aria-hidden", "true");
});

test("Cài đặt là hộp thoại modal có tên, focus ở nút đóng, nhóm độ khó có nhãn", { tag: ["@TC-ACCESSIBILITY-005"] }, async ({
  gamePage,
}) => {
  await gamePage.goto();
  await gamePage.settings.open();
  await expect(gamePage.settings.dialog()).toHaveAttribute("aria-modal", "true");
  await expect(gamePage.settings.closeButton()).toBeFocused();
  await expect(gamePage.settings.difficultyGroup().getByRole("button")).toHaveCount(3);
  for (const d of DIFFICULTIES) await expect(gamePage.settings.difficulty(d)).toHaveAttribute("aria-pressed", /true|false/);
  await expect(gamePage.settings.soundSwitch()).toHaveAttribute("aria-checked", "true");
});

test("bật giảm chuyển động thì ba bàn tay ở màn sẵn sàng đứng yên", { tag: ["@TC-ACCESSIBILITY-006"] }, async ({
  page,
  gamePage,
}) => {
  const animations = () => gamePage.animationNames(gamePage.readyHands());
  await gamePage.goto();
  await gamePage.play();
  const normal = await animations();
  expect(normal).toHaveLength(3);
  expect(normal.every((a) => a !== "none")).toBe(true);

  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect.poll(animations).toEqual(["none", "none", "none"]);
});

test("trang khai báo tiếng Việt và có tiêu đề Duck Flap", { tag: ["@TC-ACCESSIBILITY-007"] }, async ({ page, gamePage }) => {
  await gamePage.goto();
  await expect(page).toHaveTitle(copy.pageTitle);
  expect(await gamePage.documentLang()).toBe("vi");
});
