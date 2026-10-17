import { test, expect } from "@/fixtures";

// The game is a static export (next.config.ts output: "export") served from GitHub Pages under /web-game-duck-flap/.
// The same spec runs on dev (root) and on ENV=prd (the sub-path), so a wrong basePath / assetPrefix shows up as a 404.

test("bản xuất tĩnh tải đủ mọi tài nguyên dưới đường dẫn gốc và vào chơi được", { tag: ["@TC-DEPLOY-001", "@smoke"] }, async ({
  page,
  gamePage,
  baseURL,
}) => {
  const broken: string[] = [];
  const assets: string[] = [];
  page.on("response", (r) => {
    if (r.status() >= 400) broken.push(`${r.status()} ${r.url()}`);
  });
  page.on("requestfailed", (r) => broken.push(`failed ${r.url()}`));
  page.on("request", (r) => {
    if (["script", "stylesheet"].includes(r.resourceType())) assets.push(r.url());
  });
  await gamePage.goto();
  await gamePage.play();
  expect(broken).toEqual([]);
  expect(assets.length).toBeGreaterThan(0);
  for (const url of assets) expect(url.startsWith(baseURL!), url).toBe(true);
});
