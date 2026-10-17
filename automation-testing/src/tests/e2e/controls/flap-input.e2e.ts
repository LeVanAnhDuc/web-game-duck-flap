import { test, expect } from "@/fixtures";

// README §Controls: Space, ↑, W, click, tap. Overlays never swallow a tap (design spec §6); Space on the menu starts a
// run but a tap on the menu backdrop does not (ux-persona-fixes F-04a, §3.1).

for (const [key, label] of [
  ["Space", "Space"],
  ["ArrowUp", "mũi tên lên"],
  ["KeyW", "W"],
] as const) {
  test(`Space, mũi tên lên và W đều bắt đầu được lượt (${label})`, { tag: ["@TC-CONTROLS-001", "@smoke"] }, async ({
    page,
    gamePage,
  }) => {
    await gamePage.useFakeClock();
    await gamePage.goto();
    await gamePage.play();
    const before = (await gamePage.readWorld()).birdY!;
    await page.keyboard.press(key);
    await gamePage.advance(300);
    await expect(gamePage.ready()).toBeHidden();
    expect((await gamePage.readWorld()).birdY!).toBeLessThan(before - 20);
  });
}

test("bấm giữa vùng chơi ở màn sẵn sàng thì bắt đầu bay, lớp phủ không nuốt cú bấm", { tag: ["@TC-CONTROLS-002", "@smoke"] }, async ({
  gamePage,
}) => {
  await gamePage.useFakeClock();
  await gamePage.goto();
  await gamePage.play();
  // regression for "the overlay swallows the tap": the centre of the play area must be the canvas
  expect(await gamePage.topmostAt(0.5, 0.5)).toBe("game-canvas");
  await gamePage.container().click();
  await gamePage.advance(300);
  await expect(gamePage.ready()).toBeHidden();
  // and while flying, under the score
  expect(await gamePage.topmostAt(0.5, 0.5)).toBe("game-canvas");
  expect(await gamePage.topmostAt(0.5, 0.1)).toBe("game-canvas");
});

test("Space ở màn chờ vào thẳng màn sẵn sàng", { tag: ["@TC-CONTROLS-003"] }, async ({ gamePage }) => {
  await gamePage.goto();
  await gamePage.flap("Space");
  await expect(gamePage.menu()).toBeHidden();
  await expect(gamePage.ready()).toBeVisible();
});

test("bấm vào nền màn chờ không ném người chơi vào lượt mới", { tag: ["@TC-CONTROLS-004"] }, async ({ gamePage }) => {
  await gamePage.goto();
  // top-left corner of the play area: outside the menu card, still inside the container
  await gamePage.container().click({ position: { x: 8, y: 8 } });
  await expect(gamePage.menu()).toBeVisible();
  await expect(gamePage.ready()).toHaveCount(0);
});

test("giữ phím chỉ tính một cú vỗ", { tag: ["@TC-CONTROLS-005"] }, async ({ page, gamePage }) => {
  // every flap the game counts plays the flap tone (a triangle oscillator): the audio probe is the flap counter
  await gamePage.probeAudio();
  await gamePage.useFakeClock();
  await gamePage.goto();
  await gamePage.play();

  // one press held down: Playwright sends the following keydowns with repeat = true
  await page.keyboard.down("Space");
  for (let i = 0; i < 5; i += 1) await page.keyboard.down("Space");
  await page.keyboard.up("Space");
  await gamePage.advance(250);
  expect((await gamePage.audioProbe()).started.filter((w) => w === "triangle")).toHaveLength(1);

  // control: a second, separate press does count
  await gamePage.flap();
  await gamePage.advance(50);
  expect((await gamePage.audioProbe()).started.filter((w) => w === "triangle")).toHaveLength(2);
});

test("phím vỗ cánh không để trình duyệt cuộn trang", { tag: ["@TC-CONTROLS-006"] }, async ({ gamePage }) => {
  await gamePage.goto();
  await gamePage.play();
  await gamePage.recordKeydowns();
  await gamePage.flap("Space");
  await gamePage.flap("ArrowUp");
  expect(await gamePage.recordedKeydowns()).toEqual([
    { code: "Space", prevented: true },
    { code: "ArrowUp", prevented: true },
  ]);
});
