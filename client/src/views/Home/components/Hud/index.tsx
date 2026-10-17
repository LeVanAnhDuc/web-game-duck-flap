/**
 * HUD tối giản: chỉ số điểm, to, canh giữa phía trên. Không viền, không
 * nhãn — mọi thứ khác đều làm rối mắt khi đang bay.
 *
 * `tabular-nums` giữ bề rộng chữ số cố định để con số không "nhảy" mỗi
 * lần ăn điểm; bóng đổ cứng giúp đọc rõ trên cả nền trời sáng lẫn ống xanh.
 */
const Hud = ({ score }: { score: number }) => (
  <div className="pointer-events-none absolute inset-x-0 top-0 flex justify-center pt-6">
    <span
      data-testid="hud-score"
      className="select-none text-6xl font-black tabular-nums leading-none tracking-tight text-white [text-shadow:0_3px_0_rgba(6,21,32,0.55)]"
    >
      {score}
    </span>
  </div>
);

export default Hud;
