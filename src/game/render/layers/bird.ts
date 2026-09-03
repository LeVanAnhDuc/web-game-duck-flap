import { BIRD_HEIGHT, BIRD_WIDTH } from "@/game/core/constants";
import type { Bird, GameState } from "@/game/core/types";
import { PALETTE } from "@/game/render/palette";

const TAU = Math.PI * 2;

const BODY_RX = BIRD_WIDTH / 2;
const BODY_RY = BIRD_HEIGHT / 2;

const OUTLINE_WIDTH = 2;

/** Nhịp vỗ cánh nền, radian/giây. */
const FLAP_SPEED = 9;

/** Vận tốc bay lên tương ứng với nhịp vỗ mạnh nhất. */
const RISE_REFERENCE = 320;

/** Khớp vai — cánh quay quanh điểm này chứ không quanh tâm thân. */
const SHOULDER_X = -1;
const SHOULDER_Y = -3;

let cachedCtx: CanvasRenderingContext2D | null = null;
let cachedGradient: CanvasGradient | null = null;

const clamp01 = (value: number): number => Math.min(Math.max(value, 0), 1);

/**
 * Thân luôn được vẽ quanh gốc toạ độ cục bộ nên gradient dọc này dùng lại
 * được ở mọi frame, mọi vị trí của chim.
 */
const getBodyGradient = (ctx: CanvasRenderingContext2D): CanvasGradient => {
  if (cachedCtx === ctx && cachedGradient) return cachedGradient;

  const gradient = ctx.createLinearGradient(0, -BODY_RY, 0, BODY_RY);
  gradient.addColorStop(0, PALETTE.bird.bodyTop);
  gradient.addColorStop(1, PALETTE.bird.bodyBottom);

  cachedCtx = ctx;
  cachedGradient = gradient;
  return gradient;
};

/**
 * Góc cánh suy hoàn toàn từ state nên hình vẽ luôn tất định.
 * Hai sóng cùng pha gốc được trộn theo mức "đang bay lên": lúc vọt lên nghiêng
 * về sóng tần số gấp đôi (vỗ nhanh), lúc rơi thì biên độ gần như tắt và cánh
 * duỗi ra như đang lượn. Trộn thay vì đổi tần số trực tiếp để pha không nhảy
 * cóc mỗi khi vận tốc đổi dấu.
 */
const computeWingAngle = (time: number, velocityY: number): number => {
  const rising = clamp01(-velocityY / RISE_REFERENCE);
  const phase = time * FLAP_SPEED;
  const wave =
    (1 - rising) * Math.sin(phase) + rising * Math.sin(phase * 2 + Math.PI / 2);
  const amplitude = 0.2 + rising * 0.75;
  const glide = (1 - rising) * 0.4;

  return wave * amplitude - glide;
};

const drawTail = (ctx: CanvasRenderingContext2D): void => {
  ctx.beginPath();
  ctx.moveTo(-BODY_RX + 4, -3);
  ctx.lineTo(-BODY_RX - 6, -9);
  ctx.lineTo(-BODY_RX - 4, 4);
  ctx.closePath();
  ctx.fillStyle = PALETTE.bird.wing;
  ctx.fill();
  ctx.stroke();
};

const drawBody = (ctx: CanvasRenderingContext2D): void => {
  ctx.beginPath();
  ctx.ellipse(0, 0, BODY_RX, BODY_RY, 0, 0, TAU);
  ctx.fillStyle = getBodyGradient(ctx);
  ctx.fill();
  ctx.stroke();

  // Mảng bụng sáng đặt lệch xuống dưới, gợi khối tròn mà không cần đổ bóng.
  ctx.beginPath();
  ctx.ellipse(2, 4.5, 11, 6, 0, 0, TAU);
  ctx.fillStyle = PALETTE.bird.belly;
  ctx.globalAlpha = 0.6;
  ctx.fill();
  ctx.globalAlpha = 1;
};

const drawBeak = (ctx: CanvasRenderingContext2D): void => {
  ctx.beginPath();
  ctx.moveTo(11, -5);
  ctx.lineTo(24, -1.5);
  ctx.lineTo(24, 2.5);
  ctx.lineTo(11, 6);
  ctx.closePath();
  ctx.fillStyle = PALETTE.bird.beak;
  ctx.fill();
  ctx.stroke();

  // Hàm dưới tối hơn để mỏ tách thành hai mảnh, đọc rõ ở kích thước nhỏ.
  ctx.beginPath();
  ctx.moveTo(11, 1.5);
  ctx.lineTo(24, 0.8);
  ctx.lineTo(24, 2.5);
  ctx.lineTo(11, 6);
  ctx.closePath();
  ctx.fillStyle = PALETTE.bird.beakDark;
  ctx.fill();
};

const drawEye = (ctx: CanvasRenderingContext2D): void => {
  ctx.beginPath();
  ctx.ellipse(7, -5, 5.2, 5.6, 0, 0, TAU);
  ctx.fillStyle = PALETTE.bird.eyeWhite;
  ctx.fill();
  ctx.stroke();

  ctx.beginPath();
  ctx.ellipse(8.8, -5, 2.6, 2.9, 0, 0, TAU);
  ctx.fillStyle = PALETTE.bird.pupil;
  ctx.fill();
};

const drawWing = (ctx: CanvasRenderingContext2D, angle: number): void => {
  ctx.save();
  ctx.translate(SHOULDER_X, SHOULDER_Y);
  ctx.rotate(angle);

  ctx.beginPath();
  ctx.ellipse(-7, 3, 12, 6.5, 0, 0, TAU);
  ctx.fillStyle = PALETTE.bird.wing;
  ctx.fill();
  ctx.stroke();

  ctx.beginPath();
  ctx.ellipse(-8, 1.5, 8, 3, 0, 0, TAU);
  ctx.fillStyle = PALETTE.bird.wingLight;
  ctx.globalAlpha = 0.75;
  ctx.fill();
  ctx.globalAlpha = 1;

  ctx.restore();
};

export const drawBird = (
  ctx: CanvasRenderingContext2D,
  state: GameState
): void => {
  const bird: Bird = state.bird;

  ctx.save();
  // Xoay quanh tâm chim: dịch tới tâm, xoay, rồi vẽ mọi thứ quanh gốc.
  ctx.translate(bird.x, bird.y);
  ctx.rotate(bird.rotation);

  ctx.lineWidth = OUTLINE_WIDTH;
  ctx.lineJoin = "round";
  ctx.strokeStyle = PALETTE.bird.outline;

  drawTail(ctx);
  drawBody(ctx);
  drawBeak(ctx);
  drawEye(ctx);
  drawWing(ctx, computeWingAngle(state.time, bird.velocityY));

  ctx.restore();
};
