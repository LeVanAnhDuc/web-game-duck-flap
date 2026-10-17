import { expect, test } from "@playwright/test";

import {
  enterReady,
  expectGameOver,
  flapWithKeyboard,
  gotoGame,
  playUntilGameOver
} from "./helpers";

test.describe("Luồng chơi", () => {
  test("người chơi bấm Chơi, vỗ cánh rồi để chim rơi và thua", async ({
    page
  }) => {
    await gotoGame(page);

    await enterReady(page);

    /**
     * Kiểm điểm số TRƯỚC khi vỗ cánh. Ở "ready" con chim chưa rơi nên
     * không có đồng hồ đếm ngược nào chạy; vỗ cánh xong thì chim chỉ sống
     * khoảng một giây rưỡi, và dưới tải nặng Playwright hỏi tới nơi thì
     * HUD đã tháo mất rồi — đó là chập chờn, không phải lỗi sản phẩm.
     */
    await expect(page.getByTestId("hud-score")).toBeVisible();

    await flapWithKeyboard(page);

    // Rời "ready" là lời hướng dẫn phải biến mất, nhường chỗ cho điểm số.
    await expect(page.getByTestId("ready-overlay")).toBeHidden();

    await expectGameOver(page);
  });

  test("bấm Chơi lại sau khi thua thì vào lượt mới với điểm 0", async ({
    page
  }) => {
    await gotoGame(page);
    await playUntilGameOver(page);

    await page.getByTestId("btn-restart").click();

    await expect(page.getByTestId("ready-overlay")).toBeVisible();
    // Điểm phải được đặt lại, nếu không lượt mới sẽ cộng dồn lượt cũ.
    await expect(page.getByTestId("hud-score")).toHaveText("0");
  });

  test("bấm Về menu sau khi thua thì quay lại màn hình chờ", async ({
    page
  }) => {
    await gotoGame(page);
    await playUntilGameOver(page);

    await page.getByTestId("btn-menu").click();

    await expect(page.getByTestId("menu-overlay")).toBeVisible();
    await expect(page.getByTestId("gameover-overlay")).toBeHidden();
  });

  test("nhấn P để tạm dừng rồi bấm Tiếp tục thì game chạy tiếp", async ({
    page
  }) => {
    await gotoGame(page);
    await enterReady(page);

    // Vỗ cánh xong tạm dừng ngay: lúc dừng thế giới đóng băng nên không
    // có nguy cơ chim chết trong lúc test đang kiểm tra lớp phủ.
    await flapWithKeyboard(page);
    await page.keyboard.press("p");

    await expect(page.getByTestId("pause-overlay")).toBeVisible();

    await page.getByTestId("btn-resume").click();
    await expect(page.getByTestId("pause-overlay")).toBeHidden();

    // Bằng chứng game thật sự chạy tiếp chứ không kẹt ở trạng thái đóng băng.
    await expectGameOver(page);
  });
});
