// components
import GameStage from "./mains/GameStage";

/**
 * Khung trang: cao đúng 100dvh (không dùng h-screen — trên mobile
 * h-screen tính cả phần bị thanh địa chỉ che, nút dưới cùng sẽ bị mất)
 * và không bao giờ cuộn.
 *
 * Header nằm bên trong GameStage vì nó cần dữ liệu engine; xem ghi chú
 * ở GameStage.
 */
const Home = () => (
  <main className="flex h-[100dvh] w-full flex-col overflow-hidden bg-[#04121C] text-[#EAF6FB]">
    <GameStage />
  </main>
);

export default Home;
