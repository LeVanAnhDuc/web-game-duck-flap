// @vitest-environment happy-dom

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { LocalSettingsRepository } from "./localSettingsRepository";
import { DEFAULT_SETTINGS } from "./types";

const STORAGE_KEY = "flappy-bird:settings";

describe("LocalSettingsRepository", () => {
  let repo: LocalSettingsRepository;

  beforeEach(() => {
    window.localStorage.clear();
    repo = new LocalSettingsRepository();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("trả mặc định khi chưa lưu gì", () => {
    expect(repo.load()).toEqual(DEFAULT_SETTINGS);
  });

  it("ghi rồi đọc lại nguyên vẹn", () => {
    repo.save({ soundEnabled: false, difficulty: "hard" });

    expect(repo.load()).toEqual({ soundEnabled: false, difficulty: "hard" });
  });

  it("trả mặc định khi JSON hỏng", () => {
    window.localStorage.setItem(STORAGE_KEY, "{ đây không phải json");

    expect(repo.load()).toEqual(DEFAULT_SETTINGS);
  });

  it("trả mặc định khi giá trị không phải object", () => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify("chuỗi"));
    expect(repo.load()).toEqual(DEFAULT_SETTINGS);

    window.localStorage.setItem(STORAGE_KEY, "null");
    expect(repo.load()).toEqual(DEFAULT_SETTINGS);
  });

  it("thay từng trường hỏng bằng mặc định, giữ lại trường hợp lệ", () => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ soundEnabled: "có", difficulty: "hard" })
    );

    expect(repo.load()).toEqual({
      soundEnabled: DEFAULT_SETTINGS.soundEnabled,
      difficulty: "hard"
    });
  });

  it("loại độ khó không nằm trong danh sách", () => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ soundEnabled: false, difficulty: "impossible" })
    );

    expect(repo.load()).toEqual({
      soundEnabled: false,
      difficulty: DEFAULT_SETTINGS.difficulty
    });
  });

  it("không sập khi getItem ném lỗi", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("chế độ ẩn danh chặn localStorage");
    });

    expect(repo.load()).toEqual(DEFAULT_SETTINGS);
  });

  it("không sập khi setItem ném lỗi", () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("hết dung lượng");
    });

    expect(() =>
      repo.save({ soundEnabled: true, difficulty: "easy" })
    ).not.toThrow();
  });
});
