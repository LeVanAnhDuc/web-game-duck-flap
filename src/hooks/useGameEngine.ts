"use client";

import type { RefObject } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import type { Difficulty, GameSnapshot } from "@/game/core/types";
import { GameEngine } from "@/game/engine/GameEngine";
import { bindInput } from "@/game/engine/input";
import { LocalScoreRepository } from "@/game/score/localScoreRepository";
import { LocalSettingsRepository } from "@/game/settings/localSettingsRepository";
import type { Settings } from "@/game/settings/types";
import { DEFAULT_SETTINGS } from "@/game/settings/types";

export type UseGameEngineResult = {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  containerRef: RefObject<HTMLDivElement | null>;
  snapshot: GameSnapshot;
  best: number;
  settings: Settings;
  isNewBest: boolean;
  /** Đang tạm dừng giữa lượt chơi (phím P / Escape hoặc nút trên HUD). */
  paused: boolean;
  togglePause: () => void;
  startRun: () => void;
  restart: () => void;
  toMenu: () => void;
  flap: () => void;
  setDifficulty: (difficulty: Difficulty) => void;
  setSoundEnabled: (enabled: boolean) => void;
};

/**
 * Snapshot khởi tạo phải là hằng số: đọc localStorage lúc render sẽ khiến
 * HTML của server và của client khác nhau và vỡ hydration.
 */
const INITIAL_SNAPSHOT: GameSnapshot = {
  phase: "menu",
  score: 0,
  difficulty: DEFAULT_SETTINGS.difficulty
};

export const useGameEngine = (): UseGameEngineResult => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const engineRef = useRef<GameEngine | null>(null);

  const scoreRepository = useMemo(() => new LocalScoreRepository(), []);
  const settingsRepository = useMemo(() => new LocalSettingsRepository(), []);

  const [snapshot, setSnapshot] = useState<GameSnapshot>(INITIAL_SNAPSHOT);
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [settingsLoaded, setSettingsLoaded] = useState(false);
  const [best, setBest] = useState(0);
  const [isNewBest, setIsNewBest] = useState(false);
  const [paused, setPaused] = useState(false);

  /**
   * Engine được dựng đúng một lần nên nó không thể đọc state mới của React
   * qua closure; giữ cài đặt trong ref để callback lúc khởi tạo luôn thấy
   * giá trị hiện hành.
   */
  const settingsRef = useRef<Settings>(settings);
  settingsRef.current = settings;

  /** Bấm P/Escape lần nữa mới chạy tiếp, nên trạng thái này phải bền qua render. */
  const pausedRef = useRef(false);

  /**
   * Tạm dừng có nghĩa trong cả "ready" lẫn "playing" — tức là suốt một lượt
   * chơi. Không gộp "ready" vào thì lệnh dừng ngay sau cú vỗ đầu tiên sẽ bị
   * nuốt: phase chỉ chuyển sang "playing" ở bước mô phỏng kế tiếp, còn phím
   * thì tới ngay lập tức. Đóng băng màn menu hay màn thua thì vô nghĩa và
   * còn khiến nền đứng hình như bị treo.
   */
  const togglePause = useCallback(() => {
    const engine = engineRef.current;
    const phase = engine?.getSnapshot().phase;
    if (!engine || (phase !== "playing" && phase !== "ready")) {
      return;
    }
    const next = !pausedRef.current;
    pausedRef.current = next;
    setPaused(next);
    if (next) {
      engine.stop();
    } else {
      engine.start();
    }
  }, []);

  useEffect(() => {
    setSettings(settingsRepository.load());
    setSettingsLoaded(true);
  }, [settingsRepository]);

  // Chỉ ghi lại sau khi đã nạp xong, tránh đè cài đặt cũ bằng mặc định.
  useEffect(() => {
    if (!settingsLoaded) {
      return;
    }
    settingsRepository.save(settings);
  }, [settings, settingsLoaded, settingsRepository]);

  useEffect(() => {
    if (!settingsLoaded) {
      return;
    }
    let cancelled = false;
    void scoreRepository.getBest(settings.difficulty).then((value) => {
      if (!cancelled) {
        setBest(value);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [scoreRepository, settings.difficulty, settingsLoaded]);

  /**
   * Dựng engine sau khi có cài đặt thật, và chỉ phụ thuộc vào cờ đã-nạp:
   * dựng lại mỗi lần đổi độ khó sẽ chớp màn hình và mất lượt đang chơi.
   */
  useEffect(() => {
    if (!settingsLoaded) {
      return;
    }
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) {
      return;
    }

    const initial = settingsRef.current;
    const engine = new GameEngine({
      canvas,
      difficulty: initial.difficulty,
      soundEnabled: initial.soundEnabled,
      onRunEnd: (score, difficulty) => {
        void scoreRepository.saveBest(difficulty, score).then((isRecord) => {
          if (!isRecord) {
            return;
          }
          setBest(score);
          setIsNewBest(true);
        });
      }
    });
    engineRef.current = engine;

    const unsubscribe = engine.subscribe(setSnapshot);
    setSnapshot(engine.getSnapshot());

    const unbindInput = bindInput({
      target: container,
      onFlap: () => {
        engine.flap();
      },
      onPause: togglePause
    });

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) {
        return;
      }
      const { width, height } = entry.contentRect;
      engine.resize(width, height);
    });
    observer.observe(container);

    // Vòng lặp chạy ngay cả ở menu để nền và chim vẫn nhấp nhô sống động.
    engine.start();

    return () => {
      observer.disconnect();
      unbindInput();
      unsubscribe();
      engine.destroy();
      engineRef.current = null;
      pausedRef.current = false;
      setPaused(false);
    };
  }, [scoreRepository, settingsLoaded, togglePause]);

  useEffect(() => {
    engineRef.current?.setDifficulty(settings.difficulty);
  }, [settings.difficulty]);

  useEffect(() => {
    engineRef.current?.setSoundEnabled(settings.soundEnabled);
  }, [settings.soundEnabled]);

  /** Mỗi lượt mới là một cơ hội mới, huy hiệu kỷ lục cũ phải tắt đi. */
  const beginRun = useCallback(() => {
    pausedRef.current = false;
    setPaused(false);
    setIsNewBest(false);
    const engine = engineRef.current;
    if (!engine) {
      return;
    }
    engine.startRun();
    engine.start();
  }, []);

  const toMenu = useCallback(() => {
    pausedRef.current = false;
    setPaused(false);
    setIsNewBest(false);
    const engine = engineRef.current;
    if (!engine) {
      return;
    }
    engine.toMenu();
    engine.start();
  }, []);

  const flap = useCallback(() => {
    engineRef.current?.flap();
  }, []);

  const setDifficulty = useCallback((difficulty: Difficulty) => {
    setSettings((current) =>
      current.difficulty === difficulty ? current : { ...current, difficulty }
    );
  }, []);

  const setSoundEnabled = useCallback((enabled: boolean) => {
    setSettings((current) =>
      current.soundEnabled === enabled
        ? current
        : { ...current, soundEnabled: enabled }
    );
  }, []);

  return {
    canvasRef,
    containerRef,
    snapshot,
    best,
    settings,
    isNewBest,
    paused,
    togglePause,
    startRun: beginRun,
    restart: beginRun,
    toMenu,
    flap,
    setDifficulty,
    setSoundEnabled
  };
};
