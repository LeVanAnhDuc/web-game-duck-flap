import { test, expect } from "@/fixtures";

// Runs on the "app-touch" project (Pixel 7, hasTouch): taps produce touch pointer events, as on a phone.

test("chơi được trọn một lượt chỉ bằng cách chạm", { tag: ["@TC-CONTROLS-007", "@smoke"] }, async ({ gamePage }) => {
  await gamePage.goto();
  await gamePage.playButton().tap();
  await expect(gamePage.ready()).toBeVisible();
  await gamePage.container().tap();
  await expect(gamePage.ready()).toBeHidden();
  await expect(gamePage.gameOver()).toBeVisible({ timeout: 15_000 });
});

test("vùng chơi tắt kéo, zoom và bôi chọn chữ của trình duyệt", { tag: ["@TC-CONTROLS-008"] }, async ({ gamePage }) => {
  await gamePage.goto();
  expect(await gamePage.playAreaGestureStyle()).toEqual({ touchAction: "none", userSelect: "none" });
});
