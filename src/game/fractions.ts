import { getLevel, Level, LevelKind } from './levels';

export type Fraction = { n: number; d: number };

export type Order = {
  /** 0-based index inside the level. */
  index: number;
  kind: LevelKind;
  target: Fraction;
  /** Only for `add` orders — the two parts printed on the ticket. */
  addends: [Fraction, Fraction] | null;
  /** Denominator chips offered for this order. */
  denominators: number[];
};

export function gcd(a: number, b: number): number {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x || 1;
}

export function simplify(n: number, d: number): Fraction {
  if (d === 0) {
    return { n: 0, d: 1 };
  }
  const g = gcd(n, d);
  return { n: n / g, d: d / g };
}

/** Value equality — 2/8 equals 1/4. This is the whole teaching point. */
export function equals(a: Fraction, b: Fraction): boolean {
  return a.n * b.d === b.n * a.d;
}

/**
 * A serve is correct when the served quantity has the same VALUE as the target,
 * no matter which denominator the player cut with.
 */
export function isServedCorrect(
  picked: number,
  cutInto: number,
  target: Fraction,
): boolean {
  if (cutInto <= 0 || picked <= 0) {
    return false;
  }
  return picked * target.d === target.n * cutInto;
}

/** Split a target into two printable addends for the `add` levels. */
function splitTarget(target: Fraction): [Fraction, Fraction] {
  if (target.d <= 1) {
    return [
      { n: 1, d: 2 },
      { n: 1, d: 2 },
    ];
  }
  const a = Math.ceil(target.n / 2);
  const b = target.n - a;
  if (b <= 0) {
    return [
      { n: 1, d: target.d * 2 },
      { n: target.n * 2 - 1, d: target.d * 2 },
    ];
  }
  return [simplify(a, target.d), simplify(b, target.d)];
}

export function makeOrder(levelId: number, index: number): Order {
  const level: Level = getLevel(levelId);
  const slot = Math.max(0, Math.min(level.targets.length - 1, index));
  const [n, d] = level.targets[slot];
  const target: Fraction = { n, d };
  return {
    index: slot,
    kind: level.kind,
    target,
    addends: level.kind === 'add' ? splitTarget(target) : null,
    denominators: level.denominators,
  };
}

export function levelTip(levelId: number): string {
  return getLevel(levelId).tip;
}

/** A gentle, never-scolding hint after a wrong serve. */
export function wrongHint(picked: number, cutInto: number, target: Fraction): string {
  if (cutInto === 0) {
    return 'CUT THE PIZZA FIRST, THEN PICK THE SLICES.';
  }
  const servedValue = picked / cutInto;
  const targetValue = target.n / target.d;
  if (servedValue > targetValue) {
    return 'THAT IS A BIT TOO MUCH — TAKE A SLICE BACK.';
  }
  if (servedValue < targetValue) {
    return 'ALMOST — ONE MORE SLICE ON THE PLATE.';
  }
  return 'THE BOTTOM NUMBER IS HOW MANY SLICES.';
}
