// libs
import { Play } from "lucide-react";

/**
 * Tạm dừng phải NHÌN THẤY được. Nếu chỉ đóng băng vòng lặp mà không hiện
 * gì, người chơi lỡ chạm phím P sẽ tưởng game bị treo.
 */
const PauseOverlay = ({ onResume }: { onResume: () => void }) => (
  <div
    data-testid="pause-overlay"
    className="pointer-events-none absolute inset-0 flex items-center justify-center p-4"
  >
    <div className="w-[min(100%,280px)] rounded-2xl border border-white/10 bg-[#0A2130]/85 p-6 text-center shadow-2xl backdrop-blur-md duration-150 animate-in fade-in zoom-in-95">
      <h2 className="text-xl font-bold tracking-tight text-[#EAF6FB]">
        Tạm dừng
      </h2>
      <p className="mt-1 text-sm text-[#8FB3C4]">
        Nhấn P hoặc Esc để chơi tiếp
      </p>

      <button
        type="button"
        data-testid="btn-resume"
        onClick={onResume}
        className="pointer-events-auto mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#FFD866] text-base font-semibold text-[#06222F] transition-colors hover:bg-[#FFE49A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD866] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A2130] active:bg-[#F0C44F]"
      >
        <Play className="size-5" aria-hidden="true" />
        Tiếp tục
      </button>
    </div>
  </div>
);

export default PauseOverlay;
