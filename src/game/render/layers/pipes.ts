import { FLOOR_Y, PIPE_WIDTH } from "@/game/core/constants";
import type { GameState, Pipe } from "@/game/core/types";
import { PALETTE } from "@/game/render/palette";

/** Miệng ống loe ra hai bên thân, đủ để đọc được như một khối riêng. */
const CAP_OVERHANG = 5;
const CAP_HEIGHT = 22;
const CAP_WIDTH = PIPE_WIDTH + CAP_OVERHANG * 2;

const BODY_RADIUS = 5;
const CAP_RADIUS = 7;

/** Dải sáng dọc bên trong thân, mô phỏng ánh sáng hắt trên mặt trụ. */
const SHINE_X = 9;
const SHINE_WIDTH = 8;

const OUTLINE_WIDTH = 2;

/** Thân ống kéo dài ra ngoài màn hình để không bao giờ thấy đầu hở. */
const BODY_OVERSHOOT = 40;

type PipeGradients = {
  body: CanvasGradient;
  cap: CanvasGradient;
};

let cachedCtx: CanvasRenderingContext2D | null = null;
let cachedGradients: PipeGradients | null = null;

/**
 * Ống nào cũng vẽ trong hệ toạ độ đã dịch về mép trái của nó, nên hai gradient
 * ngang này dùng lại được cho mọi ống ở mọi frame — không tạo object mỗi frame.
 */
const getGradients = (ctx: CanvasRenderingContext2D): PipeGradients => {
  if (cachedCtx === ctx && cachedGradients) return cachedGradients;

  const body = ctx.createLinearGradient(0, 0, PIPE_WIDTH, 0);
  body.addColorStop(0, PALETTE.pipe.dark);
  body.addColorStop(0.16, PALETTE.pipe.body);
  body.addColorStop(0.5, PALETTE.pipe.body);
  body.addColorStop(1, PALETTE.pipe.dark);

  const cap = ctx.createLinearGradient(
    -CAP_OVERHANG,
    0,
    PIPE_WIDTH + CAP_OVERHANG,
    0
  );
  cap.addColorStop(0, PALETTE.pipe.capDark);
  cap.addColorStop(0.18, PALETTE.pipe.capLight);
  cap.addColorStop(0.45, PALETTE.pipe.capBody);
  cap.addColorStop(1, PALETTE.pipe.capDark);

  cachedCtx = ctx;
  cachedGradients = { body, cap };
  return cachedGradients;
};

const roundedRectPath = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
): void => {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + width, y, x + width, y + height, r);
  ctx.arcTo(x + width, y + height, x, y + height, r);
  ctx.arcTo(x, y + height, x, y, r);
  ctx.arcTo(x, y, x + width, y, r);
  ctx.closePath();
};

/**
 * Vẽ một nửa ống trong hệ toạ độ đã dịch tới mép trái ống.
 * `gapEdgeY` là mép ống phía khe hở, `direction` là hướng thân ống chạy đi
 * (-1: lên trên, 1: xuống dưới).
 */
const drawHalfPipe = (
  ctx: CanvasRenderingContext2D,
  gradients: PipeGradients,
  gapEdgeY: number,
  direction: number,
  bodyLength: number
): void => {
  const capTop = direction < 0 ? gapEdgeY - CAP_HEIGHT : gapEdgeY;
  // Thân chạy hẳn tới mép khe hở rồi bị miệng ống phủ lên, nhờ vậy góc bo của
  // thân không để lộ khe hở sáng ở chỗ nối.
  const bodyTop = direction < 0 ? gapEdgeY - bodyLength : gapEdgeY;

  ctx.lineWidth = OUTLINE_WIDTH;
  ctx.strokeStyle = PALETTE.pipe.edge;

  // Thân trước, miệng sau: miệng đè lên thân nên mối nối luôn sạch.
  ctx.fillStyle = gradients.body;
  roundedRectPath(ctx, 0, bodyTop, PIPE_WIDTH, bodyLength, BODY_RADIUS);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = PALETTE.pipe.light;
  ctx.globalAlpha = 0.55;
  roundedRectPath(ctx, SHINE_X, bodyTop, SHINE_WIDTH, bodyLength, 4);
  ctx.fill();
  ctx.globalAlpha = 1;

  ctx.fillStyle = gradients.cap;
  roundedRectPath(
    ctx,
    -CAP_OVERHANG,
    capTop,
    CAP_WIDTH,
    CAP_HEIGHT,
    CAP_RADIUS
  );
  ctx.fill();
  ctx.stroke();
};

const drawPipe = (
  ctx: CanvasRenderingContext2D,
  gradients: PipeGradients,
  pipe: Pipe
): void => {
  ctx.save();
  ctx.translate(pipe.x, 0);

  const gapBottom = pipe.gapY + pipe.gapHeight;
  drawHalfPipe(ctx, gradients, pipe.gapY, -1, pipe.gapY + BODY_OVERSHOOT);
  drawHalfPipe(
    ctx,
    gradients,
    gapBottom,
    1,
    Math.max(CAP_HEIGHT, FLOOR_Y - gapBottom) + BODY_OVERSHOOT
  );

  ctx.restore();
};

export const drawPipes = (
  ctx: CanvasRenderingContext2D,
  state: GameState
): void => {
  ctx.save();
  ctx.lineJoin = "round";
  const gradients = getGradients(ctx);

  for (const pipe of state.pipes) {
    drawPipe(ctx, gradients, pipe);
  }

  ctx.restore();
};
