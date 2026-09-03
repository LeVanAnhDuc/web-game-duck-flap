// @vitest-environment happy-dom

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { LocalScoreRepository } from "./localScoreRepository";

const KEY = (difficulty: string) => `flappy-bird:best:${difficulty}`;

describe("LocalScoreRepository", () => {
  let repo: LocalScoreRepository;

  beforeEach(() => {
    window.localStorage.clear();
    repo = new LocalScoreRepository();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("trả 0 khi chưa có kỷ lục nào", async () => {
    await expect(repo.getBest("normal")).resolves.toBe(0);
  });

  it("ghi rồi đọc lại đúng giá trị", async () => {
    await expect(repo.saveBest("normal", 12)).resolves.toBe(true);
    await expect(repo.getBest("normal")).resolves.toBe(12);
    expect(window.localStorage.getItem(KEY("normal"))).toBe("12");
  });

  it("giữ kỷ lục riêng cho từng độ khó", async () => {
    await repo.saveBest("easy", 30);
    await repo.saveBest("hard", 4);

    await expect(repo.getBest("easy")).resolves.toBe(30);
    await expect(repo.getBest("hard")).resolves.toBe(4);
    await expect(repo.getBest("normal")).resolves.toBe(0);
  });

  it("không ghi đè khi điểm mới thấp hơn hoặc bằng", async () => {
    await repo.saveBest("normal", 20);

    await expect(repo.saveBest("normal", 5)).resolves.toBe(false);
    await expect(repo.saveBest("normal", 20)).resolves.toBe(false);
    await expect(repo.getBest("normal")).resolves.toBe(20);
  });

  it("trả true khi phá kỷ lục", async () => {
    await repo.saveBest("normal", 3);
    await expect(repo.saveBest("normal", 4)).resolves.toBe(true);
    await expect(repo.getBest("normal")).resolves.toBe(4);
  });

  it("coi giá trị rác trong localStorage là 0", async () => {
    window.localStorage.setItem(KEY("normal"), "không-phải-số");
    await expect(repo.getBest("normal")).resolves.toBe(0);

    window.localStorage.setItem(KEY("normal"), "-5");
    await expect(repo.getBest("normal")).resolves.toBe(0);

    window.localStorage.setItem(KEY("normal"), "");
    await expect(repo.getBest("normal")).resolves.toBe(0);
  });

  it("không sập khi getItem ném lỗi", async () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("chế độ ẩn danh chặn localStorage");
    });

    await expect(repo.getBest("normal")).resolves.toBe(0);
  });

  it("không sập khi setItem ném lỗi", async () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("hết dung lượng");
    });

    await expect(repo.saveBest("normal", 9)).resolves.toBe(true);
  });

  it("bỏ qua điểm không hợp lệ", async () => {
    await expect(repo.saveBest("normal", Number.NaN)).resolves.toBe(false);
    await expect(repo.saveBest("normal", -1)).resolves.toBe(false);
    await expect(repo.getBest("normal")).resolves.toBe(0);
  });
});
