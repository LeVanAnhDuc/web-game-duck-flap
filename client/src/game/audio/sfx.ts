import type { GameEventType } from "@/game/core/types";

type ToneSpec = {
  wave: OscillatorType;
  /** Tần số đầu và cuối (Hz) — khác nhau thì nghe như tiếng trượt. */
  fromHz: number;
  toHz: number;
  /** Độ dài âm, giây. Giữ rất ngắn để không đè lên tiếng kế tiếp. */
  duration: number;
  /** Đỉnh biên độ, cố ý giữ thấp để không chói tai khi bấm liên tục. */
  gain: number;
};

/**
 * Bốn âm phải phân biệt được bằng tai ngay cả khi phát chồng nhau, nên
 * mỗi âm khác nhau cả về dạng sóng lẫn hướng đi của cao độ.
 */
const TONES: Record<GameEventType, ToneSpec> = {
  flap: {
    wave: "triangle",
    fromHz: 620,
    toHz: 900,
    duration: 0.09,
    gain: 0.07
  },
  score: {
    wave: "sine",
    fromHz: 880,
    toHz: 1320,
    duration: 0.16,
    gain: 0.09
  },
  hit: {
    wave: "square",
    fromHz: 190,
    toHz: 90,
    duration: 0.18,
    gain: 0.12
  },
  die: {
    wave: "sawtooth",
    fromHz: 420,
    toHz: 70,
    duration: 0.5,
    gain: 0.08
  }
};

type AudioContextCtor = new () => AudioContext;

const getAudioContextCtor = (): AudioContextCtor | null => {
  if (typeof window === "undefined") {
    return null;
  }
  const scope = window as unknown as {
    AudioContext?: AudioContextCtor;
    webkitAudioContext?: AudioContextCtor;
  };
  return scope.AudioContext ?? scope.webkitAudioContext ?? null;
};

export class SoundPlayer {
  private enabled: boolean;

  private context: AudioContext | null = null;

  /** Đã thử tạo context và thất bại thì thôi, khỏi thử lại mỗi lần phát. */
  private unavailable = false;

  constructor(enabled: boolean) {
    this.enabled = enabled;
  }

  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  play(type: GameEventType): void {
    if (!this.enabled) {
      return;
    }
    const context = this.ensureContext();
    if (!context) {
      return;
    }
    try {
      // Trình duyệt treo context nếu nó được tạo trước cử chỉ người dùng.
      if (context.state === "suspended") {
        void context.resume();
      }
      this.emit(context, TONES[type]);
    } catch {
      // Âm thanh là thứ yếu: mọi lỗi đều nuốt để game không bao giờ vỡ.
    }
  }

  dispose(): void {
    const context = this.context;
    this.context = null;
    this.unavailable = true;
    if (!context) {
      return;
    }
    try {
      void context.close();
    } catch {
      // Context có thể đã đóng sẵn, không cần xử lý gì thêm.
    }
  }

  /** Tạo lười: trình duyệt chặn AudioContext trước khi người dùng tương tác. */
  private ensureContext(): AudioContext | null {
    if (this.context) {
      return this.context;
    }
    if (this.unavailable) {
      return null;
    }
    const Ctor = getAudioContextCtor();
    if (!Ctor) {
      this.unavailable = true;
      return null;
    }
    try {
      this.context = new Ctor();
    } catch {
      this.unavailable = true;
      return null;
    }
    return this.context;
  }

  private emit(context: AudioContext, tone: ToneSpec): void {
    const now = context.currentTime;
    const oscillator = context.createOscillator();
    const gain = context.createGain();

    oscillator.type = tone.wave;
    oscillator.frequency.setValueAtTime(tone.fromHz, now);
    oscillator.frequency.exponentialRampToValueAtTime(
      Math.max(tone.toHz, 1),
      now + tone.duration
    );

    /**
     * Envelope tấn công cực nhanh rồi tắt dần: cắt đột ngột sẽ tạo tiếng
     * "cạch" do sóng bị ngắt giữa chu kỳ.
     */
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(tone.gain, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + tone.duration);

    oscillator.connect(gain);
    gain.connect(context.destination);

    oscillator.start(now);
    oscillator.stop(now + tone.duration);
    // Node tự ngắt kết nối khi kết thúc, tránh rò rỉ khi bấm hàng trăm lần.
    oscillator.onended = () => {
      try {
        oscillator.disconnect();
        gain.disconnect();
      } catch {
        // Đã ngắt sẵn thì bỏ qua.
      }
    };
  }
}
