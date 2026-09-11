import { SoundPlayer } from "@/game/audio/sfx";
import {
  FIXED_TIMESTEP,
  MAX_STEPS_PER_FRAME,
  WORLD_HEIGHT,
  WORLD_WIDTH
} from "@/game/core/constants";
import { createSeed } from "@/game/core/rng";
import type {
  Difficulty,
  GameSnapshot,
  GameState,
  RngState
} from "@/game/core/types";
import {
  createInitialState,
  setDifficulty as setWorldDifficulty,
  startRun as startWorldRun,
  stepWorld
} from "@/game/core/world";
import { render } from "@/game/render/renderer";
import type { Viewport } from "@/game/render/viewport";
import { computeViewport, resizeCanvas } from "@/game/render/viewport";

export type GameEngineOptions = {
  canvas: HTMLCanvasElement;
  difficulty: Difficulty;
  /** Bật/tắt âm thanh, có thể đổi lúc đang chạy qua setSoundEnabled. */
  soundEnabled: boolean;
  seed?: RngState;
  /** Gọi khi một lượt kết thúc, để tầng trên lưu điểm cao. */
  onRunEnd?: (score: number, difficulty: Difficulty) => void;
};

type SnapshotListener = (snapshot: GameSnapshot) => void;

/**
 * Trần hàng đợi vỗ cánh. Người chơi hoảng loạn bấm mười phát một lúc thì
 * chỉ vài phát đầu là có ý nghĩa; giữ hết sẽ khiến chim bay vọt lên trần
 * sau khi họ đã buông tay.
 */
const MAX_QUEUED_FLAPS = 3;

const toSnapshot = (state: GameState): GameSnapshot => ({
  phase: state.phase,
  score: state.score,
  difficulty: state.difficulty
});

const sameSnapshot = (a: GameSnapshot, b: GameSnapshot): boolean =>
  a.phase === b.phase && a.score === b.score && a.difficulty === b.difficulty;

export class GameEngine {
  private readonly canvas: HTMLCanvasElement;

  private readonly ctx: CanvasRenderingContext2D | null;

  private readonly sound: SoundPlayer;

  private readonly onRunEnd?: (score: number, difficulty: Difficulty) => void;

  /**
   * Hạt cố định (nếu được truyền vào) dùng lại cho mọi lượt, để E2E chạy
   * ra đúng một dãy ống mỗi lần.
   */
  private readonly fixedSeed?: RngState;

  private state: GameState;

  private snapshot: GameSnapshot;

  private viewport: Viewport;

  private listeners = new Set<SnapshotListener>();

  private rafId: number | null = null;

  private lastTime = 0;

  /** Thời gian tích luỹ chưa đủ một bước cố định. */
  private accumulator = 0;

  private queuedFlaps = 0;

  private destroyed = false;

  /** Tab bị ẩn giữa lúc đang chơi: nhớ lại để tự chạy tiếp khi quay về. */
  private resumeOnVisible = false;

  private handleVisibilityChange: (() => void) | null = null;

  constructor(options: GameEngineOptions) {
    this.canvas = options.canvas;
    this.ctx = options.canvas.getContext("2d");
    this.sound = new SoundPlayer(options.soundEnabled);
    this.onRunEnd = options.onRunEnd;
    this.fixedSeed = options.seed;

    this.state = createInitialState(
      options.difficulty,
      options.seed ?? createSeed()
    );
    this.snapshot = toSnapshot(this.state);

    this.viewport = this.computeInitialViewport();
    this.applyViewport();
    this.bindVisibility();
    this.draw();
  }

  start(): void {
    if (
      this.destroyed ||
      this.rafId !== null ||
      typeof window === "undefined"
    ) {
      return;
    }
    // Bỏ mốc thời gian cũ, nếu không lần chạy lại sẽ nuốt trọn khoảng dừng.
    this.lastTime = 0;
    this.accumulator = 0;
    this.rafId = window.requestAnimationFrame(this.tick);
  }

  stop(): void {
    if (this.rafId === null || typeof window === "undefined") {
      return;
    }
    window.cancelAnimationFrame(this.rafId);
    this.rafId = null;
  }

  destroy(): void {
    this.stop();
    this.destroyed = true;
    this.unbindVisibility();
    this.listeners.clear();
    this.sound.dispose();
  }

  flap(): void {
    if (this.destroyed) {
      return;
    }
    // Xếp hàng thay vì đặt cờ boolean: hai cú nhấn trong cùng một frame
    // vẫn phải thành hai lần vỗ cánh ở hai bước mô phỏng khác nhau.
    this.queuedFlaps = Math.min(this.queuedFlaps + 1, MAX_QUEUED_FLAPS);
  }

  startRun(): void {
    if (this.destroyed) {
      return;
    }
    this.resetRun();
  }

  restart(): void {
    if (this.destroyed) {
      return;
    }
    this.resetRun();
  }

  toMenu(): void {
    if (this.destroyed) {
      return;
    }
    this.queuedFlaps = 0;
    this.state = createInitialState(this.state.difficulty, this.currentSeed());
    this.afterStateChange();
  }

  setDifficulty(difficulty: Difficulty): void {
    if (this.destroyed || this.state.difficulty === difficulty) {
      return;
    }
    this.state = setWorldDifficulty(this.state, difficulty);
    this.afterStateChange();
  }

  setSoundEnabled(enabled: boolean): void {
    this.sound.setEnabled(enabled);
  }

  resize(width: number, height: number): void {
    if (this.destroyed || width <= 0 || height <= 0) {
      return;
    }
    this.viewport = computeViewport(width, height, this.devicePixelRatio());
    this.applyViewport();
    // Vẽ lại ngay: lúc đang dừng (menu, gameover) không có frame nào tới cứu.
    this.draw();
  }

  subscribe(listener: SnapshotListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  getSnapshot(): GameSnapshot {
    return this.snapshot;
  }

  /**
   * Không có hạt cố định thì lấy tiếp state rng hiện hành: world cố ý để
   * chuỗi ống chảy tiếp qua từng lượt nên hai lượt liên tiếp không giống
   * hệt nhau. Có hạt cố định thì tua về đúng hạt đó cho E2E lặp lại được.
   */
  private currentSeed(): RngState {
    return this.fixedSeed ?? this.state.rng;
  }

  private resetRun(): void {
    this.queuedFlaps = 0;
    this.accumulator = 0;
    const base =
      this.fixedSeed === undefined
        ? this.state
        : { ...this.state, rng: this.fixedSeed };
    this.state = startWorldRun(base);
    this.afterStateChange();
  }

  /** Sau mỗi thay đổi state ngoài vòng lặp: báo React và vẽ lại một khung. */
  private afterStateChange(): void {
    this.emitSnapshot();
    this.draw();
  }

  private devicePixelRatio(): number {
    if (typeof window === "undefined") {
      return 1;
    }
    return window.devicePixelRatio || 1;
  }

  private computeInitialViewport(): Viewport {
    // clientWidth bằng 0 khi canvas chưa gắn vào DOM; rơi về kích thước logic
    // để có viewport hợp lệ cho tới khi ResizeObserver báo số thật.
    const width = this.canvas.clientWidth || WORLD_WIDTH;
    const height = this.canvas.clientHeight || WORLD_HEIGHT;
    return computeViewport(width, height, this.devicePixelRatio());
  }

  private applyViewport(): void {
    resizeCanvas(this.canvas, this.viewport);
  }

  private bindVisibility(): void {
    if (typeof document === "undefined") {
      return;
    }
    this.handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        /**
         * Không dừng thì người chơi quay lại sẽ thấy chim đã chết oan —
         * hoặc thấy một cú nhảy thời gian dồn cục.
         */
        /**
         * Phải gồm cả "ready", không chỉ "playing". Phase chỉ chuyển sang
         * "playing" ở bước mô phỏng KẾ TIẾP sau cú vỗ đầu tiên, còn việc
         * chuyển tab thì tới ngay lập tức — nên ai vỗ một cái rồi chuyển
         * tab liền sẽ rơi đúng vào khe hở đó và mất lượt, trong khi người
         * chuyển tab muộn hơn vài mili-giây lại được cứu. `togglePause`
         * trong `useGameEngine` đã gộp "ready" vì đúng lý do này.
         */
        const inRun =
          this.state.phase === "playing" || this.state.phase === "ready";
        if (inRun && this.rafId !== null) {
          this.resumeOnVisible = true;
          this.stop();
        }
        return;
      }
      if (this.resumeOnVisible) {
        this.resumeOnVisible = false;
        this.start();
      }
    };
    document.addEventListener("visibilitychange", this.handleVisibilityChange);
  }

  private unbindVisibility(): void {
    if (typeof document === "undefined" || !this.handleVisibilityChange) {
      return;
    }
    document.removeEventListener(
      "visibilitychange",
      this.handleVisibilityChange
    );
    this.handleVisibilityChange = null;
  }

  private tick = (time: number): void => {
    if (this.destroyed) {
      return;
    }
    this.rafId =
      typeof window === "undefined"
        ? null
        : window.requestAnimationFrame(this.tick);

    if (this.lastTime === 0) {
      this.lastTime = time;
    }
    const elapsed = (time - this.lastTime) / 1000;
    this.lastTime = time;

    // elapsed âm chỉ xảy ra khi đồng hồ nhảy lùi; coi như frame trống.
    if (elapsed > 0) {
      this.accumulator += elapsed;
    }

    let steps = 0;
    while (this.accumulator >= FIXED_TIMESTEP && steps < MAX_STEPS_PER_FRAME) {
      this.accumulator -= FIXED_TIMESTEP;
      steps += 1;
      this.advance();
    }

    /**
     * Vứt phần dư khi đã chạm trần: giữ lại sẽ khiến frame sau nợ càng
     * nhiều bước hơn, càng chậm, càng nợ — vòng xoáy tử thần.
     */
    if (steps >= MAX_STEPS_PER_FRAME) {
      this.accumulator = 0;
    }

    this.emitSnapshot();
    this.draw();
  };

  /** Một bước vật lý cố định, kèm tiêu thụ đúng một cú vỗ cánh. */
  private advance(): void {
    const previousPhase = this.state.phase;
    const flap = this.queuedFlaps > 0;
    if (flap) {
      this.queuedFlaps -= 1;
    }

    this.state = stepWorld(this.state, FIXED_TIMESTEP, { flap });

    for (const event of this.state.events) {
      this.sound.play(event.type);
    }

    // Đúng khoảnh khắc chuyển sang thua, không phải mọi frame sau đó.
    if (previousPhase !== "gameover" && this.state.phase === "gameover") {
      this.queuedFlaps = 0;
      this.onRunEnd?.(this.state.score, this.state.difficulty);
    }
  }

  /**
   * Chỉ gọi listener khi snapshot thực sự đổi giá trị — React không bao
   * giờ được render lại 60 lần mỗi giây.
   */
  private emitSnapshot(): void {
    const next = toSnapshot(this.state);
    if (sameSnapshot(next, this.snapshot)) {
      return;
    }
    this.snapshot = next;
    for (const listener of this.listeners) {
      listener(next);
    }
  }

  private draw(): void {
    if (!this.ctx) {
      return;
    }
    render(this.ctx, this.state, this.viewport);
  }
}
