import { test, expect } from "@/fixtures";

// docs/decisions/0001-ducker-id-sign-in.md: the deployed build ships with the Ducker ID flag off — no button, no menu,
// the URL is not read, storage is not touched, nothing goes to the network. Runs on the "app" project (flag-off export).

test("cờ tắt thì không có nút đăng nhập, không chạm storage, không request ra ngoài", { tag: ["@TC-DUCKERID-001", "@smoke"] }, async ({
  page,
  gamePage,
  baseURL,
}) => {
  const site = new URL(baseURL!).origin;
  const outside: string[] = [];
  page.on("request", (r) => {
    const url = r.url();
    if (/^https?:/.test(url) && new URL(url).origin !== site) outside.push(url);
  });
  await gamePage.goto({ query: "code=x&state=y" });
  await expect(gamePage.account.signInAnyState()).toHaveCount(0);
  await expect(gamePage.account.trigger()).toHaveCount(0);
  expect(await gamePage.sessionKeys()).toEqual([]);
  // with the flag off the URL is not read either: a stray ?code= is left exactly where it was
  expect(await gamePage.urlSearch()).toContain("code=x");
  expect(outside).toEqual([]);
});
