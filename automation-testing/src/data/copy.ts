// Text the tests assert on, copied verbatim with its source path, so a copy change is fixed here, not in specs.
// Duck Flap has no locale file: every Vietnamese string is written inline in its component (docs/superpowers/specs/
// ducker-id-sign-in/design.md: "Chuỗi tiếng Việt viết thẳng trong component như phần còn lại của flap").

import type { Difficulty } from "./test-data";

// ../client/src/views/Home/components/SettingsPanel/index.tsx → DIFFICULTY_LABELS
const difficultyLabel: Record<Difficulty, string> = { easy: "Dễ", normal: "Thường", hard: "Khó" };

export const copy = {
  // ../client/src/app/layout.tsx → metadata.title
  pageTitle: "Duck Flap",
  difficultyLabel,
  // ../client/src/views/Home/mains/Header/index.tsx
  header: {
    wordmark: "Duck Flap",
    bestLabel: "Kỷ lục",
    mute: "Tắt âm thanh",
    unmute: "Bật âm thanh",
  },
  // ../client/src/views/Home/components/MenuOverlay/index.tsx
  menu: {
    title: "Duck Flap",
    tagline: "Chạm liên tục để bay lên, luồn qua khe giữa hai ống, đừng chạm đất.",
    best: (d: Difficulty) => `Kỷ lục mức ${difficultyLabel[d]}`,
    play: "Chơi",
    settings: "Cài đặt",
    soundOn: "Bật",
    soundOff: "Tắt",
  },
  // ../client/src/views/Home/mains/GameStage/index.tsx → ready-overlay
  ready: {
    title: "Chạm liên tục để bay",
    hint: "Mỗi lần chạm nâng vịt lên một chút. Ngừng chạm là vịt rơi.",
  },
  // ../client/src/views/Home/components/PauseOverlay/index.tsx
  pause: {
    title: "Tạm dừng",
    hint: "Nhấn P hoặc Esc để chơi tiếp",
    resume: "Tiếp tục",
  },
  // ../client/src/views/Home/components/GameOverOverlay/index.tsx
  gameOver: {
    title: "Hết lượt",
    level: (d: Difficulty) => `Mức ${difficultyLabel[d]}`,
    score: "Điểm",
    best: "Kỷ lục",
    newBest: "Kỷ lục mới!",
    zeroHint: "Vịt rơi vì ngừng chạm. Chạm đều tay, mỗi lần chạm là một nhịp.",
    restart: "Chơi lại",
    toMenu: "Về menu",
  },
  // ../client/src/views/Home/components/SettingsPanel/index.tsx
  settings: {
    title: "Cài đặt",
    close: "Đóng cài đặt",
    difficulty: "Độ khó",
    note: "Mỗi độ khó có bảng kỷ lục riêng. Đổi độ khó là đổi luôn kỷ lục đang hiển thị.",
    sound: "Âm thanh",
  },
  // ../client/src/components/AccountButton/index.tsx
  account: {
    signIn: "Đăng nhập",
    signingIn: "Đang đăng nhập…",
    menuLabel: "Tài khoản Ducker ID",
    openProfile: "Mở hồ sơ Ducker ID",
    signOut: "Đăng xuất",
  },
} as const;

export const serverMessage = {} as const;
