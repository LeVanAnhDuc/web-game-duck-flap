import {
  BACKGROUND_PARALLAX,
  BIRD_HITBOX_HEIGHT,
  BIRD_ROTATION_DOWN,
  BIRD_START_Y,
  BIRD_X,
  FLOOR_Y,
  IDLE_BOB_AMPLITUDE,
  IDLE_BOB_SPEED,
  WORLD_WIDTH,
  getTuning
} from "./constants";
import { checkCollision, hitsCeiling } from "./collision";
import { applyFlap, applyGravity, computeRotation } from "./physics";
import { createPipe, movePipes, removeOffscreenPipes } from "./pipes";
import { updateScore } from "./scoring";
import type {
  Bird,
  Difficulty,
  GameEvent,
  GameState,
  Pipe,
  RngState,
  StepInput,
  Tuning
} from "./types";

/** Tâm chim khi hitbox vừa chạm trần / vừa nằm trên mặt đất. */
const CEILING_Y = BIRD_HITBOX_HEIGHT / 2;
const REST_Y = FLOOR_Y - BIRD_HITBOX_HEIGHT / 2;

const createIdleBird = (): Bird => ({
  x: BIRD_X,
  y: BIRD_START_Y,
  velocityY: 0,
  rotation: 0
});

/**
 * Lấy modulo bề rộng thế giới: nền được vẽ bằng cách lặp ảnh nên chỉ cần
 * phần dư, đồng thời tránh số cộng dồn tới mức mất độ chính xác sau
 * hàng giờ để tab chạy nền.
 */
const scrollOffsets = (
  state: GameState,
  dt: number,
  tuning: Tuning
): Pick<GameState, "groundOffset" | "backgroundOffset"> => ({
  groundOffset: (state.groundOffset + tuning.scrollSpeed * dt) % WORLD_WIDTH,
  backgroundOffset:
    (state.backgroundOffset + tuning.scrollSpeed * BACKGROUND_PARALLAX * dt) %
    WORLD_WIDTH
});

const idleBird = (time: number): Bird => ({
  x: BIRD_X,
  y: BIRD_START_Y + IDLE_BOB_AMPLITUDE * Math.sin(time * IDLE_BOB_SPEED),
  velocityY: 0,
  rotation: 0
});

type SpawnResult = Pick<
  GameState,
  "pipes" | "rng" | "nextPipeId" | "spawnTimer"
>;

const advanceSpawn = (
  state: GameState,
  dt: number,
  tuning: Tuning
): SpawnResult => {
  const spawnTimer = state.spawnTimer - dt;

  if (spawnTimer > 0) {
    return {
      pipes: state.pipes,
      rng: state.rng,
      nextPipeId: state.nextPipeId,
      spawnTimer
    };
  }

  const [pipe, rng]: [Pipe, RngState] = createPipe(
    state.nextPipeId,
    WORLD_WIDTH,
    tuning.pipeGapHeight,
    state.rng
  );

  return {
    pipes: [...state.pipes, pipe],
    rng,
    nextPipeId: state.nextPipeId + 1,
    /**
     * Nhịp sinh ống tính từ khoảng cách chia tốc độ cuộn, nên khoảng hở
     * giữa hai ống giữ nguyên dù độ khó chỉnh tốc độ nhanh chậm ra sao.
     */
    spawnTimer: tuning.pipeSpacing / tuning.scrollSpeed
  };
};

/** Màn chờ và màn "sẵn sàng" dùng chung một hành vi: chim nhấp nhô tại chỗ. */
const stepIdle = (
  state: GameState,
  dt: number,
  input: StepInput,
  tuning: Tuning
): GameState => {
  const time = state.time + dt;
  const next: GameState = {
    ...state,
    ...scrollOffsets(state, dt, tuning),
    time,
    bird: idleBird(time),
    events: []
  };

  if (state.phase !== "ready" || !input.flap) {
    return next;
  }

  return {
    ...next,
    phase: "playing",
    bird: applyFlap(next.bird, tuning),
    /** Hết giờ ngay để ống đầu tiên xuất hiện ở mép phải từ bước kế tiếp. */
    spawnTimer: 0,
    events: [{ type: "flap" }]
  };
};

const stepPlaying = (
  state: GameState,
  dt: number,
  input: StepInput,
  tuning: Tuning
): GameState => {
  const events: GameEvent[] = [];

  /** Vỗ cánh trước rồi mới rơi, để cú bấm có hiệu lực ngay trong bước này. */
  const flapped = input.flap ? applyFlap(state.bird, tuning) : state.bird;

  if (input.flap) {
    events.push({ type: "flap" });
  }

  const fallen = applyGravity(flapped, dt, tuning);
  /** Đội trần chỉ bị chặn lại chứ không chết, giống hệt bản gốc. */
  const bird = hitsCeiling(fallen)
    ? { ...fallen, y: CEILING_Y, velocityY: 0, rotation: computeRotation(0) }
    : fallen;

  const spawn = advanceSpawn(state, dt, tuning);
  const pipes = removeOffscreenPipes(
    movePipes(spawn.pipes, dt, tuning.scrollSpeed)
  );
  const scoring = updateScore(pipes, bird.x, state.score);

  if (scoring.scored) {
    events.push({ type: "score" });
  }

  const dead = checkCollision(bird, scoring.pipes);

  if (dead) {
    events.push({ type: "hit" }, { type: "die" });
  }

  return {
    ...state,
    ...scrollOffsets(state, dt, tuning),
    phase: dead ? "gameover" : "playing",
    time: state.time + dt,
    bird,
    pipes: scoring.pipes,
    score: scoring.score,
    nextPipeId: spawn.nextPipeId,
    spawnTimer: spawn.spawnTimer,
    rng: spawn.rng,
    events
  };
};

/** Sau khi chết, thế giới đứng hình và chỉ còn xác chim rơi nốt xuống đất. */
const stepGameOver = (
  state: GameState,
  dt: number,
  tuning: Tuning
): GameState => {
  const fallen =
    state.bird.y >= REST_Y ? state.bird : applyGravity(state.bird, dt, tuning);
  const bird =
    fallen.y >= REST_Y
      ? { ...fallen, y: REST_Y, velocityY: 0, rotation: BIRD_ROTATION_DOWN }
      : fallen;

  return { ...state, time: state.time + dt, bird, events: [] };
};

export const createInitialState = (
  difficulty: Difficulty,
  seed: RngState
): GameState => ({
  phase: "menu",
  difficulty,
  time: 0,
  bird: createIdleBird(),
  pipes: [],
  score: 0,
  nextPipeId: 1,
  spawnTimer: 0,
  rng: seed,
  groundOffset: 0,
  backgroundOffset: 0,
  events: []
});

/**
 * Giữ nguyên rng thay vì gieo lại: chuỗi ống của lượt sau nối tiếp lượt
 * trước nên hai lượt liên tiếp không bao giờ giống hệt nhau.
 */
export const startRun = (state: GameState): GameState => ({
  ...state,
  phase: "ready",
  time: 0,
  bird: createIdleBird(),
  pipes: [],
  score: 0,
  nextPipeId: 1,
  spawnTimer: 0,
  events: []
});

export const stepWorld = (
  state: GameState,
  dt: number,
  input: StepInput
): GameState => {
  const tuning = getTuning(state.difficulty);

  switch (state.phase) {
    case "menu":
    case "ready":
      return stepIdle(state, dt, input, tuning);
    case "playing":
      return stepPlaying(state, dt, input, tuning);
    case "gameover":
      return stepGameOver(state, dt, tuning);
  }
};

export const setDifficulty = (
  state: GameState,
  difficulty: Difficulty
): GameState => createInitialState(difficulty, state.rng);
