import { test, expect } from "@/fixtures";
import { copy } from "@/data/copy";

// The page is exactly 100dvh and never scrolls; the header is a fixed 56px bar (Home/index.tsx, Header h-14).
// ux-persona-fixes F-02 (visible 15px record label) and F-06 (28px title, 16px tagline).

for (const width of [320, 375, 768, 1440]) {
  test(`trang không cuộn ở mọi bề rộng và header cao 56px (${width}px)`, { tag: ["@TC-LAYOUT-004"] }, async ({ page, gamePage }) => {
    await page.setViewportSize({ width, height: width < 700 ? 720 : 900 });
    await gamePage.goto();
    expect(await gamePage.pageOverflow()).toEqual({ x: 0, y: 0 });
    expect((await gamePage.header().boundingBox())!.height).toBe(56);

    await gamePage.settings.open();
    expect(await gamePage.pageOverflow()).toEqual({ x: 0, y: 0 });
    await gamePage.settings.closeButton().click();

    await gamePage.play();
    expect(await gamePage.pageOverflow()).toEqual({ x: 0, y: 0 });
  });
}

test("nhãn kỷ lục trên header đọc được bằng mắt", { tag: ["@TC-LAYOUT-005"] }, async ({ page, gamePage }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await gamePage.goto();
  const label = gamePage.headerBestLabel();
  await expect(label).toBeVisible();
  await expect(label).toHaveText(copy.header.bestLabel);
  const box = (await label.boundingBox())!;
  // not an sr-only 1px box: a real word on screen
  expect(box.width).toBeGreaterThan(20);
  expect(await gamePage.cssPx(label, "font-size")).toBeGreaterThanOrEqual(15);
  const number = (await gamePage.headerBest().boundingBox())!;
  expect(number.x).toBeGreaterThan(box.x);
});

test("câu giải thích trò chơi nổi hơn tên thương hiệu", { tag: ["@TC-LAYOUT-006"] }, async ({ gamePage }) => {
  await gamePage.goto();
  expect(await gamePage.cssPx(gamePage.menuTitle(), "font-size")).toBeLessThanOrEqual(28);
  expect(await gamePage.cssPx(gamePage.menuTagline(), "font-size")).toBeGreaterThanOrEqual(16);
});

test("trang tắt zoom của trình duyệt", { tag: ["@TC-LAYOUT-007"] }, async ({ gamePage }) => {
  await gamePage.goto();
  const meta = (await gamePage.viewportMeta())!.replace(/\s/g, "");
  expect(meta).toContain("maximum-scale=1");
  expect(meta).toContain("user-scalable=no");
});
