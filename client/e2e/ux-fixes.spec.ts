import { expect, test } from "@playwright/test";

import {
  enterReady,
  expectGameOver,
  flapWithKeyboard,
  gotoGame
} from "./helpers";

/**
 * Hồi quy cho 6 phát hiện của đợt persona review 2026-09-11 —
 * xem `docs/ux-reviews/2026-09-11-full-red-routes.md`.
 *
 * Mỗi test đặt tên theo mã phát hiện để khi nó đỏ lại, người sửa biết ngay
 * người dùng nào đã vấp và vấp ra sao.
 */
test.describe("Persona review 2026-09-11", () => {
  test.describe("F-04a · Space ở menu bắt đầu lượt", () => {
    test("Hạnh chỉ dùng bàn phím vẫn vào chơi được bằng Space", async ({
      page
    }) => {
      await gotoGame(page);

      await flapWithKeyboard(page);

      await expect(page.getByTestId("menu-overlay")).toBeHidden();
      await expect(page.getByTestId("ready-overlay")).toBeVisible();
    });

    test("chạm vào nền menu KHÔNG ném người chơi vào lượt mới", async ({
      page
    }) => {
      await gotoGame(page);

      // Góc trên bên trái vùng chơi: ngoài hộp menu, vẫn trong container.
      await page
        .getByTestId("game-container")
        .click({ position: { x: 8, y: 8 } });

      await expect(page.getByTestId("menu-overlay")).toBeVisible();
      await expect(page.getByTestId("ready-overlay")).toBeHidden();
    });
  });

  test("F-04b · Tab lần đầu tới nút Chơi, không phải nút tắt tiếng", async ({
    page
  }) => {
    await gotoGame(page);

    await expect(page.getByTestId("btn-play")).toBeFocused();
  });

  test("F-02 · nhãn kỷ lục trên header đọc được bằng mắt", async ({ page }) => {
    await gotoGame(page);

    // Không phải sr-only: người nhìn bằng mắt phải thấy chữ.
    await expect(page.getByTestId("best-score-label")).toBeVisible();
    await expect(page.getByTestId("best-score-label")).toHaveText("Kỷ lục");
  });

  test("F-03 · nút loa nói trạng thái hiện tại bằng chữ", async ({ page }) => {
    await gotoGame(page);

    const state = page.getByTestId("sound-state");
    await expect(state).toBeVisible();
    await expect(state).toHaveText("Bật");

    await page.getByTestId("btn-sound-menu").click();

    await expect(state).toHaveText("Tắt");
  });

  test("F-06 · câu giải thích trò chơi nổi hơn tên thương hiệu", async ({
    page
  }) => {
    await gotoGame(page);

    const sizeOf = async (testId: string): Promise<number> =>
      page
        .getByTestId(testId)
        .evaluate((node) => parseFloat(getComputedStyle(node).fontSize));

    const title = await sizeOf("menu-title");
    const tagline = await sizeOf("menu-tagline");

    expect(title).toBeLessThanOrEqual(28);
    expect(tagline).toBeGreaterThanOrEqual(16);
  });

  test.describe("F-01 · dạy rằng chạm là một NHỊP", () => {
    test("màn sẵn sàng nói rõ phải chạm liên tục", async ({ page }) => {
      await gotoGame(page);
      await enterReady(page);

      await expect(page.getByTestId("ready-overlay")).toContainText("liên tục");
    });

    test("thua với 0 điểm thì được giải thích vì sao vịt rơi", async ({
      page
    }) => {
      await gotoGame(page);
      await enterReady(page);
      await flapWithKeyboard(page);
      await expectGameOver(page);

      await expect(page.getByTestId("gameover-overlay")).toContainText("0");
      await expect(page.getByTestId("zero-score-hint")).toBeVisible();
    });
  });

  test("F-05 · chạm ngoài hộp thì hộp nháy chứ không chơi lại", async ({
    page
  }) => {
    await gotoGame(page);
    await enterReady(page);
    await flapWithKeyboard(page);
    await expectGameOver(page);

    const card = page.getByTestId("gameover-card");
    await expect(card).toHaveAttribute("data-nudge-count", "0");

    await page
      .getByTestId("gameover-overlay")
      .click({ position: { x: 6, y: 6 } });

    /**
     * Đếm cộng dồn chứ không đọc cờ `data-nudge`: cờ đó chỉ sống 400ms,
     * dưới tải nặng hỏi tới nơi là đã tắt mất.
     */
    await expect(card).toHaveAttribute("data-nudge-count", "1");
    // Quan trọng: KHÔNG được tự chơi lại — Cô Liên cần thời gian đọc điểm.
    await expect(page.getByTestId("gameover-overlay")).toBeVisible();
  });

  /**
   * README hứa "Switching browser tabs pauses the game by itself, so you do
   * not come back to a dead bird", và đây là nỗi sợ số một của persona chỉ
   * dùng bàn phím. Lời hứa từng thủng đúng một khe: engine chỉ tự dừng khi
   * phase là "playing", mà phase chỉ chuyển sang "playing" ở bước mô phỏng
   * KẾ TIẾP sau cú vỗ đầu — nên vỗ một cái rồi chuyển tab liền là mất lượt.
   */
  test("chuyển tab ngay sau cú vỗ đầu tiên thì KHÔNG mất lượt", async ({
    page
  }) => {
    await gotoGame(page);
    await enterReady(page);

    /**
     * Vỗ cánh và ẩn tab trong CÙNG một tác vụ đồng bộ. Khe hở chỉ rộng
     * chưa tới một frame (~16ms), nên nếu tách làm hai lệnh Playwright thì
     * requestAnimationFrame đã kịp chen vào, phase đã là "playing", và bài
     * test đi ngang qua con bug mà không chạm vào nó.
     */
    await page.evaluate(() => {
      window.dispatchEvent(
        new KeyboardEvent("keydown", { code: "Space", cancelable: true })
      );
      Object.defineProperty(document, "visibilityState", {
        value: "hidden",
        configurable: true
      });
      document.dispatchEvent(new Event("visibilitychange"));
    });

    // Đi vắng lâu hơn nhiều so với quãng sống của con vịt khi không ai vỗ.
    await page.waitForTimeout(3000);

    await page.evaluate(() => {
      Object.defineProperty(document, "visibilityState", {
        value: "visible",
        configurable: true
      });
      document.dispatchEvent(new Event("visibilitychange"));
    });

    // Quay lại mà thấy màn thua nghĩa là lượt đã chết trong lúc mình đi vắng.
    await expect(page.getByTestId("gameover-overlay")).toBeHidden();
  });
});
