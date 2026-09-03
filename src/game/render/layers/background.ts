import {
  BACKGROUND_PARALLAX,
  FLOOR_Y,
  WORLD_HEIGHT,
  WORLD_WIDTH
} from "@/game/core/constants";
import type { GameState } from "@/game/core/types";
import { PALETTE } from "@/game/render/palette";

const TAU = Math.PI * 2;

type Cloud = {
  x: number;
  y: number;
  scale: number;
};

type Hill = {
  x: number;
  radius: number;
};

/**
 * Mây và đồi được khai báo cứng rồi lát lặp lại theo chiều ngang: hình nền
 * phải suy ra hoàn toàn từ offset, không được dùng random nếu không mỗi frame
 * sẽ ra một bầu trời khác nhau và nhấp nháy.
 */
const CLOUD_TILE = 260;

const FAR_CLOUDS: Cloud[] = [
  { x: 24, y: 74, scale: 1 },
  { x: 158, y: 132, scale: 0.72 }
];

const NEAR_CLOUDS: Cloud[] = [
  { x: 62, y: 186, scale: 1.3 },
  { x: 196, y: 104, scale: 0.95 }
];

const HILL_TILE = 300;

const FAR_HILLS: Hill[] = [
  { x: 40, radius: 74 },
  { x: 168, radius: 96 },
  { x: 262, radius: 60 }
];

const NEAR_HILLS: Hill[] = [
  { x: 96, radius: 62 },
  { x: 222, radius: 78 }
];

/** Đường chân đồi nằm hơi thấp hơn mặt đất để lớp đất che chân, không lộ mép. */
const FAR_HILL_BASE = FLOOR_Y + 10;
const NEAR_HILL_BASE = FLOOR_Y + 16;

type SkyGradients = {
  sky: CanvasGradient;
  sun: CanvasGradient;
};

let cachedCtx: CanvasRenderingContext2D | null = null;
let cachedGradients: SkyGradients | null = null;

const SUN_X = WORLD_WIDTH * 0.72;
const SUN_Y = FLOOR_Y - 78;
const SUN_RADIUS = 132;

/**
 * Gradient chỉ phụ thuộc toạ độ logic (cố định) nên tạo một lần là đủ; chỉ
 * dựng lại khi context đổi, vì gradient thuộc về context đã tạo ra nó.
 */
const getGradients = (ctx: CanvasRenderingContext2D): SkyGradients => {
  if (cachedCtx === ctx && cachedGradients) return cachedGradients;

  const sky = ctx.createLinearGradient(0, 0, 0, FLOOR_Y);
  sky.addColorStop(0, PALETTE.sky.top);
  sky.addColorStop(0.46, PALETTE.sky.mid);
  sky.addColorStop(0.8, PALETTE.sky.pale);
  sky.addColorStop(1, PALETTE.sky.horizon);

  const sun = ctx.createRadialGradient(
    SUN_X,
    SUN_Y,
    0,
    SUN_X,
    SUN_Y,
    SUN_RADIUS
  );
  sun.addColorStop(0, PALETTE.sky.glowInner);
  sun.addColorStop(1, PALETTE.sky.glowOuter);

  cachedCtx = ctx;
  cachedGradients = { sky, sun };
  return cachedGradients;
};

/** Đưa offset về trong một ô lát để vòng lặp vẽ luôn ngắn và không tràn số. */
const wrap = (value: number, size: number): number => {
  const rest = value % size;
  return rest < 0 ? rest + size : rest;
};

const drawCloud = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  s: number
): void => {
  // Gộp các ellipse vào chung một path rồi tô một lần: chỗ chồng nhau không bị
  // đậm màu hai lần, nên khối mây trông liền và mềm.
  ctx.beginPath();
  ctx.moveTo(x + 27 * s, y);
  ctx.ellipse(x, y, 27 * s, 14 * s, 0, 0, TAU);
  ctx.moveTo(x - 22 * s + 17 * s, y + 5 * s);
  ctx.ellipse(x - 22 * s, y + 5 * s, 17 * s, 10 * s, 0, 0, TAU);
  ctx.moveTo(x + 25 * s + 19 * s, y + 6 * s);
  ctx.ellipse(x + 25 * s, y + 6 * s, 19 * s, 11 * s, 0, 0, TAU);
  ctx.moveTo(x + 7 * s + 17 * s, y - 11 * s);
  ctx.ellipse(x + 7 * s, y - 11 * s, 17 * s, 12 * s, 0, 0, TAU);
  ctx.fill();
};

const drawCloudLayer = (
  ctx: CanvasRenderingContext2D,
  clouds: Cloud[],
  color: string,
  offset: number
): void => {
  const shift = wrap(offset, CLOUD_TILE);
  const tiles = Math.ceil(WORLD_WIDTH / CLOUD_TILE) + 2;

  ctx.fillStyle = color;
  for (let tile = -1; tile < tiles; tile += 1) {
    for (const cloud of clouds) {
      drawCloud(ctx, cloud.x + tile * CLOUD_TILE - shift, cloud.y, cloud.scale);
    }
  }
};

const drawHillLayer = (
  ctx: CanvasRenderingContext2D,
  hills: Hill[],
  color: string,
  baseY: number,
  offset: number
): void => {
  const shift = wrap(offset, HILL_TILE);
  const tiles = Math.ceil(WORLD_WIDTH / HILL_TILE) + 2;

  // Một path duy nhất gồm các vòm nửa tròn nối nhau tạo dáng đồi trừu tượng.
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(-HILL_TILE, WORLD_HEIGHT);
  ctx.lineTo(-HILL_TILE, baseY);
  for (let tile = -1; tile < tiles; tile += 1) {
    for (const hill of hills) {
      const cx = hill.x + tile * HILL_TILE - shift;
      ctx.lineTo(cx - hill.radius, baseY);
      ctx.arc(cx, baseY, hill.radius, Math.PI, 0);
    }
  }
  ctx.lineTo(WORLD_WIDTH + HILL_TILE, baseY);
  ctx.lineTo(WORLD_WIDTH + HILL_TILE, WORLD_HEIGHT);
  ctx.closePath();
  ctx.fill();
};

export const drawBackground = (
  ctx: CanvasRenderingContext2D,
  state: GameState
): void => {
  ctx.save();
  const gradients = getGradients(ctx);

  ctx.fillStyle = gradients.sky;
  ctx.fillRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);

  ctx.fillStyle = gradients.sun;
  ctx.fillRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);

  // Càng ở xa cuộn càng chậm: mây xa < đồi xa < mây gần < đồi gần.
  const base = state.backgroundOffset;
  const far = base * BACKGROUND_PARALLAX;

  drawCloudLayer(ctx, FAR_CLOUDS, PALETTE.clouds.far, far);
  drawHillLayer(ctx, FAR_HILLS, PALETTE.hills.far, FAR_HILL_BASE, far * 1.6);
  drawCloudLayer(ctx, NEAR_CLOUDS, PALETTE.clouds.near, base * 0.72);
  drawHillLayer(ctx, NEAR_HILLS, PALETTE.hills.near, NEAR_HILL_BASE, base);

  ctx.restore();
};
