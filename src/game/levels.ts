export type LevelKind = 'serve' | 'equiv' | 'add';

export type Level = {
  id: number;
  kind: LevelKind;
  /** Denominator chips the player may cut with on this level. */
  denominators: number[];
  /** Target fractions, one per order. For `add` levels these are the sums. */
  targets: Array<[number, number]>;
  tip: string;
};

/**
 * 12 levels, 3 orders each.
 *  L1-L4  simple serve   — cut into 2 / 4, serve the asked slices.
 *  L5-L8  equivalence    — the ticket asks 1/2 or 1/3 but the chips force 4/6/8,
 *                          so the player discovers 2/4 = 3/6 = 4/8 = 1/2.
 *  L9-L12 add            — the ticket shows a sum, the player serves the total.
 */
export const LEVELS: Level[] = [
  {
    id: 1,
    kind: 'serve',
    denominators: [2, 3, 4],
    targets: [
      [1, 2],
      [1, 4],
      [3, 4],
    ],
    tip: 'THE BOTTOM NUMBER IS HOW MANY SLICES YOU CUT.',
  },
  {
    id: 2,
    kind: 'serve',
    denominators: [2, 3, 4],
    targets: [
      [2, 4],
      [1, 2],
      [2, 3],
    ],
    tip: 'THE TOP NUMBER IS HOW MANY SLICES YOU SERVE.',
  },
  {
    id: 3,
    kind: 'serve',
    denominators: [3, 4, 6],
    targets: [
      [1, 3],
      [3, 6],
      [1, 4],
    ],
    tip: 'MORE SLICES MEANS EVERY SLICE IS SMALLER.',
  },
  {
    id: 4,
    kind: 'serve',
    denominators: [4, 6, 8],
    targets: [
      [3, 8],
      [5, 8],
      [4, 6],
    ],
    tip: '3/8 IS LESS THAN HALF THE PIZZA.',
  },
  {
    id: 5,
    kind: 'equiv',
    denominators: [4, 6, 8],
    targets: [
      [1, 2],
      [1, 2],
      [1, 2],
    ],
    tip: '2/4 AND 4/8 FILL THE SAME PLATE AS 1/2.',
  },
  {
    id: 6,
    kind: 'equiv',
    denominators: [3, 6],
    targets: [
      [1, 3],
      [2, 3],
      [1, 3],
    ],
    tip: '2/6 IS THE SAME SIZE AS 1/3.',
  },
  {
    id: 7,
    kind: 'equiv',
    denominators: [4, 8],
    targets: [
      [1, 4],
      [3, 4],
      [1, 4],
    ],
    tip: 'DOUBLE THE SLICES, DOUBLE THE PIECES YOU SERVE.',
  },
  {
    id: 8,
    kind: 'equiv',
    denominators: [2, 6, 8],
    targets: [
      [1, 2],
      [1, 3],
      [3, 4],
    ],
    tip: 'ONE FRACTION CAN HAVE MANY NAMES.',
  },
  {
    id: 9,
    kind: 'add',
    denominators: [4, 8],
    targets: [
      [3, 8],
      [3, 4],
      [5, 8],
    ],
    tip: '1/4 PLUS 1/8 IS THE SAME AS 3/8.',
  },
  {
    id: 10,
    kind: 'add',
    denominators: [6, 8],
    targets: [
      [5, 6],
      [7, 8],
      [2, 3],
    ],
    tip: 'ADD THE SLICES, KEEP THE SLICE SIZE.',
  },
  {
    id: 11,
    kind: 'add',
    denominators: [4, 6, 8],
    targets: [
      [7, 8],
      [5, 6],
      [3, 4],
    ],
    tip: 'ALMOST A WHOLE PIZZA IS JUST ONE SLICE SHORT.',
  },
  {
    id: 12,
    kind: 'add',
    denominators: [6, 8],
    targets: [
      [1, 1],
      [7, 8],
      [5, 6],
    ],
    tip: 'ALL THE SLICES TOGETHER MAKE ONE WHOLE PIZZA.',
  },
];

export function getLevel(id: number): Level {
  const index = Math.max(0, Math.min(LEVELS.length - 1, id - 1));
  return LEVELS[index];
}
