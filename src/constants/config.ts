import { Dimensions } from 'react-native';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

export { SCREEN_W, SCREEN_H };

/**
 * Splash duration. MUST stay exactly 8000 (rule #13) — shorter values race the
 * emulator screenshot window and the Loader/Menu pHash gate fails.
 */
export const LOADER_DURATION_MS = 8000;

/** Screen chrome heights — the Game screen is a fixed flex stack, no ScrollView. */
export const STATUS_PAD = 44; // rule #6
export const HEADER_BODY_H = 72;
export const HEADER_H = HEADER_BODY_H + STATUS_PAD; // 116
export const STAT_STRIP_H = 56;
export const CONTROLS_H = 196;
export const TICKET_H = 92;
const GAME_AREA_PAD = 28;

/**
 * Board geometry — rule #4: the parent's padding + border are part of the frame,
 * so the pizza is sized from the inner box and the disc is rebuilt from it.
 * The width is additionally capped by the height left over after header /
 * stat-strip / controls so the board can never push the stack off-screen.
 */
export const BOARD_PAD = 6;
export const BOARD_BORDER = 2;
export const BOARD_FRAME = BOARD_PAD + BOARD_BORDER; // 8

const AVAILABLE_H =
  SCREEN_H - HEADER_H - STAT_STRIP_H - CONTROLS_H - TICKET_H - GAME_AREA_PAD;

export const BOARD_MAX_W = Math.min(
  SCREEN_W - 32,
  380,
  Math.max(200, Math.floor(AVAILABLE_H)),
);

export const PIZZA_SIZE = BOARD_MAX_W - 2 * BOARD_FRAME;
export const BOARD_W = PIZZA_SIZE + 2 * BOARD_FRAME;

/** Card width shared by ticket / score card so the columns line up. */
export const CARD_W = Math.min(SCREEN_W - 32, 380);

/** Session shape. */
export const ORDERS_PER_LEVEL = 3;
export const TOTAL_LEVELS = 12;

/** Stars awarded by attempt number (1st try = 3 stars). */
export const STARS_BY_ATTEMPT = [3, 2, 1];

/** Timings used by the game session machine. */
export const CUT_STEP_MS = 150;
export const CUT_TOTAL_MS = 240;
export const CORRECT_HOLD_MS = 650;
export const WRONG_SHAKE_MS = 320;

/** Minimum touch target (rule: buttons >= 48px). */
export const TOUCH_MIN = 48;
export const HIT_SLOP = { top: 8, bottom: 8, left: 8, right: 8 };
