import { expect, test } from "@playwright/test";

import { enterReady, expectGameOver, gotoGame } from "./helpers";

test.describe("Thao tác vỗ cánh", () => {
  test("chạm giữa vùng chơi ở màn sẵn sàng thì bắt đầu bay", async ({
    page
  }) => {
    await gotoGame(page);
    await enterReady(page);

    const container = page.getByTestId("game-container");

    /**
     * Hồi quy cho lỗi "lớp phủ nuốt cú chạm": điểm chính giữa vùng chơi
     * phải rơi trúng canvas. Nếu ready-overlay lấy lại pointer-events thì
     * chỗ này trả về "ready-overlay" và người chơi hết đường vỗ cánh.
     */
    const topmostTestId = await page.evaluate(() => {
      const element = document.querySelector("[data-testid='game-container']");
      if (!element) {
        return null;
      }
      const rect = element.getBoundingClientRect();
      const hit = document.elementFromPoint(
        rect.left + rect.width / 2,
        rect.top + rect.height / 2
      );
      return hit?.getAttribute("data-testid") ?? null;
    });
    expect(topmostTestId).toBe("game-canvas");

    await container.click();

    await expect(page.getByTestId("ready-overlay")).toBeHidden();
    await expectGameOver(page);
  });

  test.describe("trên điện thoại", () => {
    test.skip(
      ({ hasTouch }) => !hasTouch,
      "Chỉ chạy trên project có màn hình cảm ứng"
    );

    test("chơi được trọn một lượt chỉ bằng cách chạm", async ({ page }) => {
      await gotoGame(page);

      await page.getByTestId("btn-play").tap();
      await expect(page.getByTestId("ready-overlay")).toBeVisible();

      await page.getByTestId("game-container").tap();
      await expect(page.getByTestId("ready-overlay")).toBeHidden();

      await expectGameOver(page);
    });
  });
});
