// libs
import { Play, Settings, Volume2, VolumeX } from "lucide-react";

/**
 * Màn hình chờ. Cả lớp phủ để pointer-events-none, chỉ các nút mới nhận
 * chạm — nếu không, lớp phủ sẽ nuốt cú chạm vỗ cánh của người chơi.
 */
const MenuOverlay = ({
  best,
  difficultyLabel,
  soundEnabled,
  onPlay,
  onOpenSettings,
  onToggleSound
}: {
  /** Kỷ lục của ĐỘ KHÓ ĐANG CHỌN, không phải kỷ lục chung. */
  best: number;
  difficultyLabel: string;
  soundEnabled: boolean;
  onPlay: () => void;
  onOpenSettings: () => void;
  onToggleSound: () => void;
}) => (
  <div
    data-testid="menu-overlay"
    className="pointer-events-none absolute inset-0 flex items-center justify-center p-4"
  >
    <div className="w-[min(100%,320px)] rounded-2xl border border-white/10 bg-[#0A2130]/85 p-6 text-center shadow-2xl backdrop-blur-md duration-200 animate-in fade-in zoom-in-95">
      <h1 className="text-[34px] font-black leading-none tracking-[-0.03em] text-[#EAF6FB]">
        Duck Flap
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-[#8FB3C4]">
        Chạm để bay lên, luồn qua khe giữa hai ống, đừng chạm đất.
      </p>

      <div className="mt-5 flex items-baseline justify-center gap-2 border-t border-white/10 pt-4">
        <span className="text-sm text-[#8FB3C4]">
          Kỷ lục mức {difficultyLabel}
        </span>
        <span
          data-testid="best-score-overlay"
          className="text-2xl font-bold tabular-nums leading-none text-[#FFD866]"
        >
          {best}
        </span>
      </div>

      <button
        type="button"
        data-testid="btn-play"
        onClick={onPlay}
        className="pointer-events-auto mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#FFD866] text-base font-semibold text-[#06222F] transition-colors hover:bg-[#FFE49A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD866] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A2130] active:bg-[#F0C44F]"
      >
        <Play className="size-5 fill-current" aria-hidden="true" />
        Chơi
      </button>

      <div className="mt-3 flex items-center justify-center gap-2">
        <button
          type="button"
          data-testid="btn-settings"
          onClick={onOpenSettings}
          className="pointer-events-auto flex h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] text-sm font-medium text-[#C6DAE4] transition-colors hover:border-white/20 hover:bg-white/[0.08] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD866] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A2130] active:bg-white/[0.12]"
        >
          <Settings className="size-4" aria-hidden="true" />
          Cài đặt
        </button>
        <button
          type="button"
          data-testid="btn-sound-menu"
          onClick={onToggleSound}
          aria-pressed={soundEnabled}
          aria-label={soundEnabled ? "Tắt âm thanh" : "Bật âm thanh"}
          className="pointer-events-auto flex size-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-[#C6DAE4] transition-colors hover:border-white/20 hover:bg-white/[0.08] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD866] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A2130] active:bg-white/[0.12]"
        >
          {soundEnabled ? (
            <Volume2 className="size-5" aria-hidden="true" />
          ) : (
            <VolumeX className="size-5" aria-hidden="true" />
          )}
        </button>
      </div>
    </div>
  </div>
);

export default MenuOverlay;
