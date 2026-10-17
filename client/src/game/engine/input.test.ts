// @vitest-environment happy-dom

import { describe, expect, it, vi } from "vitest";

import { bindInput } from "./input";

/** Bắn một phím xuống `window` đúng như trình duyệt làm. */
const pressKey = (code: string): void => {
  window.dispatchEvent(
    new KeyboardEvent("keydown", { code, cancelable: true })
  );
};

/**
 * happy-dom chưa có PointerEvent nên dựng tạm từ Event — `bindInput` chỉ
 * gọi `preventDefault`, không đọc toạ độ.
 */
const pressPointer = (target: HTMLElement): void => {
  target.dispatchEvent(new Event("pointerdown", { cancelable: true }));
};

const setup = (options: Partial<Parameters<typeof bindInput>[0]> = {}) => {
  const target = document.createElement("div");
  document.body.appendChild(target);
  const onFlap = vi.fn();
  const unbind = bindInput({ target, onFlap, ...options });
  return { target, onFlap, unbind };
};

describe("bindInput", () => {
  it("phím vỗ cánh gọi onFlap khi không khai báo onKeyboardFlap", () => {
    const { onFlap, unbind } = setup();

    pressKey("Space");

    expect(onFlap).toHaveBeenCalledTimes(1);
    unbind();
  });

  /**
   * F-04a: ở màn hình chờ, Space phải bắt đầu lượt chứ không rơi vào hư
   * không. Tầng trên cần phân biệt được nguồn bàn phím để làm việc đó.
   */
  it("phím vỗ cánh ưu tiên onKeyboardFlap khi có khai báo", () => {
    const onKeyboardFlap = vi.fn();
    const { onFlap, unbind } = setup({ onKeyboardFlap });

    pressKey("Space");

    expect(onKeyboardFlap).toHaveBeenCalledTimes(1);
    expect(onFlap).not.toHaveBeenCalled();
    unbind();
  });

  /**
   * Cú chạm KHÔNG được đi qua onKeyboardFlap: nếu đi qua thì mọi cú chạm
   * hụt vào nền menu đều ném người chơi thẳng vào lượt mới.
   */
  it("cú chạm vẫn gọi onFlap dù có onKeyboardFlap", () => {
    const onKeyboardFlap = vi.fn();
    const { target, onFlap, unbind } = setup({ onKeyboardFlap });

    pressPointer(target);

    expect(onFlap).toHaveBeenCalledTimes(1);
    expect(onKeyboardFlap).not.toHaveBeenCalled();
    unbind();
  });

  it("gỡ binding thì không còn nhận phím", () => {
    const { onFlap, unbind } = setup();

    unbind();
    pressKey("Space");

    expect(onFlap).not.toHaveBeenCalled();
  });
});
