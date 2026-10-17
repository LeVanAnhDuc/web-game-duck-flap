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
      {/*
        Người lạ cần biết TRÒ NÀY LÀ GÌ trước khi cần biết nó TÊN GÌ. Tên
        thương hiệu là tiếng Anh, và người trình độ số thấp không đọc được
        nó — nên câu giải thích được kéo to và sáng lên, tên game nhường lại
        một bậc. Vẫn là h1, chỉ đổi sức nặng thị giác.
      */}
      <h1
        data-testid="menu-title"
        className="text-[28px] font-black leading-none tracking-[-0.03em] text-[#EAF6FB]"
      >
        Duck Flap
      </h1>
      <p
        data-testid="menu-tagline"
        className="mt-3 text-base leading-relaxed text-[#C6DAE4]"
      >
        Chạm liên tục để bay lên, luồn qua khe giữa hai ống, đừng chạm đất.
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

      {/*
        autoFocus: trong DOM, Header đứng trước vùng chơi nên Tab lần đầu
        rơi vào nút tắt tiếng thay vì hành động chính. Đặt tiêu điểm sẵn ở
        đây rẻ hơn và ít vỡ hơn là đi vá tabindex khắp nơi.
      */}
      {/* eslint-disable-next-line jsx-a11y/no-autofocus */}
      <button
        autoFocus
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
          className="pointer-events-auto flex h-11 shrink-0 items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] px-3 text-sm font-medium text-[#C6DAE4] transition-colors hover:border-white/20 hover:bg-white/[0.08] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD866] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A2130] active:bg-white/[0.12]"
        >
          {soundEnabled ? (
            <Volume2 className="size-5" aria-hidden="true" />
          ) : (
            <VolumeX className="size-5" aria-hidden="true" />
          )}
          {/*
            Hình cái loa một mình không nói được ĐANG bật hay ĐANG tắt —
            người sợ tiếng động phải bấm thử mới biết, đúng thứ họ muốn
            tránh. Chữ này là trạng thái hiện tại, không phải hành động.
          */}
          <span data-testid="sound-state">{soundEnabled ? "Bật" : "Tắt"}</span>
        </button>
      </div>
    </div>
  </div>
);

export default MenuOverlay;
