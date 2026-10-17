# DUCKERID — Đăng nhập Ducker ID tuỳ chọn (sau cờ tính năng)

Truy vết phía app: ADR `docs/decisions/0001-ducker-id-sign-in.md` · `docs/superpowers/specs/ducker-id-sign-in/design.md` ·
README "Optional Ducker ID sign-in (local only)".

- **REQ-DUCKERID-01** Cờ tắt (bản deploy): không nút đăng nhập, không menu tài khoản, không đọc URL (`?code=` để nguyên), không chạm `sessionStorage`, không request ra ngoài trang.
- **REQ-DUCKERID-02** Cờ bật: bấm "Đăng nhập" đi qua Ducker ID và quay về, URL sạch (không `code` / `state`), nút tài khoản hiện; không lỗi hydration.
- **REQ-DUCKERID-03** Menu tài khoản hiện tên, email, mục "Mở hồ sơ Ducker ID" trỏ tới trang hồ sơ trên issuer, và "Đăng xuất"; `Esc` đóng menu và trả focus về nút tài khoản.
- **REQ-DUCKERID-04** "Đăng xuất" đưa nút "Đăng nhập" trở lại và đặt focus vào nó.
- **REQ-DUCKERID-05** Đăng nhập không đổi gì về cách chơi: đã đăng nhập vẫn chơi được như thường.
- **REQ-DUCKERID-06** Hồ sơ chỉ nằm trong bộ nhớ: storage không giữ email, khoá `ducker.pkce` bị xoá khi quay về, tải lại trang là chưa đăng nhập.
- **REQ-DUCKERID-07** Từ chối ở Ducker ID, hoặc `state` bị sửa, thì về chưa đăng nhập, URL sạch, không báo lỗi; `state` sai thì không bao giờ gọi tới token endpoint.
- **REQ-DUCKERID-08** Issuer không trả lời thì sau tối đa 15 giây về lại chưa đăng nhập.
- **REQ-DUCKERID-09** `sessionStorage` bị chặn thì bấm "Đăng nhập" không đưa đi đâu cả (không kẹt ở callback), nút vẫn dùng được.
- **REQ-DUCKERID-10** Trên header, nút đăng nhập nằm giữa pill kỷ lục và nút âm thanh, cao/rộng ≥ 44px, không đè nút bên cạnh; ở 320 / 375px header vừa một hàng (không cuộn ngang, tên game một dòng, mọi nút ≥ 44px, không chồng nhau) ở cả ba trạng thái: trước khi JS chạy (nút hiện nhưng khoá), chưa đăng nhập, đã đăng nhập; menu tài khoản nằm trọn trong màn hình và mở ra không làm header nhảy.
- **REQ-DUCKERID-11** Phím trong menu tài khoản đang mở thuộc về menu: `↑` / `↓` không vỗ cánh, không vào lượt; `Esc` chỉ đóng menu.
