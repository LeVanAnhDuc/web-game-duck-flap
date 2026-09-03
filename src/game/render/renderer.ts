import { WORLD_HEIGHT, WORLD_WIDTH } from "@/game/core/constants";
import type { GameState } from "@/game/core/types";
import { drawBackground } from "@/game/render/layers/background";
import { drawBird } from "@/game/render/layers/bird";
import { drawGround } from "@/game/render/layers/ground";
import { drawPipes } from "@/game/render/layers/pipes";

import { PALETTE } from "./palette";
import type { Viewport } from "./viewport";

/**
 * Vẽ một frame. Mọi lớp bên dưới chỉ làm việc với toạ độ logic 0..288 / 0..512;
 * chuyện dpr, phóng to và canh giữa được gói trọn trong transform ở đây.
 */
export const render = (
  ctx: CanvasRenderingContext2D,
  state: GameState,
  viewport: Viewport
): void => {
  ctx.save();

  // Xoá theo pixel thật: phần lề ngoài thế giới phải trong suốt để nền trang lộ ra.
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  const unit = viewport.dpr * viewport.scale;
  ctx.setTransform(
    unit,
    0,
    0,
    unit,
    viewport.offsetX * viewport.dpr,
    viewport.offsetY * viewport.dpr
  );

  // Cắt đúng khung thế giới: không lớp nào lỡ tay vẽ tràn ra vùng lề.
  ctx.beginPath();
  ctx.rect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
  ctx.clip();

  drawBackground(ctx, state);
  drawPipes(ctx, state);
  drawGround(ctx, state);
  drawBird(ctx, state);

  if (state.phase === "gameover") {
    // Làm tối cả thế giới để HUD (do tầng React vẽ) luôn đủ tương phản.
    ctx.fillStyle = PALETTE.overlay;
    ctx.fillRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
  }

  ctx.restore();
};
