/**
 * Kiểu dữ liệu dùng chung cho toàn bộ engine.
 * File này KHÔNG được import React hay bất kỳ API trình duyệt nào.
 */

export type GamePhase = "menu" | "ready" | "playing" | "gameover";

export type Difficulty = "easy" | "normal" | "hard";

export type Rect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type Bird = {
  /** Toạ độ tâm chim trong hệ toạ độ logic. */
  x: number;
  y: number;
  /** Vận tốc dọc, px/giây. Dương là rơi xuống. */
  velocityY: number;
  /** Góc nghiêng khi vẽ, radian. */
  rotation: number;
};

export type Pipe = {
  id: number;
  /** Mép trái của ống. */
  x: number;
  /** Mép trên của khe hở. */
  gapY: number;
  /** Chiều cao khe hở. */
  gapHeight: number;
  /** Đã tính điểm cho ống này chưa. */
  passed: boolean;
};

/** State của bộ sinh số ngẫu nhiên (mulberry32) — giữ trong state để world luôn thuần. */
export type RngState = number;

export type GameEventType = "flap" | "score" | "hit" | "die";

export type GameEvent = {
  type: GameEventType;
};

export type GameState = {
  phase: GamePhase;
  difficulty: Difficulty;
  /** Số giây đã trôi trong lượt chơi hiện tại. */
  time: number;
  bird: Bird;
  pipes: Pipe[];
  score: number;
  nextPipeId: number;
  /** Số giây còn lại tới lần sinh ống kế tiếp. */
  spawnTimer: number;
  rng: RngState;
  /** Độ lệch cuộn của nền đất, dùng cho hiệu ứng chạy vô tận. */
  groundOffset: number;
  /** Độ lệch cuộn của nền trời (parallax, chậm hơn đất). */
  backgroundOffset: number;
  /** Sự kiện phát sinh trong bước vừa rồi. Reset mỗi bước. */
  events: GameEvent[];
};

/** Đầu vào của một bước mô phỏng. */
export type StepInput = {
  /** Người chơi vừa vỗ cánh trong bước này. */
  flap: boolean;
};

/** Thông số điều chỉnh theo độ khó. */
export type Tuning = {
  gravity: number;
  flapVelocity: number;
  maxFallSpeed: number;
  scrollSpeed: number;
  pipeGapHeight: number;
  /** Khoảng cách ngang giữa hai ống liên tiếp. */
  pipeSpacing: number;
};

/**
 * Ảnh chụp state gửi sang React. Chỉ chứa những giá trị thay đổi hiếm,
 * để React không phải render lại mỗi frame.
 */
export type GameSnapshot = {
  phase: GamePhase;
  score: number;
  difficulty: Difficulty;
};
