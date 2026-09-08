// Lai game vao khung hinh dung de chup anh README.
// Chay boi web-game/.claude/skills/readme-game/scripts/capture-screenshots.mjs.
// Khong co file nay thi anh chup ra man mo dau - o day la modal "Choi".
//
// Hop dong: export default async (page) => {...}. Viewport la 1280x720.

export default async function setup(page) {
  await page.getByRole('button', { name: 'Chơi' }).click();

  // Vo canh du day de chim khong roi xuong dat: nhip ~170ms giu no o giua khung
  // trong khi ong troi vao. Ket thuc NGAY SAU mot nhip vo, nen khung hinh chup
  // duoc la luc chim dang len - dung dang thai cua game nay.
  for (let i = 0; i < 9; i += 1) {
    await page.keyboard.press('Space');
    await page.waitForTimeout(170);
  }
  await page.keyboard.press('Space');
}
