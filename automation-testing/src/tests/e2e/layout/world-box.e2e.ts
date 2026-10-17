import { test, expect } from "@/fixtures";
import { WORLD } from "@/data/test-data";

// README "Plays the same everywhere": a fixed 288 × 512 box scaled to fit the screen (design spec §4: contain, centred).
// Measured from the painted pixels: the renderer clears the whole canvas and draws only inside the world box.

const RATIO = WORLD.width / WORLD.height;

test("màn hình rộng: khung chơi cao kín vùng chơi, tỉ lệ 288:512, nằm giữa", { tag: ["@TC-LAYOUT-001", "@smoke"] }, async ({
  page,
  gamePage,
}) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  await gamePage.goto();
  const box = await gamePage.paintedBox();
  expect(Math.abs(box.height - box.canvasHeight)).toBeLessThanOrEqual(2);
  expect(Math.abs(box.width - box.height * RATIO)).toBeLessThanOrEqual(2);
  const right = box.canvasWidth - (box.x + box.width);
  expect(Math.abs(box.x - right)).toBeLessThanOrEqual(2);
  // a lit column against the dark page: real margins on both sides
  expect(box.x).toBeGreaterThan(100);
});

test("điện thoại dọc: khung chơi rộng kín bề ngang và nằm giữa theo chiều dọc", { tag: ["@TC-LAYOUT-002"] }, async ({
  page,
  gamePage,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await gamePage.goto();
  const box = await gamePage.paintedBox();
  expect(Math.abs(box.width - box.canvasWidth)).toBeLessThanOrEqual(2);
  expect(Math.abs(box.height - box.width / RATIO)).toBeLessThanOrEqual(2);
  const bottom = box.canvasHeight - (box.y + box.height);
  expect(Math.abs(box.y - bottom)).toBeLessThanOrEqual(2);
});

test("xoay / đổi kích thước cửa sổ thì khung chơi phóng lại cho vừa", { tag: ["@TC-LAYOUT-003"] }, async ({ page, gamePage }) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  await gamePage.goto();
  await page.setViewportSize({ width: 400, height: 900 });
  await expect.poll(async () => {
    const b = await gamePage.paintedBox();
    return Math.abs(b.width - b.canvasWidth) <= 2 && Math.abs(b.height - b.width / RATIO) <= 2;
  }).toBe(true);
});
