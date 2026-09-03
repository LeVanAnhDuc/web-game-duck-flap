import { expect, test } from "@playwright/test";

import { bestKey, gotoGame, readStoredSettings } from "./helpers";

test.describe("Cài đặt", () => {
  test("chọn độ khó Khó thì lần sau mở game vẫn giữ nguyên", async ({
    page
  }) => {
    await gotoGame(page);

    await page.getByTestId("btn-settings").click();
    await expect(page.getByTestId("settings-panel")).toBeVisible();

    await page.getByTestId("btn-difficulty-hard").click();
    await expect(page.getByTestId("btn-difficulty-hard")).toHaveAttribute(
      "aria-pressed",
      "true"
    );

    await page.getByTestId("btn-close-settings").click();
    await expect(page.getByTestId("settings-panel")).toBeHidden();

    await page.reload();

    // Người chơi quay lại phải thấy đúng độ khó mình đã chọn.
    await expect(page.getByText("Kỷ lục mức Khó")).toBeVisible();
    expect(await readStoredSettings(page)).toMatchObject({
      difficulty: "hard"
    });
  });

  test("mỗi độ khó có bảng kỷ lục riêng", async ({ page }) => {
    await gotoGame(page, {
      [bestKey("normal")]: "7",
      [bestKey("hard")]: "2"
    });

    // Mặc định là mức Thường nên kỷ lục hiển thị phải là của mức đó.
    await expect(page.getByTestId("best-score")).toHaveText("7");

    await page.getByTestId("btn-settings").click();
    await page.getByTestId("btn-difficulty-hard").click();

    // Đổi độ khó là đổi luôn bảng kỷ lục, không phải giữ con số cũ.
    await expect(page.getByTestId("best-score")).toHaveText("2");
  });
});
