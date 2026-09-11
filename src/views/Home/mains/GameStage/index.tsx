"use client";

// libs
import { Hand } from "lucide-react";
import { useCallback, useState } from "react";

// types
import type { RefObject } from "react";

// hooks
import { useGameEngine, useHydrated } from "@/hooks";

// components
import Header from "@/views/Home/mains/Header";
import GameOverOverlay from "../../components/GameOverOverlay";
import Hud from "../../components/Hud";
import MenuOverlay from "../../components/MenuOverlay";
import PauseOverlay from "../../components/PauseOverlay";
import SettingsPanel, {
  DIFFICULTY_LABELS
} from "../../components/SettingsPanel";

// ghosts
import CloseOnEscape from "../../ghosts/CloseOnEscape";

// others
import { DEFAULT_SETTINGS } from "@/game/settings/types";

/**
 * Điểm nối duy nhất giữa React và engine: cả app chỉ có MỘT lời gọi
 * useGameEngine, đặt tại đây. Mọi component con đều thuần, nhận props.
 *
 * Header được mount ngay trong GameStage (chứ không phải ở Home) vì nó
 * cần `best` và trạng thái âm thanh từ engine — nếu để Home render thì
 * Home phải gọi hook lần thứ hai và sinh ra hai instance engine.
 */
const GameStage = () => {
  const {
    canvasRef,
    containerRef,
    snapshot,
    best,
    settings,
    isNewBest,
    paused,
    togglePause,
    startRun,
    restart,
    toMenu,
    setDifficulty,
    setSoundEnabled
  } = useGameEngine();

  const [settingsOpen, setSettingsOpen] = useState(false);

  /**
   * `best` và `settings` đọc từ localStorage nên lần render đầu ở server
   * khác với client — xem `useHydrated`.
   */
  const hydrated = useHydrated();

  const view = hydrated ? settings : DEFAULT_SETTINGS;
  const bestView = hydrated ? best : 0;
  const difficultyLabel = DIFFICULTY_LABELS[view.difficulty];

  const closeSettings = useCallback(() => setSettingsOpen(false), []);

  const toggleSound = useCallback(
    () => setSoundEnabled(!view.soundEnabled),
    [setSoundEnabled, view.soundEnabled]
  );

  const handlePlay = useCallback(() => {
    setSettingsOpen(false);
    startRun();
  }, [startRun]);

  const { phase, score } = snapshot;

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {/* Ghost: chạy side-effect, không vẽ gì. Render vô điều kiện — xem R-04. */}
      <CloseOnEscape active={settingsOpen} onClose={closeSettings} />

      <Header
        best={bestView}
        soundEnabled={view.soundEnabled}
        onToggleSound={toggleSound}
        soundTestId={settingsOpen ? "btn-sound-header" : "btn-sound"}
      />

      {/*
        Ép kiểu ref: engine khai báo RefObject<T | null> theo kiểu React 19,
        còn @types/react đang cài là bản 18 (RefObject<T> hiệp biến) nên TS
        từ chối gán thẳng. Runtime giống hệt nhau, chỉ là khác khai báo.

        Container vừa là phần tử được ResizeObserver đo, vừa là vùng nhận
        chạm để vỗ cánh (engine tự gắn listener qua containerRef), nên nó
        phải chiếm trọn không gian còn lại và không được cuộn.
      */}
      <div
        ref={containerRef as RefObject<HTMLDivElement>}
        data-testid="game-container"
        className="touch-none-select-none relative flex min-h-0 flex-1 items-center justify-center overflow-hidden bg-[#061520]"
      >
        {/* Quầng sáng sau canvas: khiến vùng chơi trông như màn hình arcade đang bật. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(47,110,165,0.28),transparent_70%)]"
        />

        {/*
          KHÔNG đặt width/height cho canvas — engine tự set qua resizeCanvas.
          Ở đây chỉ có display:block và bo góc cho hợp khung.
        */}
        <canvas
          ref={canvasRef as RefObject<HTMLCanvasElement>}
          data-testid="game-canvas"
          className="relative block rounded-xl shadow-[0_10px_60px_-15px_rgba(143,199,214,0.45)]"
        />

        {/*
          Lớp overlay: pointer-events-none bắt buộc, chỉ nút bên trong mới
          bật lại pointer-events — nếu không lớp này nuốt hết cú chạm và
          game không chơi được.
        */}
        <div className="pointer-events-none absolute inset-0">
          {(phase === "ready" || phase === "playing") && <Hud score={score} />}

          {phase === "ready" && !paused && (
            <div
              data-testid="ready-overlay"
              className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-3 text-[#EAF6FB] duration-300 animate-in fade-in"
            >
              <Hand
                className="size-8 animate-bounce motion-reduce:animate-none"
                aria-hidden="true"
              />
              <p className="text-lg font-semibold [text-shadow:0_2px_0_rgba(6,21,32,0.6)]">
                Chạm để bay
              </p>
            </div>
          )}

          {paused && (phase === "playing" || phase === "ready") && (
            <PauseOverlay onResume={togglePause} />
          )}

          {phase === "menu" && (
            <MenuOverlay
              best={bestView}
              difficultyLabel={difficultyLabel}
              soundEnabled={view.soundEnabled}
              onPlay={handlePlay}
              onOpenSettings={() => setSettingsOpen(true)}
              onToggleSound={toggleSound}
            />
          )}

          {phase === "gameover" && (
            <GameOverOverlay
              score={score}
              best={bestView}
              isNewBest={isNewBest}
              difficultyLabel={difficultyLabel}
              onRestart={restart}
              onMenu={toMenu}
            />
          )}

          {settingsOpen && (
            <SettingsPanel
              difficulty={view.difficulty}
              soundEnabled={view.soundEnabled}
              onSelectDifficulty={setDifficulty}
              onToggleSound={toggleSound}
              onClose={closeSettings}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default GameStage;
