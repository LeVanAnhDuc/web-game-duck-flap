import { test, expect } from "@/fixtures";
import { copy } from "@/data/copy";
import { STORAGE } from "@/data/test-data";

// README "Records and settings live in localStorage on your own device … corrupted data degrades to defaults instead of
// crashing" · design spec §6: each field is validated on its own.

test("cài đặt được lưu thành JSON ở khoá flappy-bird:settings", { tag: ["@TC-STORAGE-001"] }, async ({ gamePage }) => {
  await gamePage.goto();
  await gamePage.settings.open();
  await gamePage.settings.choose("hard");
  await gamePage.settings.soundSwitch().click();
  await expect(gamePage.settings.soundSwitch()).toHaveAttribute("aria-checked", "false");
  await expect.poll(() => gamePage.storedSettings()).toEqual({ soundEnabled: false, difficulty: "hard" });
});

test("cài đặt không phải JSON thì game mở với mặc định", { tag: ["@TC-STORAGE-002"] }, async ({ page, gamePage }) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await gamePage.goto({ storage: { [STORAGE.settings]: "{oops" } });
  await expect(gamePage.menu()).toContainText(copy.menu.best("normal"));
  await expect(gamePage.soundState()).toHaveText(copy.menu.soundOn);
  expect(errors).toEqual([]);
});

test("cài đặt hỏng một phần thì giữ trường còn đúng", { tag: ["@TC-STORAGE-003"] }, async ({ gamePage }) => {
  await gamePage.goto({ storage: { [STORAGE.settings]: JSON.stringify({ soundEnabled: false, difficulty: "insane" }) } });
  await expect(gamePage.soundState()).toHaveText(copy.menu.soundOff);
  await expect(gamePage.menu()).toContainText(copy.menu.best("normal"));
});

for (const [value, label] of [
  ["abc", "chữ"],
  ["-5", "số âm"],
  ["Infinity", "Infinity"],
  ["", "rỗng"],
] as const) {
  test(`kỷ lục rác hiển thị là 0 (${label})`, { tag: ["@TC-STORAGE-004"] }, async ({ gamePage }) => {
    // a valid field next to the garbage: once the menu says "Tắt", the app has read storage — "0" is then its answer,
    // not the server-rendered placeholder
    await gamePage.goto({
      storage: { [STORAGE.best("normal")]: value, [STORAGE.settings]: JSON.stringify({ soundEnabled: false, difficulty: "normal" }) },
    });
    await expect(gamePage.soundState()).toHaveText(copy.menu.soundOff);
    await expect(gamePage.headerBest()).toHaveText("0");
    await expect(gamePage.overlayBest()).toHaveText("0");
  });
}

test("kỷ lục số lẻ được làm tròn xuống", { tag: ["@TC-STORAGE-005"] }, async ({ gamePage }) => {
  await gamePage.goto({ storage: { [STORAGE.best("normal")]: "12.9" } });
  await expect(gamePage.headerBest()).toHaveText("12");
  await expect(gamePage.overlayBest()).toHaveText("12");
});

test("cả một lượt chơi không có request nào ra ngoài trang", { tag: ["@TC-STORAGE-007"] }, async ({ page, gamePage, baseURL }) => {
  const site = new URL(baseURL!).origin;
  const outside: string[] = [];
  page.on("request", (r) => {
    const url = r.url();
    if (/^https?:/.test(url) && new URL(url).origin !== site) outside.push(url);
  });
  await gamePage.goto();
  await gamePage.settings.open();
  await gamePage.settings.choose("easy");
  await gamePage.settings.closeButton().click();
  await gamePage.playUntilGameOver();
  expect(outside).toEqual([]);
});
