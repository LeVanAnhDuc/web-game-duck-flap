import { test, expect } from "@/fixtures";
import { GamePage } from "@/pages/game.page";
import { DUCKER } from "@/data/test-data";

// docs/decisions/0001-ducker-id-sign-in.md + docs/superpowers/specs/ducker-id-sign-in/design.md. Runs on the
// "app-auth" project: the flag-on export built by `pnpm build:e2e-auth` against the fake issuer http://ducker.test,
// served on :3411. Every request to the issuer is answered by the fakeIssuer fixture.

test("đăng nhập: thấy tài khoản và menu, URL sạch; đăng xuất trả lại nút", { tag: ["@TC-DUCKERID-002", "@smoke"] }, async ({
  page,
  gamePage,
  fakeIssuer,
}) => {
  const errors: string[] = [];
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });
  await fakeIssuer();
  await gamePage.goto();
  await gamePage.account.signInButton().click();

  await expect(gamePage.account.trigger()).toBeVisible();
  // Next writes its hydration URL back after the capture; the clean URL has to win and stay
  await expect.poll(() => gamePage.urlSearch()).not.toMatch(/code=|state=/);

  await gamePage.account.trigger().click();
  await expect(gamePage.account.menu()).toContainText(DUCKER.user.name);
  await expect(gamePage.account.menu()).toContainText(DUCKER.user.email);
  await expect(gamePage.account.profileLink()).toHaveAttribute("href", `${DUCKER.issuer}${DUCKER.profilePath}`);

  await gamePage.account.signOutItem().click();
  await expect(gamePage.account.signInButton()).toBeVisible();
  await expect(gamePage.account.signInButton()).toBeFocused();
  expect(errors.filter((e) => /hydrat/i.test(e))).toEqual([]);
});

test("Esc đóng menu tài khoản và trả focus về nút tài khoản", { tag: ["@TC-DUCKERID-003"] }, async ({ page, gamePage, fakeIssuer }) => {
  await fakeIssuer();
  await gamePage.goto();
  await gamePage.account.signInButton().click();
  await gamePage.account.trigger().click();
  await expect(gamePage.account.menu()).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(gamePage.account.menu()).toHaveCount(0);
  await expect(gamePage.account.trigger()).toBeFocused();
});

test("đã đăng nhập vẫn chơi được như thường", { tag: ["@TC-DUCKERID-004"] }, async ({ gamePage, fakeIssuer }) => {
  await fakeIssuer();
  await gamePage.goto();
  await gamePage.account.signInButton().click();
  await expect(gamePage.account.trigger()).toBeVisible();
  await gamePage.play();
  await gamePage.flap();
  await expect(gamePage.ready()).toBeHidden();
  await expect(gamePage.gameOver()).toBeVisible({ timeout: 15_000 });
  await expect(gamePage.account.trigger()).toBeVisible();
});

test("hồ sơ chỉ nằm trong bộ nhớ: tải lại là chưa đăng nhập, storage không giữ gì", { tag: ["@TC-DUCKERID-005", "@smoke"] }, async ({
  gamePage,
  fakeIssuer,
}) => {
  await fakeIssuer();
  await gamePage.goto();
  await gamePage.account.signInButton().click();
  await expect(gamePage.account.trigger()).toBeVisible();
  expect(await gamePage.allStorageText()).not.toContain(DUCKER.user.email);
  expect(await gamePage.sessionItem(DUCKER.pkceKey)).toBeNull();

  await gamePage.reload();
  await expect(gamePage.account.signInButton()).toBeVisible();
});

test("từ chối ở Ducker ID thì về chưa đăng nhập, URL sạch", { tag: ["@TC-DUCKERID-006"] }, async ({ gamePage, fakeIssuer }) => {
  await fakeIssuer("deny");
  await gamePage.goto();
  await gamePage.account.signInRoundTrip(DUCKER.issuer);
  // the PKCE entry is only cleared once the returning page has handled the callback
  await expect.poll(() => gamePage.sessionItem(DUCKER.pkceKey)).toBeNull();
  await expect(gamePage.account.signInButton()).toBeVisible();
  await expect.poll(() => gamePage.urlSearch()).toBe("");
});

test("state bị sửa thì về chưa đăng nhập và không bao giờ gọi tới token", { tag: ["@TC-DUCKERID-007", "@smoke"] }, async ({
  gamePage,
  fakeIssuer,
}) => {
  const issuer = await fakeIssuer("tamper");
  await gamePage.goto();
  await gamePage.account.signInRoundTrip(DUCKER.issuer);
  await expect(gamePage.account.signInButton()).toBeVisible();
  await expect.poll(() => gamePage.urlSearch()).not.toMatch(/code=|state=/);
  expect(issuer.tokenCalls()).toBe(0);
});

test("issuer treo thì sau tối đa 15 giây về lại chưa đăng nhập", { tag: ["@TC-DUCKERID-008"] }, async ({ gamePage, fakeIssuer }) => {
  // AbortSignal.timeout(15s) is a native timer that page.clock cannot fast-forward: this one waits for real
  test.setTimeout(45_000);
  const issuer = await fakeIssuer("hang");
  await gamePage.goto();
  await gamePage.account.signInRoundTrip(DUCKER.issuer);
  await expect.poll(() => issuer.tokenCalls()).toBe(1);
  await expect(gamePage.account.signInButton()).toBeVisible({ timeout: 20_000 });
  await expect.poll(() => gamePage.urlSearch()).not.toMatch(/code=|state=/);
});

test("sessionStorage bị chặn thì bấm đăng nhập không đưa đi đâu cả", { tag: ["@TC-DUCKERID-009"] }, async ({
  page,
  gamePage,
  fakeIssuer,
}) => {
  await gamePage.refuseSessionStorage();
  await fakeIssuer();
  const toIssuer: string[] = [];
  page.on("request", (r) => {
    if (r.url().startsWith(DUCKER.issuer)) toIssuer.push(r.url());
  });
  await gamePage.goto();
  await gamePage.account.signInButton().click();
  await expect(gamePage.account.signInButton()).toBeEnabled();
  await expect(gamePage.menu()).toBeVisible();
  expect(toIssuer).toEqual([]);
});

test("375px: nút đăng nhập ≥ 44px, nằm giữa pill kỷ lục và nút âm thanh, không đè ai", { tag: ["@TC-DUCKERID-010"] }, async ({
  page,
  gamePage,
  fakeIssuer,
}) => {
  await page.setViewportSize({ width: 375, height: 700 });
  await fakeIssuer();
  await gamePage.goto();
  const box = (await gamePage.account.signInButton().boundingBox())!;
  expect(box.width).toBeGreaterThanOrEqual(44);
  expect(box.height).toBeGreaterThanOrEqual(44);
  const pill = (await gamePage.bestPill().boundingBox())!;
  const sound = (await gamePage.headerSound().boundingBox())!;
  expect(pill.x + pill.width).toBeLessThanOrEqual(box.x + 0.5);
  expect(box.x + box.width).toBeLessThanOrEqual(sound.x + 0.5);
});

type Box = { x: number; y: number; width: number; height: number };
const overlaps = (p: Box, q: Box) =>
  p.x < q.x + q.width - 0.5 && q.x < p.x + p.width - 0.5 && p.y < q.y + q.height - 0.5 && q.y < p.y + p.height - 0.5;

/** One header state: no sideways scroll, a one-line wordmark, 44px buttons, nothing overlapping. */
async function expectHeaderFits(gamePage: GamePage): Promise<void> {
  const m = await gamePage.headerLayout();
  expect(m.overflowX).toBeLessThanOrEqual(0);
  expect(m.wordmark.height, "the wordmark stays on one line").toBeLessThan(28);
  for (const b of m.buttons) {
    expect(b.width).toBeGreaterThanOrEqual(44);
    expect(b.height).toBeGreaterThanOrEqual(44);
  }
  const boxes = [m.wordmark, m.pill, ...m.buttons];
  for (let a = 0; a < boxes.length; a += 1)
    for (let c = a + 1; c < boxes.length; c += 1) expect(overlaps(boxes[a], boxes[c]), `boxes ${a} and ${c} overlap`).toBe(false);
}

for (const width of [320, 375]) {
  test(`header vừa một hàng ở cả ba trạng thái, menu nằm trọn trong màn hình (${width}px)`, { tag: ["@TC-DUCKERID-011"] }, async ({
    browser,
    page,
    gamePage,
    fakeIssuer,
    baseURL,
  }) => {
    // idle = the server HTML before any JS runs: the button is there but locked
    const noJs = await browser.newContext({ javaScriptEnabled: false, viewport: { width, height: 700 }, baseURL });
    const idle = new GamePage(await noJs.newPage());
    await idle.goto();
    await expect(idle.account.signInAnyState()).toBeDisabled();
    await expectHeaderFits(idle);
    await noJs.close();

    await page.setViewportSize({ width, height: 700 });
    await fakeIssuer();
    await gamePage.goto();
    await expect(gamePage.account.signInButton()).toBeEnabled();
    await expectHeaderFits(gamePage);

    await gamePage.account.signInButton().click();
    await expect(gamePage.account.trigger()).toBeVisible();
    await expectHeaderFits(gamePage);
    const before = await gamePage.account.trigger().boundingBox();
    await gamePage.account.trigger().click();
    await expect(gamePage.account.menu()).toBeVisible();
    const menu = (await gamePage.account.menu().boundingBox())!;
    expect(menu.x).toBeGreaterThanOrEqual(0);
    expect(menu.x + menu.width).toBeLessThanOrEqual(width);
    expect(menu.y).toBeGreaterThanOrEqual(0);
    expect(menu.y + menu.height).toBeLessThanOrEqual(700);
    expect(await gamePage.cssValue(gamePage.account.menu(), "position")).toBe("absolute");
    expect(await gamePage.account.trigger().boundingBox()).toEqual(before);
  });
}

test("phím mũi tên trong menu tài khoản không vào lượt, Esc chỉ đóng menu", { tag: ["@TC-DUCKERID-012"] }, async ({
  page,
  gamePage,
  fakeIssuer,
}) => {
  await fakeIssuer();
  await gamePage.goto();
  await gamePage.account.signInButton().click();
  await gamePage.account.trigger().click();
  await expect(gamePage.account.menu()).toBeVisible();
  await page.keyboard.press("ArrowUp");
  await page.keyboard.press("ArrowDown");
  await expect(gamePage.menu()).toBeVisible();
  await expect(gamePage.ready()).toHaveCount(0);
  await page.keyboard.press("Escape");
  await expect(gamePage.account.menu()).toHaveCount(0);
  await expect(gamePage.menu()).toBeVisible();
});
