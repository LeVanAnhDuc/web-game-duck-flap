// libs
import { Home as HomeIcon, RotateCcw, Sparkles } from "lucide-react";

/**
 * Màn hình thua. Hai con số đặt cạnh nhau, ngăn bởi một nét kẻ mảnh, để
 * mắt tự so sánh điểm vừa đạt với kỷ lục.
 *
 * Hiệu ứng vào chỉ 150ms: người thua muốn bấm "Chơi lại" ngay, chờ lâu
 * hơn là bực.
 */
const GameOverOverlay = ({
  score,
  best,
  isNewBest,
  difficultyLabel,
  onRestart,
  onMenu
}: {
  score: number;
  best: number;
  isNewBest: boolean;
  difficultyLabel: string;
  onRestart: () => void;
  onMenu: () => void;
}) => (
  <div
    data-testid="gameover-overlay"
    className="pointer-events-none absolute inset-0 flex items-center justify-center p-4"
  >
    <div className="w-[min(100%,320px)] rounded-2xl border border-white/10 bg-[#0A2130]/85 p-6 text-center shadow-2xl backdrop-blur-md duration-150 animate-in fade-in zoom-in-95">
      {isNewBest && (
        <span
          data-testid="new-best-badge"
          className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-[#37C978]/15 px-3 py-1 text-[13px] font-semibold text-[#4BE39A]"
        >
          <Sparkles className="size-3.5" aria-hidden="true" />
          Kỷ lục mới!
        </span>
      )}

      <h2 className="text-2xl font-bold tracking-tight text-[#EAF6FB]">
        Hết lượt
      </h2>
      <p className="mt-1 text-sm text-[#8FB3C4]">Mức {difficultyLabel}</p>

      <div className="mt-5 grid grid-cols-2">
        <div>
          <p className="text-sm text-[#8FB3C4]">Điểm</p>
          <p className="mt-1 text-4xl font-black tabular-nums leading-none text-[#EAF6FB]">
            {score}
          </p>
        </div>
        <div className="border-l border-white/10">
          <p className="text-sm text-[#8FB3C4]">Kỷ lục</p>
          <p className="mt-1 text-4xl font-black tabular-nums leading-none text-[#FFD866]">
            <span data-testid="best-score-overlay">{best}</span>
          </p>
        </div>
      </div>

      <button
        type="button"
        data-testid="btn-restart"
        onClick={onRestart}
        className="pointer-events-auto mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#FFD866] text-base font-semibold text-[#06222F] transition-colors hover:bg-[#FFE49A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD866] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A2130] active:bg-[#F0C44F]"
      >
        <RotateCcw className="size-5" aria-hidden="true" />
        Chơi lại
      </button>

      <button
        type="button"
        data-testid="btn-menu"
        onClick={onMenu}
        className="pointer-events-auto mt-3 flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] text-sm font-medium text-[#C6DAE4] transition-colors hover:border-white/20 hover:bg-white/[0.08] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD866] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A2130] active:bg-white/[0.12]"
      >
        <HomeIcon className="size-4" aria-hidden="true" />
        Về menu
      </button>
    </div>
  </div>
);

export default GameOverOverlay;
