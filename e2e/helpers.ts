import { expect, type Page } from "@playwright/test";

/** Khai báo tại chỗ để bộ e2e không phụ thuộc vào alias đường dẫn của app. */
export type Difficulty = "easy" | "normal" | "hard";

/** Khoá localStorage của cài đặt — app đọc đúng chuỗi này. */
export const SETTINGS_KEY = "flappy-bird:settings";

/** Mỗi độ khó một kỷ lục riêng, khoá tách theo tên độ khó. */
export const bestKey = (difficulty: Difficulty): string =>
  `flappy-bird:best:${difficulty}`;

/**
 * Cờ đánh dấu đã gieo dữ liệu cho tab này. Đặt ở sessionStorage vì nó
 * sống qua reload nhưng KHÔNG lẫn vào các khoá localStorage mà app đọc —
 * nhờ vậy test nạp lại trang vẫn giữ được thứ vừa lưu.
 */
const SEED_FLAG = "e2e:seeded";

/**
 * Một lượt không vỗ cánh chỉ kéo dài khoảng một giây; để dư rất nhiều cho
 * máy CI chậm mà vẫn phát hiện được trường hợp game treo hẳn.
 */
const GAME_OVER_TIMEOUT = 15_000;

export type StorageSeed = Record<string, string>;

/**
 * Mở game với localStorage đã ở đúng trạng thái mong muốn.
 *
 * Phải gieo bằng addInitScript: app đọc localStorage ngay trong effect đầu
 * tiên sau khi mount, nên xoá/ghi sau `goto` là đã muộn.
 */
export const gotoGame = async (
  page: Page,
  seed: StorageSeed = {}
): Promise<void> => {
  await page.addInitScript(
    ({ entries, flag }: { entries: StorageSeed; flag: string }) => {
      // Chỉ gieo ở lần tải đầu: test nạp lại trang cần thấy dữ liệu app đã ghi.
      if (window.sessionStorage.getItem(flag)) {
        return;
      }
      window.sessionStorage.setItem(flag, "1");
      window.localStorage.clear();
      for (const [key, value] of Object.entries(entries)) {
        window.localStorage.setItem(key, value);
      }
    },
    { entries: seed, flag: SEED_FLAG }
  );

  await page.goto("/");
  await expect(page.getByTestId("menu-overlay")).toBeVisible();
};

/** Từ màn hình chờ bấm Chơi để vào phase "ready". */
export const enterReady = async (page: Page): Promise<void> => {
  await page.getByTestId("btn-play").click();
  await expect(page.getByTestId("ready-overlay")).toBeVisible();
};

/** Vỗ cánh bằng bàn phím — cách vào phase "playing" nhanh và ổn định nhất. */
export const flapWithKeyboard = async (page: Page): Promise<void> => {
  await page.keyboard.press("Space");
};

/**
 * Không vỗ cánh nữa thì chim rơi và chết. Chờ chính overlay xuất hiện chứ
 * không chờ một khoảng thời gian cố định.
 */
export const expectGameOver = async (page: Page): Promise<void> => {
  await expect(page.getByTestId("gameover-overlay")).toBeVisible({
    timeout: GAME_OVER_TIMEOUT
  });
};

/** Đi trọn một lượt: Chơi → vỗ cánh → buông tay cho chim rơi chết. */
export const playUntilGameOver = async (page: Page): Promise<void> => {
  await enterReady(page);
  await flapWithKeyboard(page);
  await expectGameOver(page);
};

/** Đọc cài đặt đang lưu trong localStorage. */
export const readStoredSettings = async (
  page: Page
): Promise<{ soundEnabled?: boolean; difficulty?: string } | null> =>
  page.evaluate((key: string) => {
    const raw = window.localStorage.getItem(key);
    return raw === null ? null : JSON.parse(raw);
  }, SETTINGS_KEY);
