import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Duck Flap",
  description:
    "Duck Flap - game kiểu Flappy Bird viết bằng Next.js, React và Canvas 2D. Chơi được trên cả máy tính lẫn điện thoại.",
  applicationName: "Duck Flap",
  appleWebApp: {
    capable: true,
    title: "Duck Flap",
    statusBarStyle: "black-translucent"
  }
};

/**
 * `maximumScale: 1` và `userScalable: false` là bắt buộc với game chạm:
 * nếu không, cú chạm nhanh liên tiếp để vỗ cánh sẽ bị trình duyệt hiểu
 * thành double-tap-to-zoom. `viewportFit: "cover"` để nền tràn ra vùng
 * tai thỏ trên iPhone.
 */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#0f172a"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
