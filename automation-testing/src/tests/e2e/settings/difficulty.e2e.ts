import { test, expect } from "@/fixtures";
import { copy } from "@/data/copy";
import { FALL_MS, STORAGE, type Difficulty } from "@/data/test-data";

// Design spec §7 + README: Easy / Normal / Hard change the game and each keeps its own record table; the choice is
// remembered between visits.

test("đổi độ khó thì kỷ lục đang hiển thị đổi theo bảng của mức đó", { tag: ["@TC-SETTINGS-004", "@smoke"] }, async ({
  gamePage,
}) => {
  await gamePage.goto({ storage: { [STORAGE.best("normal")]: "7", [STORAGE.best("hard")]: "2" } });
  // the default is Normal, so the record shown is Normal's
  await expect(gamePage.headerBest()).toHaveText("7");
  await expect(gamePage.menu()).toContainText(copy.menu.best("normal"));
  await expect(gamePage.overlayBest()).toHaveText("7");

  await gamePage.settings.open();
  await gamePage.settings.choose("hard");
  await gamePage.settings.closeButton().click();

  await expect(gamePage.headerBest()).toHaveText("2");
  await expect(gamePage.menu()).toContainText(copy.menu.best("hard"));
  await expect(gamePage.overlayBest()).toHaveText("2");
});

test("chọn mức Khó thì lần sau mở game vẫn giữ nguyên", { tag: ["@TC-SETTINGS-005", "@smoke"] }, async ({ gamePage }) => {
  await gamePage.goto();
  await gamePage.settings.open();
  await gamePage.settings.choose("hard");
  await gamePage.settings.closeButton().click();

  await gamePage.reload();
  await expect(gamePage.menu()).toContainText(copy.menu.best("hard"));
  await gamePage.settings.open();
  await expect(gamePage.settings.difficulty("hard")).toHaveAttribute("aria-pressed", "true");
});

test("lượt kế tiếp chơi ở độ khó vừa chọn", { tag: ["@TC-SETTINGS-006"] }, async ({ gamePage }) => {
  await gamePage.useFakeClock();
  await gamePage.goto();
  await gamePage.settings.open();
  await gamePage.settings.choose("easy");
  await gamePage.settings.closeButton().click();
  await gamePage.playUntilGameOver();
  await expect(gamePage.gameOverCard()).toContainText(copy.gameOver.level("easy"));
});

test("khe hẹp dần và ống trôi nhanh dần theo Dễ, Thường, Khó", { tag: ["@TC-SETTINGS-007"] }, async ({ gamePage }) => {
  await gamePage.useFakeClock();
  await gamePage.goto();
  const measured: Record<Difficulty, { gap: number; travel: number }> = {} as never;
  for (const d of ["easy", "normal", "hard"] as const) {
    await gamePage.settings.open();
    await gamePage.settings.choose(d);
    await gamePage.settings.closeButton().click();
    await gamePage.play();
    await gamePage.flap();
    await gamePage.advance(300);
    const first = (await gamePage.readWorld()).pipes[0];
    await gamePage.flap();
    await gamePage.advance(300);
    const later = (await gamePage.readWorld()).pipes[0];
    measured[d] = { gap: first.gapBottom - first.gapTop, travel: first.left - later.left };
    await gamePage.advance(FALL_MS);
    await expect(gamePage.gameOver()).toBeVisible();
    await gamePage.toMenuButton().click();
    await expect(gamePage.menu()).toBeVisible();
  }
  test.info().annotations.push({ type: "measured", description: JSON.stringify(measured) });
  expect(measured.easy.gap).toBeGreaterThan(measured.normal.gap);
  expect(measured.normal.gap).toBeGreaterThan(measured.hard.gap);
  expect(measured.easy.travel).toBeLessThan(measured.normal.travel);
  expect(measured.normal.travel).toBeLessThan(measured.hard.travel);
});
