import { test, expect } from "@/fixtures";

// README "Sound without a single audio file": flap, score, hit and die are synthesised with WebAudio oscillators; a
// browser that blocks or lacks WebAudio simply plays nothing. The audio probe (decisions/sound.md Q1) counts contexts
// and oscillators instead of listening.

test("tắt tiếng thì cả lượt chơi không mở bộ âm thanh nào", { tag: ["@TC-SOUND-006", "@smoke"] }, async ({ gamePage }) => {
  await gamePage.probeAudio();
  await gamePage.useFakeClock();
  await gamePage.goto();
  await gamePage.headerSound().click();
  await gamePage.play();
  for (let i = 0; i < 3; i += 1) {
    await gamePage.flap();
    await gamePage.advance(150);
  }
  await gamePage.letGo();
  expect(await gamePage.audioProbe()).toEqual({ contexts: 0, started: [] });
});

test("bật tiếng thì vỗ cánh và lúc chết phát âm tổng hợp, không tải file âm thanh", { tag: ["@TC-SOUND-007"] }, async ({
  page,
  gamePage,
}) => {
  const media: string[] = [];
  page.on("request", (r) => {
    if (r.resourceType() === "media" || /\.(mp3|wav|ogg|m4a|aac|webm)(\?|$)/i.test(r.url())) media.push(r.url());
  });
  await gamePage.probeAudio();
  await gamePage.useFakeClock();
  await gamePage.goto();
  await gamePage.play();
  await gamePage.flap();
  await gamePage.letGo();
  const probe = await gamePage.audioProbe();
  expect(probe.contexts).toBe(1);
  expect(probe.started).toContain("triangle");
  expect(probe.started).toContain("sawtooth");
  expect(media).toEqual([]);
});

test("trình duyệt không có WebAudio vẫn chơi trọn lượt không lỗi", { tag: ["@TC-SOUND-008"] }, async ({ page, gamePage }) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await gamePage.probeAudio({ remove: true });
  await gamePage.useFakeClock();
  await gamePage.goto();
  await gamePage.playUntilGameOver();
  await gamePage.restartButton().click();
  await expect(gamePage.ready()).toBeVisible();
  await gamePage.flap();
  await gamePage.letGo();
  expect(errors).toEqual([]);
});
