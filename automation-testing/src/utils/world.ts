// Reading the game world off the canvas, and the autopilot's one decision. No UI, no ENV: geometry and colours only.
//
// The game draws everything on one <canvas>: a fixed 288 × 512 world scaled with "contain" and centred (README "Plays
// the same everywhere"). `scanWorld` runs IN THE PAGE (Locator.evaluate on the canvas), so it must stay self-contained:
// no imports, no helpers outside its body. It finds the bird (warm yellow) and the pipes (mint green) the way an eye
// would, in world units — the tests never import the game's state or its generator.

export interface PipeView {
  /** Left and right edge of the pipe body, world x. */
  left: number;
  right: number;
  /** The open gap between the top and bottom pipe, world y. */
  gapTop: number;
  gapBottom: number;
}

export interface WorldView {
  /** Centre of the bird along the bird's column (world y), null when it cannot be seen. */
  birdY: number | null;
  pipes: PipeView[];
  /** Scale from world units to CSS pixels, and the world's top-left corner inside the canvas (CSS pixels). */
  scale: number;
  offsetX: number;
  offsetY: number;
}

export function scanWorld(canvas: HTMLCanvasElement): WorldView {
  const W = 288;
  const H = 512;
  const FLOOR = 400;
  const BIRD_X = 64;
  const cssW = canvas.clientWidth;
  const cssH = canvas.clientHeight;
  const dpr = canvas.width / Math.max(1, cssW);
  const s = Math.min(cssW / W, cssH / H);
  const ox = (cssW - W * s) / 2;
  const oy = (cssH - H * s) / 2;
  const ctx = canvas.getContext("2d");
  const empty = { birdY: null, pipes: [], scale: s, offsetX: ox, offsetY: oy };
  if (!ctx || s <= 0) return empty;

  const pw = Math.max(1, Math.floor(W * s * dpr));
  const ph = Math.max(1, Math.floor(FLOOR * s * dpr));
  const data = ctx.getImageData(Math.round(ox * dpr), Math.round(oy * dpr), pw, ph).data;
  const rgb = (wx: number, wy: number): [number, number, number] => {
    const x = Math.min(pw - 1, Math.max(0, Math.floor(wx * s * dpr)));
    const y = Math.min(ph - 1, Math.max(0, Math.floor(wy * s * dpr)));
    const i = (y * pw + x) * 4;
    return [data[i], data[i + 1], data[i + 2]];
  };
  // Pipe greens (#37C978, #7CEFAF, #128B4E, #075A33…): green clearly above red and blue. Sky, hills and clouds are
  // blue-grey or white; the only other green, the ground's top edge, lies below FLOOR and is never read.
  const green = (c: [number, number, number]) => c[1] > 80 && c[1] > c[0] + 40 && c[1] > c[2] + 25;
  // Bird body and wing (#FFD866, #F2A03D, #FFB443, beak #FF7A45): strong red, low blue. The sky's peach horizon and
  // the sun glow carry far more blue.
  const yellow = (c: [number, number, number]) => c[0] > 200 && c[1] > 100 && c[2] < 130 && c[0] >= c[1];

  // Pipes: a row near the top of the world crosses every top pipe (the gap never starts above y = 48).
  const runs: [number, number][] = [];
  let start = -1;
  for (let x = 0; x < W; x += 1) {
    const g = green(rgb(x + 0.5, 3));
    if (g && start < 0) start = x;
    if ((!g || x === W - 1) && start >= 0) {
      const end = g ? x : x - 1;
      const last = runs[runs.length - 1];
      // the bird at the ceiling can split a pipe's row in two: rejoin runs closer than the bird is wide
      if (last && start - last[1] < 20) last[1] = end;
      else runs.push([start, end]);
      start = -1;
    }
  }
  const pipes = [];
  for (const [l, r] of runs) {
    if (r - l < 6) continue;
    const cx = (l + r) / 2 + 0.5;
    let y = 0;
    while (y < FLOOR && green(rgb(cx, y + 0.5))) y += 1;
    const gapTop = y;
    while (y < FLOOR && !green(rgb(cx, y + 0.5))) y += 1;
    if (gapTop >= FLOOR) continue;
    pipes.push({ left: l, right: r + 1, gapTop, gapBottom: y });
  }

  // Bird: the bird never moves along x, so its column is enough.
  let top = -1;
  let bottom = -1;
  for (let y = 0; y < FLOOR; y += 1) {
    if (yellow(rgb(BIRD_X + 0.5, y + 0.5))) {
      if (top < 0) top = y;
      bottom = y;
    }
  }
  return { birdY: top < 0 ? null : (top + bottom + 1) / 2, pipes, scale: s, offsetX: ox, offsetY: oy };
}

/**
 * The autopilot's whole policy, one decision per frame: flap when the bird is about to sink below a line just above the
 * bottom of the next gap it has to pass. A flap sets the bird's speed rather than adding to it (design spec §5), so one
 * flap from that line lifts it by a fixed height that stays inside the gap; the line is a quarter of the gap above its
 * floor. "About to": the bird's position one frame ahead, from how far it moved since the previous frame — a bird
 * falling at full speed would otherwise be read a frame too late. Before any pipe shows up it holds the middle of the sky.
 */
export function shouldFlap(
  view: Pick<WorldView, "birdY" | "pipes">,
  previousBirdY: number | null = null,
  birdX = 64,
  hitboxHalfWidth = 13,
): boolean {
  if (view.birdY === null) return false;
  const falling = previousBirdY === null ? 0 : Math.max(0, view.birdY - previousBirdY);
  const ahead = view.birdY + falling;
  const next = view.pipes.find((p) => p.right >= birdX - hitboxHalfWidth);
  if (!next) return ahead > 220;
  const margin = (next.gapBottom - next.gapTop) * 0.26;
  return ahead > next.gapBottom - margin;
}
