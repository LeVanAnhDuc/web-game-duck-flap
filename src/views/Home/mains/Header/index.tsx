import { Trophy, Volume2, VolumeX } from "lucide-react";

type HeaderProps = {
  /** Điểm cao nhất của độ khó đang chọn. */
  best: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
  /**
   * GameStage nhường testid "btn-sound" cho công tắc trong bảng cài đặt
   * khi bảng đang mở, để trên màn hình luôn chỉ có đúng MỘT nút mang
   * testid này — và nút đó luôn là nút đang bấm được.
   */
  soundTestId?: string;
};

/**
 * Thanh tiêu đề cao cố định 56px. Đây là component thuần: mọi dữ liệu
 * nhận qua props, không gọi useGameEngine (toàn app chỉ có một lời gọi,
 * nằm ở GameStage).
 */
const Header = ({
  best,
  soundEnabled,
  onToggleSound,
  soundTestId = "btn-sound"
}: HeaderProps) => (
  <header className="flex h-14 shrink-0 items-center justify-between gap-3 border-b border-white/[0.07] bg-[#081C29] pl-4 pr-2">
    <span className="text-[15px] font-semibold tracking-tight text-[#EAF6FB]">
      Duck Flap
    </span>

    <div className="flex items-center gap-1">
      <span className="flex items-center gap-1.5 rounded-full bg-white/[0.06] px-3 py-1.5 text-[13px] font-semibold text-[#FFD866]">
        <Trophy className="size-3.5" aria-hidden="true" />
        <span data-testid="best-score" className="tabular-nums">
          {best}
        </span>
        <span className="sr-only">điểm cao nhất</span>
      </span>

      <button
        type="button"
        data-testid={soundTestId}
        onClick={onToggleSound}
        aria-pressed={soundEnabled}
        aria-label={soundEnabled ? "Tắt âm thanh" : "Bật âm thanh"}
        className="flex size-11 items-center justify-center rounded-full text-[#8FB3C4] transition-colors hover:bg-white/[0.08] hover:text-[#EAF6FB] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD866] focus-visible:ring-offset-2 focus-visible:ring-offset-[#081C29] active:bg-white/[0.14]"
      >
        {soundEnabled ? (
          <Volume2 className="size-5" aria-hidden="true" />
        ) : (
          <VolumeX className="size-5" aria-hidden="true" />
        )}
      </button>
    </div>
  </header>
);

export default Header;
