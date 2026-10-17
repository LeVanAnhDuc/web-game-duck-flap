import { expect, type Locator, type Page } from "@playwright/test";
import { copy } from "@/data/copy";
import { FALL_MS, STORAGE, WORLD, type Difficulty } from "@/data/test-data";
import { scanWorld, shouldFlap, type WorldView } from "@/utils/world";
import { BasePage } from "./base.page";

export interface GotoOptions {
  /** localStorage entries planted before the app's first effect reads them (first load of the tab only). */
  storage?: Record<string, string>;
  /** Extra query string, without "?". */
  query?: string;
}

export interface StoredSettings {
  soundEnabled?: unknown;
  difficulty?: unknown;
}

const SEED_FLAG = "e2e:seeded";
const FRAME_MS = 16;
const CLOCK_START = Date.UTC(2026, 9, 1);

/**
 * Duck Flap is one screen: a header, a canvas and the DOM overlays drawn over it (menu, ready, pause, game over,
 * settings). Overlays carry no roles of their own, so they are found by the data-testid the app gives them; buttons
 * by role and name. The canvas itself is read through `readWorld()` (pixels, see src/utils/world.ts).
 */
export class GamePage extends BasePage {
  readonly settings: SettingsPanel;
  readonly account: AccountMenu;
  private fakeClock = false;

  constructor(page: Page) {
    super(page);
    this.settings = new SettingsPanel(page);
    this.account = new AccountMenu(page);
  }

  /**
   * Opens the game with localStorage in a known state. Planted with addInitScript because the app reads storage in its
   * first effect after mount — writing after `goto` is too late. Only the tab's first load is planted (a sessionStorage
   * flag), so a test that reloads sees what the app itself wrote.
   */
  async goto(options: GotoOptions = {}): Promise<void> {
    await this.page.addInitScript(
      ({ entries, flag }: { entries: Record<string, string>; flag: string }) => {
        try {
          if (window.sessionStorage.getItem(flag)) return;
          window.sessionStorage.setItem(flag, "1");
          window.localStorage.clear();
          for (const [key, value] of Object.entries(entries)) window.localStorage.setItem(key, value);
        } catch {
          // storage refused on purpose by the test (privacy mode): nothing to plant
        }
      },
      { entries: options.storage ?? {}, flag: SEED_FLAG },
    );
    await this.page.goto(options.query ? `./?${options.query}` : "./");
    await expect(this.menu()).toBeVisible();
  }

  async reload(): Promise<void> {
    await this.page.reload();
    await expect(this.menu()).toBeVisible();
  }

  /**
   * Freezes time before the page loads: page.clock fakes requestAnimationFrame too, and pausing it means the game loop
   * only moves when the test calls `advance()` — an installed clock that is not paused keeps flowing with real time, and
   * a busy machine then plays frames the test never looked at. Call before `goto()`.
   */
  async useFakeClock(): Promise<void> {
    await this.page.clock.install({ time: CLOCK_START });
    await this.page.clock.pauseAt(CLOCK_START + 1_000);
    this.fakeClock = true;
  }

  async advance(ms: number): Promise<void> {
    await this.page.clock.runFor(ms);
  }

  // ── layout ────────────────────────────────────────────────────────────
  header(): Locator {
    // a <header> inside <main> has no banner role, so it is found by tag
    return this.page.locator("header");
  }
  wordmark(): Locator {
    return this.header().getByText(copy.header.wordmark, { exact: true });
  }
  /** Every icon drawn in the header (lucide SVGs). */
  headerIcons(): Locator {
    return this.header().locator("svg");
  }
  headerBest(): Locator {
    return this.page.getByTestId("best-score");
  }
  /** The record pill: trophy, "Kỷ lục" and the number. */
  bestPill(): Locator {
    return this.headerBest().locator("xpath=..");
  }
  headerBestLabel(): Locator {
    return this.page.getByTestId("best-score-label");
  }
  headerSound(): Locator {
    return this.header().getByRole("button", { name: /âm thanh/ });
  }
  container(): Locator {
    return this.page.getByTestId("game-container");
  }
  canvas(): Locator {
    return this.page.getByTestId("game-canvas");
  }

  // ── menu ──────────────────────────────────────────────────────────────
  menu(): Locator {
    return this.page.getByTestId("menu-overlay");
  }
  menuTitle(): Locator {
    return this.page.getByTestId("menu-title");
  }
  menuTagline(): Locator {
    return this.page.getByTestId("menu-tagline");
  }
  /** The record shown on the menu card or on the game-over card (whichever is up). */
  overlayBest(): Locator {
    return this.page.getByTestId("best-score-overlay");
  }
  playButton(): Locator {
    // exact: "Chơi lại" on the game-over card contains "Chơi"
    return this.page.getByRole("button", { name: copy.menu.play, exact: true });
  }
  settingsButton(): Locator {
    return this.menu().getByRole("button", { name: copy.menu.settings });
  }
  menuSound(): Locator {
    return this.menu().getByRole("button", { name: /âm thanh/ });
  }
  soundState(): Locator {
    return this.page.getByTestId("sound-state");
  }

  // ── run ───────────────────────────────────────────────────────────────
  ready(): Locator {
    return this.page.getByTestId("ready-overlay");
  }
  /** The three bouncing hands of the ready screen (decorative, aria-hidden). */
  readyHands(): Locator {
    return this.ready().locator("svg");
  }
  hudScore(): Locator {
    return this.page.getByTestId("hud-score");
  }
  pauseOverlay(): Locator {
    return this.page.getByTestId("pause-overlay");
  }
  resumeButton(): Locator {
    return this.page.getByRole("button", { name: copy.pause.resume });
  }
  gameOver(): Locator {
    return this.page.getByTestId("gameover-overlay");
  }
  gameOverCard(): Locator {
    return this.page.getByTestId("gameover-card");
  }
  /** The run's score on the game-over card ("Điểm"). */
  gameOverScore(): Locator {
    return this.gameOverCard().getByText(copy.gameOver.score, { exact: true }).locator("xpath=following-sibling::p[1]");
  }
  zeroScoreHint(): Locator {
    return this.page.getByTestId("zero-score-hint");
  }
  newBestBadge(): Locator {
    return this.page.getByTestId("new-best-badge");
  }
  restartButton(): Locator {
    return this.page.getByRole("button", { name: copy.gameOver.restart });
  }
  toMenuButton(): Locator {
    return this.page.getByRole("button", { name: copy.gameOver.toMenu });
  }

  /** Menu → "Chơi" → the ready screen. */
  async play(): Promise<void> {
    await this.playButton().click();
    await expect(this.ready()).toBeVisible();
  }

  /** One flap from the keyboard. */
  async flap(key = "Space"): Promise<void> {
    await this.page.keyboard.press(key);
  }

  /**
   * Ready → one flap → hands off until the bird lands. On a fake clock time is advanced past the fall; on a real one
   * the test waits for the game-over card itself, never for a fixed time.
   */
  async playUntilGameOver(): Promise<void> {
    await this.play();
    await this.flap();
    if (this.fakeClock) await this.advance(FALL_MS);
    await expect(this.gameOver()).toBeVisible({ timeout: 15_000 });
  }

  /** One flap from the ready screen, then hands off until the bird lands (fake clock). */
  async letGoAfterFlap(): Promise<void> {
    await this.flap();
    await this.letGo();
  }

  /** Stops flapping and lets the bird land (fake clock): the run ends on the ground. */
  async letGo(): Promise<void> {
    await this.advance(FALL_MS);
    await expect(this.gameOver()).toBeVisible();
  }

  /** The data-testid of the element on top at a point of the play area (fractions of its box). */
  async topmostAt(fx = 0.5, fy = 0.5): Promise<string | null> {
    return this.container().evaluate(
      (el, [x, y]) => {
        const r = el.getBoundingClientRect();
        const hit = document.elementFromPoint(r.left + r.width * x, r.top + r.height * y);
        return hit?.getAttribute("data-testid") ?? null;
      },
      [fx, fy] as const,
    );
  }

  // ── canvas ────────────────────────────────────────────────────────────
  /** Bird and pipes as seen on the canvas, in world units (288 × 512). */
  async readWorld(): Promise<WorldView> {
    return this.canvas().evaluate(scanWorld);
  }

  /**
   * Flies the bird through `points` pipes, reading the canvas once per frame and flapping by `shouldFlap`. Needs the fake
   * clock (one frame of game time per decision, whatever the machine's speed). Returns the HUD score it stopped at (it may
   * overshoot by a point between two looks), or the score on the game-over card after a crash.
   */
  async autopilot(points: number, maxMs = 30_000): Promise<number> {
    if (!this.fakeClock) throw new Error("autopilot needs useFakeClock() before goto()");
    let score = 0;
    let previous: number | null = null;
    for (let t = 0; t < maxMs; t += FRAME_MS) {
      const view = await this.readWorld();
      if (shouldFlap(view, previous, WORLD.birdX, WORLD.birdHitboxHalfWidth)) await this.flap();
      previous = view.birdY;
      await this.advance(FRAME_MS);
      // the DOM is asked only every 8th frame: a point takes ~80 frames, and each question is a round trip
      if (t % (FRAME_MS * 8) === 0) {
        if ((await this.gameOver().count()) > 0) return Number((await this.gameOverScore().textContent()) ?? 0);
        score = Number((await this.hudScore().textContent()) ?? 0);
        if (score >= points) return score;
      }
    }
    return score;
  }

  /**
   * The part of the canvas the game actually paints, in CSS pixels relative to the canvas: the renderer clears the
   * whole canvas and clips to the world box, so everything outside it stays transparent (alpha 0).
   */
  async paintedBox(): Promise<{ x: number; y: number; width: number; height: number; canvasWidth: number; canvasHeight: number }> {
    return this.canvas().evaluate((c: HTMLCanvasElement) => {
      const ctx = c.getContext("2d")!;
      const dpr = c.width / c.clientWidth;
      const row = ctx.getImageData(0, Math.floor(c.height / 2), c.width, 1).data;
      const col = ctx.getImageData(Math.floor(c.width / 2), 0, 1, c.height).data;
      const extent = (d: Uint8ClampedArray) => {
        let first = -1;
        let last = -1;
        for (let i = 0; i < d.length / 4; i += 1) {
          if (d[i * 4 + 3] > 0) {
            if (first < 0) first = i;
            last = i;
          }
        }
        return [first, last + 1];
      };
      const [x0, x1] = extent(row);
      const [y0, y1] = extent(col);
      return {
        x: x0 / dpr,
        y: y0 / dpr,
        width: (x1 - x0) / dpr,
        height: (y1 - y0) / dpr,
        canvasWidth: c.clientWidth,
        canvasHeight: c.clientHeight,
      };
    });
  }

  /** Computed style of the play area that decides how the browser treats a finger on it. */
  async playAreaGestureStyle(): Promise<{ touchAction: string; userSelect: string }> {
    return this.container().evaluate((el) => {
      const cs = getComputedStyle(el);
      return { touchAction: cs.touchAction, userSelect: cs.userSelect || cs.webkitUserSelect };
    });
  }

  /**
   * Starts recording every keydown as it reaches `window` — after the game's own window listener, which was attached
   * at mount — with whether its default action was prevented. Read back with `recordedKeydowns()`.
   */
  async recordKeydowns(): Promise<void> {
    await this.page.evaluate(() => {
      const log: { code: string; prevented: boolean }[] = [];
      (window as unknown as { __keys: typeof log }).__keys = log;
      window.addEventListener("keydown", (e) => log.push({ code: e.code, prevented: e.defaultPrevented }));
    });
  }

  async recordedKeydowns(): Promise<{ code: string; prevented: boolean }[]> {
    return this.page.evaluate(() => (window as unknown as { __keys: { code: string; prevented: boolean }[] }).__keys);
  }

  // ── browser conditions ────────────────────────────────────────────────
  /** Hides or shows the tab the way switching tabs does: visibilityState + the visibilitychange event. */
  async setTabHidden(hidden: boolean): Promise<void> {
    await this.page.evaluate((h) => {
      Object.defineProperty(document, "visibilityState", { value: h ? "hidden" : "visible", configurable: true });
      document.dispatchEvent(new Event("visibilitychange"));
    }, hidden);
  }

  /**
   * Flaps and hides the tab in ONE synchronous task, so no animation frame can run between the two — the sliver between
   * the first flap and the run proper that ux-persona-fixes §2b found.
   */
  async flapThenHideTabAtOnce(): Promise<void> {
    await this.page.evaluate(() => {
      window.dispatchEvent(new KeyboardEvent("keydown", { code: "Space", cancelable: true }));
      Object.defineProperty(document, "visibilityState", { value: "hidden", configurable: true });
      document.dispatchEvent(new Event("visibilitychange"));
    });
  }

  /** A browser that refuses localStorage (privacy mode, blocked site data): reading it throws. Call before `goto()`. */
  async refuseLocalStorage(): Promise<void> {
    await this.page.addInitScript(() => {
      Object.defineProperty(window, "localStorage", {
        configurable: true,
        get() {
          throw new DOMException("The operation is insecure.", "SecurityError");
        },
      });
    });
  }

  /** A browser that refuses sessionStorage: reading it throws. Call before `goto()`. */
  async refuseSessionStorage(): Promise<void> {
    await this.page.addInitScript(() => {
      Object.defineProperty(window, "sessionStorage", {
        configurable: true,
        get() {
          throw new DOMException("The operation is insecure.", "SecurityError");
        },
      });
    });
  }

  /**
   * Wraps the Web Audio API so a test can tell whether sound was made without speakers: counts AudioContexts created
   * and records the waveform of every oscillator started. With `remove`, the browser has no Web Audio at all.
   * Call before `goto()`.
   */
  async probeAudio(options: { remove?: boolean } = {}): Promise<void> {
    await this.page.addInitScript((remove: boolean) => {
      const probe = { contexts: 0, started: [] as string[] };
      (window as unknown as { __audioProbe: typeof probe }).__audioProbe = probe;
      const w = window as unknown as Record<string, unknown>;
      if (remove) {
        delete w.AudioContext;
        delete w.webkitAudioContext;
        Object.defineProperty(window, "AudioContext", { value: undefined, configurable: true });
        Object.defineProperty(window, "webkitAudioContext", { value: undefined, configurable: true });
        return;
      }
      const Native = window.AudioContext;
      class Probed extends Native {
        constructor(...args: ConstructorParameters<typeof AudioContext>) {
          super(...args);
          probe.contexts += 1;
        }
        createOscillator(): OscillatorNode {
          const osc = super.createOscillator();
          const start = osc.start.bind(osc);
          osc.start = (when?: number) => {
            probe.started.push(osc.type);
            start(when);
          };
          return osc;
        }
      }
      Object.defineProperty(window, "AudioContext", { value: Probed, configurable: true, writable: true });
    }, options.remove ?? false);
  }

  async audioProbe(): Promise<{ contexts: number; started: string[] }> {
    return this.page.evaluate(() => (window as unknown as { __audioProbe: { contexts: number; started: string[] } }).__audioProbe);
  }

  // ── storage ───────────────────────────────────────────────────────────
  async storedSettings(): Promise<StoredSettings | null> {
    return this.page.evaluate((key) => {
      const raw = window.localStorage.getItem(key);
      return raw === null ? null : JSON.parse(raw);
    }, STORAGE.settings);
  }

  /** sessionStorage keys, without the one this page object plants itself (SEED_FLAG). */
  async sessionKeys(): Promise<string[]> {
    return this.page.evaluate((flag) => Object.keys(window.sessionStorage).filter((k) => k !== flag), SEED_FLAG);
  }

  async sessionItem(key: string): Promise<string | null> {
    return this.page.evaluate((k) => window.sessionStorage.getItem(k), key);
  }

  /** Everything in localStorage and sessionStorage, as one string (to search for leaked data). */
  async allStorageText(): Promise<string> {
    return this.page.evaluate(() => JSON.stringify({ ...window.localStorage }) + JSON.stringify({ ...window.sessionStorage }));
  }

  async urlSearch(): Promise<string> {
    return this.page.evaluate(() => window.location.search);
  }

  async storedBest(d: Difficulty): Promise<string | null> {
    return this.page.evaluate((key) => window.localStorage.getItem(key), STORAGE.best(d));
  }

  /** Horizontal overflow of the page in CSS pixels (0 = no sideways scroll). */
  async pageOverflowX(): Promise<number> {
    return this.page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  }

  /** Overflow of the page in both directions, CSS pixels (0 = nothing to scroll). */
  async pageOverflow(): Promise<{ x: number; y: number }> {
    return this.page.evaluate(() => ({
      x: document.documentElement.scrollWidth - window.innerWidth,
      y: document.documentElement.scrollHeight - window.innerHeight,
    }));
  }

  /** A computed CSS value of an element, as text. */
  async cssValue(locator: Locator, property: string): Promise<string> {
    return locator.evaluate((el, prop) => getComputedStyle(el).getPropertyValue(prop), property);
  }

  /** Computed `animation-name` of each element the locator matches. */
  async animationNames(locator: Locator): Promise<string[]> {
    return locator.evaluateAll((els) => els.map((el) => getComputedStyle(el).animationName));
  }

  /** The `lang` of the document. */
  async documentLang(): Promise<string | null> {
    return this.page.evaluate(() => document.documentElement.getAttribute("lang"));
  }

  /** A computed CSS length of an element, in pixels (font-size, height…). */
  async cssPx(locator: Locator, property: string): Promise<number> {
    return locator.evaluate((el, prop) => parseFloat(getComputedStyle(el).getPropertyValue(prop)), property);
  }

  /** The element that has keyboard focus, by its accessible text (aria-label or text content). */
  async focusedName(): Promise<string | null> {
    return this.page.evaluate(() => {
      const el = document.activeElement as HTMLElement | null;
      if (!el || el === document.body) return null;
      return el.getAttribute("aria-label") ?? el.textContent?.trim() ?? null;
    });
  }

  /**
   * Boxes of everything in the header row — the wordmark, the record pill and every button — plus the page's sideways
   * overflow, for "the header fits" checks.
   */
  async headerLayout(): Promise<{
    overflowX: number;
    wordmark: { x: number; y: number; width: number; height: number };
    pill: { x: number; y: number; width: number; height: number };
    buttons: { x: number; y: number; width: number; height: number }[];
  }> {
    return this.header().evaluate((header) => {
      const rect = (el: Element) => {
        const r = el.getBoundingClientRect();
        return { x: r.x, y: r.y, width: r.width, height: r.height };
      };
      return {
        overflowX: document.documentElement.scrollWidth - window.innerWidth,
        wordmark: rect(header.querySelector("span")!),
        pill: rect(header.querySelector("[data-testid=best-score]")!.parentElement!),
        buttons: Array.from(header.querySelectorAll("button")).map(rect),
      };
    });
  }

  /** The content of <meta name="viewport">. */
  async viewportMeta(): Promise<string | null> {
    return this.page.locator('meta[name="viewport"]').getAttribute("content");
  }
}

/** The settings dialog: difficulty, the record note, the sound switch. */
export class SettingsPanel {
  constructor(private readonly page: Page) {}

  dialog(): Locator {
    return this.page.getByRole("dialog", { name: copy.settings.title });
  }
  closeButton(): Locator {
    return this.dialog().getByRole("button", { name: copy.settings.close });
  }
  difficulty(d: Difficulty): Locator {
    return this.dialog().getByRole("button", { name: copy.difficultyLabel[d], exact: true });
  }
  difficultyGroup(): Locator {
    return this.dialog().getByRole("group", { name: copy.settings.difficulty });
  }
  note(): Locator {
    return this.dialog().getByText(copy.settings.note);
  }
  soundSwitch(): Locator {
    return this.dialog().getByRole("switch", { name: copy.settings.sound });
  }
  /** The dimmed backdrop around the dialog (its parent fills the play area). */
  backdrop(): Locator {
    return this.dialog().locator("xpath=..");
  }

  async open(): Promise<void> {
    await this.page.getByTestId("menu-overlay").getByRole("button", { name: copy.menu.settings }).click();
    await expect(this.dialog()).toBeVisible();
  }

  async choose(d: Difficulty): Promise<void> {
    await this.difficulty(d).click();
    await expect(this.difficulty(d)).toHaveAttribute("aria-pressed", "true");
  }
}

/** Ducker ID sign-in in the header (flag-on export only). */
export class AccountMenu {
  constructor(private readonly page: Page) {}

  signInButton(): Locator {
    // exact: the in-flight label "Đang đăng nhập…" contains "đăng nhập" too
    return this.page.getByRole("button", { name: copy.account.signIn, exact: true });
  }
  /** Any state of the sign-in button, including the disabled one before the client starts. */
  signInAnyState(): Locator {
    return this.page.getByTestId("btn-ducker-sign-in");
  }
  trigger(): Locator {
    return this.page.getByRole("button", { name: copy.account.menuLabel });
  }
  menu(): Locator {
    return this.page.getByRole("menu", { name: copy.account.menuLabel });
  }
  profileLink(): Locator {
    return this.page.getByRole("menuitem", { name: copy.account.openProfile });
  }
  signOutItem(): Locator {
    return this.page.getByRole("menuitem", { name: copy.account.signOut });
  }

  /** Clicks "Đăng nhập" and waits for the round trip: away to the issuer's authorize URL and back, page loaded. */
  async signInRoundTrip(issuer: string): Promise<void> {
    const bounced = this.page.waitForResponse((r) => r.url().startsWith(`${issuer}/oauth/authorize`));
    await this.signInButton().click();
    await bounced;
    await this.page.waitForLoadState("load");
  }
}
