/**
 * Bảng màu duy nhất của tầng vẽ.
 *
 * Tông màu: hoàng hôn xanh mực → cam đào ở chân trời, ống xanh bạc hà,
 * chim vàng ấm. Cặp "vàng ấm trên xanh lạnh" cho độ tương phản cao nhất
 * nên chim luôn nổi bật dù đang bay trên trời, trước ống hay sát mặt đất.
 *
 * Mọi mã màu của game nằm ở đây để đổi tông chỉ cần sửa một file.
 */
export const PALETTE = {
  sky: {
    top: "#0B2545",
    mid: "#2F6EA5",
    pale: "#8FC7D6",
    horizon: "#F6B891",
    /** Quầng sáng mặt trời, chuyển dần về trong suốt. */
    glowInner: "rgba(255, 214, 170, 0.55)",
    glowOuter: "rgba(255, 214, 170, 0)"
  },
  clouds: {
    /** Lớp xa mờ hơn để mắt tự hiểu là ở sâu phía sau. */
    far: "rgba(226, 240, 247, 0.32)",
    near: "rgba(255, 252, 245, 0.72)"
  },
  hills: {
    far: "#35708F",
    near: "#1E4F6B"
  },
  pipe: {
    body: "#37C978",
    light: "#7CEFAF",
    dark: "#128B4E",
    edge: "#075A33",
    capBody: "#41D687",
    capLight: "#8AF3BC",
    capDark: "#0F7F49"
  },
  ground: {
    topEdge: "#4BE39A",
    topEdgeShadow: "#0F7F49",
    baseTop: "#173D52",
    baseBottom: "#0D2735",
    /** Sọc chéo rất nhạt: đủ thấy chuyển động, không cướp sự chú ý. */
    stripe: "rgba(255, 255, 255, 0.055)",
    soil: "#0A1E29"
  },
  bird: {
    bodyTop: "#FFD866",
    bodyBottom: "#F2A03D",
    belly: "#FFF0C2",
    wing: "#FFB443",
    wingLight: "#FFE1A0",
    outline: "#8C4A0F",
    beak: "#FF7A45",
    beakDark: "#E2542A",
    eyeWhite: "#FFFFFF",
    pupil: "#12222E"
  },
  /** Lớp phủ khi thua, đủ tối để HUD đọc rõ mà vẫn thấy thế giới bên dưới. */
  overlay: "rgba(8, 20, 32, 0.45)"
} as const;
