# Flappy Bird

Bản Flappy Bird chạy trên web, viết bằng Next.js 15 + React 19 + Canvas 2D.
Toàn bộ hình ảnh và âm thanh được sinh bằng code — không dùng một file asset nào.

- Chơi được trên cả máy tính lẫn điện thoại
- Ba mức độ khó, mỗi mức có bảng kỷ lục riêng
- Tạm dừng, bật/tắt âm thanh, lưu cài đặt và điểm cao vào máy người chơi

## Chạy dự án

```bash
yarn dev        # chạy ở chế độ phát triển, mở http://localhost:3000
yarn build      # build bản production
yarn start      # chạy bản đã build
```

## Kiểm thử

```bash
yarn test       # unit test logic game (Vitest)
yarn test:e2e   # test luồng người dùng (Playwright, desktop + mobile)
yarn typecheck  # kiểm tra kiểu TypeScript
```

## Điều khiển

| Thao tác | Phím / cử chỉ                                 |
| -------- | --------------------------------------------- |
| Vỗ cánh  | `Space`, `↑`, `W`, click chuột, chạm màn hình |
| Tạm dừng | `P` hoặc `Esc`                                |

## Kiến trúc

Nguyên tắc xuyên suốt: **`src/game/` không import React.** Nó là một thư viện
TypeScript độc lập, chạy được trong Node — nhờ vậy toàn bộ luật chơi kiểm chứng
được bằng unit test mà không cần trình duyệt.

```
src/
├── game/
│   ├── core/      Hàm thuần: vật lý, sinh ống, va chạm, tính điểm, vòng đời thế giới
│   ├── engine/    Vòng lặp requestAnimationFrame, thu nhận bàn phím/chuột/chạm
│   ├── render/    Vẽ Canvas 2D: viewport, các lớp hình, bảng màu
│   ├── score/     Lưu kỷ lục (interface + bản localStorage)
│   ├── settings/  Lưu cài đặt
│   ├── storage/   Bọc localStorage an toàn (SSR, chế độ ẩn danh)
│   └── audio/     Âm thanh sinh bằng WebAudio
├── hooks/
│   └── useGameEngine.ts   Cầu nối duy nhất giữa engine và React
└── views/Home/            Giao diện: Header, canvas, HUD và các overlay
```

Hai điểm đáng chú ý trong thiết kế:

1. **Thế giới cố định 288 × 512 đơn vị logic**, scale ra màn hình theo kiểu
   _contain_. Mọi thiết bị mô phỏng trên cùng kích thước nên độ khó và điểm số
   công bằng như nhau.
2. **Vật lý chạy ở bước cố định 1/120 giây.** Màn hình 60Hz hay 144Hz đều cho ra
   hành vi giống hệt nhau. Engine chỉ báo cho React khi điểm hoặc trạng thái
   thực sự đổi, nên React không bao giờ render lại theo từng khung hình.

Tài liệu thiết kế đầy đủ: [`docs/superpowers/specs/2026-09-03-flappy-bird-design.md`](docs/superpowers/specs/2026-09-03-flappy-bird-design.md)
