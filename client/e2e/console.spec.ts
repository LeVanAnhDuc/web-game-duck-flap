import { expect, test } from "@playwright/test";

import { expectGameOver, gotoGame, playUntilGameOver } from "./helpers";

test("chơi trọn một lượt mà không sinh lỗi nào trên console", async ({
  page
}) => {
  const problems: string[] = [];

  // Gắn listener TRƯỚC khi điều hướng, nếu không lỗi lúc tải trang sẽ lọt.
  page.on("console", (message) => {
    if (message.type() === "error") {
      problems.push(`console.error: ${message.text()}`);
    }
  });
  page.on("pageerror", (error) => {
    problems.push(`pageerror: ${error.message}`);
  });

  await gotoGame(page);
  await playUntilGameOver(page);

  // Chơi lại một lượt nữa để phủ cả nhánh dựng lại vòng lặp và lưu kỷ lục.
  await page.getByTestId("btn-restart").click();
  await expect(page.getByTestId("ready-overlay")).toBeVisible();
  await page.keyboard.press("Space");
  await expectGameOver(page);

  expect(problems).toEqual([]);
});
