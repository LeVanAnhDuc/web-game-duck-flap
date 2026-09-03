import { describe, expect, it } from "vitest";

import {
  BIRD_HITBOX_HEIGHT,
  BIRD_START_Y,
  BIRD_X,
  FIXED_TIMESTEP,
  FLOOR_Y,
  IDLE_BOB_AMPLITUDE,
  PIPE_WIDTH,
  WORLD_WIDTH,
  getTuning
} from "./constants";
import {
  createInitialState,
  setDifficulty,
  startRun,
  stepWorld
} from "./world";
import type { GameState, Pipe, StepInput } from "./types";

const NO_INPUT: StepInput = { flap: false };
const FLAP: StepInput = { flap: true };

/** Bỏ qua giai đoạn menu/ready để test thẳng phần chơi thật. */
const makePlayingState = (overrides: Partial<GameState> = {}): GameState => ({
  ...startRun(createInitialState("normal", 1)),
  phase: "playing",
  /** Đặt hẹn giờ rất lâu để ống chỉ xuất hiện khi test tự thêm vào. */
  spawnTimer: 999,
  ...overrides
});

const makePipe = (overrides: Partial<Pipe> = {}): Pipe => ({
  id: 1,
  x: 250,
  gapY: 150,
  gapHeight: 108,
  passed: false,
  ...overrides
});

describe("createInitialState", () => {
  it("bắt đầu ở menu với chim tại vị trí xuất phát", () => {
    const state = createInitialState("hard", 99);

    expect(state.phase).toBe("menu");
    expect(state.score).toBe(0);
    expect(state.pipes).toEqual([]);
    expect(state.difficulty).toBe("hard");
    expect(state.rng).toBe(99);
    expect(state.bird.x).toBe(BIRD_X);
    expect(state.bird.y).toBe(BIRD_START_Y);
    expect(state.bird.velocityY).toBe(0);
    expect(state.events).toEqual([]);
  });
});

describe("startRun", () => {
  it("chuyển sang ready và reset lượt chơi nhưng giữ độ khó với rng", () => {
    const dirty: GameState = {
      ...createInitialState("easy", 7),
      phase: "gameover",
      score: 12,
      time: 30,
      pipes: [makePipe()],
      bird: { x: BIRD_X, y: 400, velocityY: 500, rotation: 1 },
      rng: 123456
    };
    const state = startRun(dirty);

    expect(state.phase).toBe("ready");
    expect(state.score).toBe(0);
    expect(state.time).toBe(0);
    expect(state.pipes).toEqual([]);
    expect(state.bird.y).toBe(BIRD_START_Y);
    expect(state.bird.velocityY).toBe(0);
    expect(state.difficulty).toBe("easy");
    expect(state.rng).toBe(123456);
  });
});

describe("setDifficulty", () => {
  it("đổi độ khó và đưa game về menu", () => {
    const state = setDifficulty(makePlayingState(), "hard");

    expect(state.difficulty).toBe("hard");
    expect(state.phase).toBe("menu");
    expect(state.score).toBe(0);
    expect(state.pipes).toEqual([]);
  });
});

describe("stepWorld — tính thuần", () => {
  it("gọi hai lần với cùng state cho kết quả giống hệt nhau", () => {
    const state = makePlayingState({ pipes: [makePipe()], spawnTimer: 0.01 });
    const snapshot = structuredClone(state);

    const first = stepWorld(state, FIXED_TIMESTEP, FLAP);
    const second = stepWorld(state, FIXED_TIMESTEP, FLAP);

    expect(first).toEqual(second);
    expect(state).toEqual(snapshot);
  });

  it("không tích luỹ event giữa các bước", () => {
    const state = makePlayingState();
    const flapped = stepWorld(state, FIXED_TIMESTEP, FLAP);
    const idle = stepWorld(flapped, FIXED_TIMESTEP, NO_INPUT);

    expect(flapped.events).toEqual([{ type: "flap" }]);
    expect(idle.events).toEqual([]);
  });
});

describe("stepWorld — menu", () => {
  it("chim nhấp nhô quanh vị trí xuất phát và nền vẫn cuộn", () => {
    const state = createInitialState("normal", 1);
    const next = stepWorld(state, 0.2, NO_INPUT);
    const tuning = getTuning("normal");

    expect(next.phase).toBe("menu");
    expect(next.time).toBeCloseTo(0.2);
    expect(Math.abs(next.bird.y - BIRD_START_Y)).toBeLessThanOrEqual(
      IDLE_BOB_AMPLITUDE
    );
    expect(next.groundOffset).toBeCloseTo(tuning.scrollSpeed * 0.2);
    expect(next.backgroundOffset).toBeGreaterThan(0);
    expect(next.backgroundOffset).toBeLessThan(next.groundOffset);
  });

  it("bỏ qua vỗ cánh và không sinh ống", () => {
    const state = createInitialState("normal", 1);
    const next = stepWorld(state, 0.2, FLAP);

    expect(next.phase).toBe("menu");
    expect(next.bird.velocityY).toBe(0);
    expect(next.pipes).toEqual([]);
    expect(next.events).toEqual([]);
  });
});

describe("stepWorld — ready", () => {
  it("đứng chờ vỗ cánh đầu tiên", () => {
    const state = startRun(createInitialState("normal", 1));
    const next = stepWorld(state, 0.2, NO_INPUT);

    expect(next.phase).toBe("ready");
    expect(next.bird.velocityY).toBe(0);
    expect(next.pipes).toEqual([]);
  });

  it("vỗ cánh đầu tiên bắt đầu lượt chơi và sinh ống ngay bước sau", () => {
    const state = startRun(createInitialState("normal", 1));
    const started = stepWorld(state, FIXED_TIMESTEP, FLAP);

    expect(started.phase).toBe("playing");
    expect(started.bird.velocityY).toBe(getTuning("normal").flapVelocity);
    expect(started.events).toEqual([{ type: "flap" }]);
    expect(started.spawnTimer).toBe(0);

    const spawned = stepWorld(started, FIXED_TIMESTEP, NO_INPUT);

    expect(spawned.pipes).toHaveLength(1);
    expect(spawned.pipes[0].x).toBeLessThanOrEqual(WORLD_WIDTH);
  });
});

describe("stepWorld — playing", () => {
  it("sinh ống theo nhịp pipeSpacing / scrollSpeed", () => {
    const tuning = getTuning("normal");
    const state = makePlayingState({ spawnTimer: 0 });
    const spawned = stepWorld(state, FIXED_TIMESTEP, NO_INPUT);

    expect(spawned.pipes).toHaveLength(1);
    expect(spawned.spawnTimer).toBeCloseTo(
      tuning.pipeSpacing / tuning.scrollSpeed
    );
    expect(spawned.nextPipeId).toBe(state.nextPipeId + 1);
  });

  it("cộng điểm đúng một lần khi chim vượt qua ống và phát event score", () => {
    const state = makePlayingState({
      pipes: [makePipe({ x: BIRD_X - PIPE_WIDTH + 0.1 })]
    });
    const scored = stepWorld(state, FIXED_TIMESTEP, NO_INPUT);

    expect(scored.score).toBe(1);
    expect(scored.events).toContainEqual({ type: "score" });

    const after = stepWorld(scored, FIXED_TIMESTEP, NO_INPUT);

    expect(after.score).toBe(1);
    expect(after.events).not.toContainEqual({ type: "score" });
  });

  it("chạm trần không giết chim, chỉ kẹp lại ở đỉnh màn", () => {
    const state = makePlayingState({
      bird: { x: BIRD_X, y: 10, velocityY: -400, rotation: 0 }
    });
    const next = stepWorld(state, FIXED_TIMESTEP, NO_INPUT);

    expect(next.phase).toBe("playing");
    expect(next.bird.y).toBe(BIRD_HITBOX_HEIGHT / 2);
    expect(next.bird.velocityY).toBe(0);
  });

  it("rơi tự do tới khi chạm đất thì chuyển sang gameover", () => {
    let state = makePlayingState({ pipes: [makePipe({ x: 250 })] });

    for (let i = 0; i < 600 && state.phase === "playing"; i += 1) {
      state = stepWorld(state, FIXED_TIMESTEP, NO_INPUT);
    }

    expect(state.phase).toBe("gameover");
    expect(state.events).toContainEqual({ type: "hit" });
    expect(state.events).toContainEqual({ type: "die" });
  });
});

describe("stepWorld — gameover", () => {
  it("thế giới đứng yên, chim rơi nốt rồi nằm trên mặt đất", () => {
    let state = makePlayingState({ pipes: [makePipe({ x: 250 })] });

    for (let i = 0; i < 600 && state.phase === "playing"; i += 1) {
      state = stepWorld(state, FIXED_TIMESTEP, NO_INPUT);
    }

    const frozenPipeX = state.pipes[0].x;
    const frozenGround = state.groundOffset;

    for (let i = 0; i < 60; i += 1) {
      state = stepWorld(state, FIXED_TIMESTEP, FLAP);
    }

    expect(state.phase).toBe("gameover");
    expect(state.pipes[0].x).toBe(frozenPipeX);
    expect(state.groundOffset).toBe(frozenGround);
    expect(state.bird.y).toBe(FLOOR_Y - BIRD_HITBOX_HEIGHT / 2);
    expect(state.bird.velocityY).toBe(0);
  });
});

describe("stepWorld — tính xác định", () => {
  it("cùng seed cho cùng chuỗi gapY của các ống", () => {
    const run = (seed: number): number[] => {
      let state = startRun(createInitialState("normal", seed));
      const seen = new Map<number, number>();

      for (let i = 0; i < 600; i += 1) {
        state = stepWorld(state, FIXED_TIMESTEP, { flap: i % 30 === 0 });
        state.pipes.forEach((pipe) => seen.set(pipe.id, pipe.gapY));
      }

      return [...seen.values()];
    };

    expect(run(2024)).toEqual(run(2024));
    expect(run(2024)).not.toEqual(run(7));
  });

  it("mô phỏng ~2 giây bằng nhiều bước cố định vẫn sinh được ống", () => {
    let state = startRun(createInitialState("normal", 5));
    let maxPipes = 0;

    for (let i = 0; i < Math.round(2 / FIXED_TIMESTEP); i += 1) {
      state = stepWorld(state, FIXED_TIMESTEP, { flap: i % 25 === 0 });
      maxPipes = Math.max(maxPipes, state.pipes.length);
    }

    expect(maxPipes).toBeGreaterThan(0);
    expect(state.time).toBeCloseTo(2, 5);
  });
});
