import {
  FLOOR_Y,
  GROUND_HEIGHT,
  WORLD_HEIGHT,
  WORLD_WIDTH
} from "@/game/core/constants";
import type { GameState } from "@/game/core/types";
import { PALETTE } from "@/game/render/palette";

/** Viền trên sáng, tương phản mạnh với trời để mặt đất "cắt" dứt khoát. */
const EDGE_HEIGHT = 5;
const EDGE_SHADOW_HEIGHT = 3;

/** Dải đất sẫm ở đáy, giữ cho khối đất không bị phẳng lì. */
const SOIL_HEIGHT = 22;

/** Sọc chéo: nghiêng đủ để đọc được hướng chạy mà không gây rối mắt. */
const STRIPE_SPACING = 26;
const STRIPE_WIDTH = 11;
const STRIPE_SLANT = 20;

let cachedCtx: CanvasRenderingContext2D | null = null;
let cachedGradient: CanvasGradient | null = null;

const getGradient = (ctx: CanvasRenderingContext2D): CanvasGradient => {
  if (cachedCtx === ctx && cachedGradient) return cachedGradient;

  const gradient = ctx.createLinearGradient(0, FLOOR_Y, 0, WORLD_HEIGHT);
  gradient.addColorStop(0, PALETTE.ground.baseTop);
  gradient.addColorStop(1, PALETTE.ground.baseBottom);

  cachedCtx = ctx;
  cachedGradient = gradient;
  return gradient;
};

const wrap = (value: number, size: number): number => {
  const rest = value % size;
  return rest < 0 ? rest + size : rest;
};

export const drawGround = (
  ctx: CanvasRenderingContext2D,
  state: GameState
): void => {
  ctx.save();

  ctx.fillStyle = getGradient(ctx);
  ctx.fillRect(0, FLOOR_Y, WORLD_WIDTH, GROUND_HEIGHT);

  // Sọc chỉ được chạy trong lòng dải đất, nên cắt trước khi kẻ.
  ctx.save();
  ctx.beginPath();
  ctx.rect(0, FLOOR_Y + EDGE_HEIGHT, WORLD_WIDTH, GROUND_HEIGHT - EDGE_HEIGHT);
  ctx.clip();

  ctx.strokeStyle = PALETTE.ground.stripe;
  ctx.lineWidth = STRIPE_WIDTH;
  const shift = wrap(state.groundOffset, STRIPE_SPACING);
  const last = WORLD_WIDTH + STRIPE_SLANT + STRIPE_SPACING;
  for (let x = -STRIPE_SLANT - STRIPE_SPACING; x < last; x += STRIPE_SPACING) {
    const px = x - shift;
    ctx.beginPath();
    ctx.moveTo(px, WORLD_HEIGHT);
    ctx.lineTo(px + STRIPE_SLANT, FLOOR_Y);
    ctx.stroke();
  }
  ctx.restore();

  ctx.fillStyle = PALETTE.ground.soil;
  ctx.fillRect(0, WORLD_HEIGHT - SOIL_HEIGHT, WORLD_WIDTH, SOIL_HEIGHT);

  ctx.fillStyle = PALETTE.ground.topEdgeShadow;
  ctx.fillRect(0, FLOOR_Y + EDGE_HEIGHT, WORLD_WIDTH, EDGE_SHADOW_HEIGHT);

  ctx.fillStyle = PALETTE.ground.topEdge;
  ctx.fillRect(0, FLOOR_Y, WORLD_WIDTH, EDGE_HEIGHT);

  ctx.restore();
};
