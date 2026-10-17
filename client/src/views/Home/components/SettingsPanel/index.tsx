// libs
import { Info, Volume2, VolumeX, X } from "lucide-react";

// types
import type { Difficulty } from "@/game/core/types";

// game
import { DIFFICULTIES } from "@/game/core/constants";

// others
import { cn } from "@/lib/utils";

/** Nhãn tiếng Việt của từng độ khó, dùng chung cho mọi overlay. */
export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  easy: "Dễ",
  normal: "Thường",
  hard: "Khó"
};

/**
 * Bảng cài đặt — component thuần điều khiển, không giữ state và không gọi
 * useGameEngine. Lớp nền mờ nhận pointer-events để chặn cú chạm rơi xuống
 * vùng chơi khi bảng đang mở.
 */
const SettingsPanel = ({
  difficulty,
  soundEnabled,
  onSelectDifficulty,
  onToggleSound,
  onClose
}: {
  difficulty: Difficulty;
  soundEnabled: boolean;
  onSelectDifficulty: (difficulty: Difficulty) => void;
  onToggleSound: () => void;
  onClose: () => void;
}) => (
  <div className="pointer-events-auto absolute inset-0 flex items-center justify-center bg-[#04121C]/70 p-4 backdrop-blur-sm duration-150 animate-in fade-in">
    <div
      data-testid="settings-panel"
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-title"
      className="w-[min(100%,340px)] rounded-2xl border border-white/10 bg-[#0A2130]/95 p-5 shadow-2xl duration-200 animate-in fade-in zoom-in-95"
    >
      <div className="flex items-start justify-between gap-2">
        <h2
          id="settings-title"
          className="pt-2 text-lg font-semibold tracking-tight text-[#EAF6FB]"
        >
          Cài đặt
        </h2>
        <button
          type="button"
          data-testid="btn-close-settings"
          onClick={onClose}
          aria-label="Đóng cài đặt"
          autoFocus
          className="-mr-2 flex size-11 shrink-0 items-center justify-center rounded-full text-[#8FB3C4] transition-colors hover:bg-white/[0.08] hover:text-[#EAF6FB] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD866] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A2130] active:bg-white/[0.14]"
        >
          <X className="size-5" aria-hidden="true" />
        </button>
      </div>

      <p id="difficulty-label" className="mt-4 text-sm text-[#8FB3C4]">
        Độ khó
      </p>
      <div
        role="group"
        aria-labelledby="difficulty-label"
        className="mt-2 grid grid-cols-3 gap-2"
      >
        {DIFFICULTIES.map((value) => {
          const selected = value === difficulty;
          return (
            <button
              key={value}
              type="button"
              data-testid={`btn-difficulty-${value}`}
              onClick={() => onSelectDifficulty(value)}
              aria-pressed={selected}
              className={cn(
                "h-11 rounded-xl border text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD866] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A2130]",
                selected
                  ? "border-[#FFD866] bg-[#FFD866]/15 text-[#FFD866]"
                  : "border-white/10 bg-white/[0.04] text-[#C6DAE4] hover:border-white/20 hover:bg-white/[0.08] active:bg-white/[0.12]"
              )}
            >
              {DIFFICULTY_LABELS[value]}
            </button>
          );
        })}
      </div>

      {/* Cảnh báo quan trọng: đổi độ khó là đổi luôn bảng kỷ lục. */}
      <p className="mt-3 flex gap-2 text-[13px] leading-relaxed text-[#8FB3C4]">
        <Info className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
        <span>
          Mỗi độ khó có bảng kỷ lục riêng. Đổi độ khó là đổi luôn kỷ lục đang
          hiển thị.
        </span>
      </p>

      <div className="mt-5 flex items-center justify-between gap-3 border-t border-white/10 pt-4">
        <span className="flex items-center gap-2 text-sm text-[#C6DAE4]">
          {soundEnabled ? (
            <Volume2 className="size-4 text-[#8FB3C4]" aria-hidden="true" />
          ) : (
            <VolumeX className="size-4 text-[#8FB3C4]" aria-hidden="true" />
          )}
          Âm thanh
        </span>
        <button
          type="button"
          data-testid="btn-sound"
          onClick={onToggleSound}
          role="switch"
          aria-checked={soundEnabled}
          aria-label="Âm thanh"
          className={cn(
            "relative h-11 w-[68px] shrink-0 rounded-full border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD866] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A2130]",
            soundEnabled
              ? "border-[#FFD866] bg-[#FFD866]/20"
              : "border-white/10 bg-white/[0.06]"
          )}
        >
          <span
            aria-hidden="true"
            className={cn(
              "absolute top-1/2 size-8 -translate-y-1/2 rounded-full transition-all",
              soundEnabled ? "left-[34px] bg-[#FFD866]" : "left-1 bg-[#7E9AA9]"
            )}
          />
        </button>
      </div>
    </div>
  </div>
);

export default SettingsPanel;
