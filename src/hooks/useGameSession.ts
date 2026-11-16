import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  CORRECT_HOLD_MS,
  CUT_TOTAL_MS,
  ORDERS_PER_LEVEL,
  STARS_BY_ATTEMPT,
  WRONG_SHAKE_MS,
} from '../constants/config';
import {
  isServedCorrect,
  levelTip,
  makeOrder,
  wrongHint,
  type Order,
} from '../game/fractions';

export type Phase = 'cut' | 'cutting' | 'serve' | 'correct' | 'wrong';

export type LevelResult = {
  levelId: number;
  stars: number;
  orders: number;
  totalOrders: number;
  attempts: number;
  accuracy: number;
  tip: string;
  cleared: boolean;
};

/**
 * The per-level phase machine. Mutable bookkeeping lives in refs so that the
 * timeout callbacks never read stale state (rule #8).
 */
export function useGameSession(levelId: number, onGameOver: (r: LevelResult) => void) {
  const [orderIndex, setOrderIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>('cut');
  const [cutInto, setCutInto] = useState(0);
  const [chip, setChip] = useState<number | null>(null);
  const [selected, setSelected] = useState<number[]>([]);
  const [attempt, setAttempt] = useState(0);
  const [hint, setHint] = useState<string | null>(null);
  const [earnedStars, setEarnedStars] = useState(0);

  const starsRef = useRef<number[]>([]);
  const attemptsRef = useRef(0);
  const solvedRef = useRef(0);
  const attemptInOrderRef = useRef(0);
  const finishedRef = useRef(false);
  const timersRef = useRef<Array<ReturnType<typeof setTimeout>>>([]);
  const onGameOverRef = useRef(onGameOver);

  onGameOverRef.current = onGameOver;

  const schedule = useCallback((fn: () => void, ms: number) => {
    const id = setTimeout(fn, ms);
    timersRef.current.push(id);
    return id;
  }, []);

  useEffect(() => {
    const timers = timersRef;
    return () => {
      timers.current.forEach(clearTimeout);
      timers.current = [];
    };
  }, []);

  const order: Order = useMemo(
    () => makeOrder(levelId, orderIndex),
    [levelId, orderIndex],
  );

  const resetBoard = useCallback(() => {
    setCutInto(0);
    setChip(null);
    setSelected([]);
    setHint(null);
    setPhase('cut');
    attemptInOrderRef.current = 0;
    setAttempt(0);
  }, []);

  const finish = useCallback(() => {
    if (finishedRef.current) {
      return;
    }
    finishedRef.current = true;
    const earned = starsRef.current;
    const avg =
      earned.length > 0
        ? Math.round(earned.reduce((a, b) => a + b, 0) / earned.length)
        : 0;
    const attempts = Math.max(attemptsRef.current, 1);
    onGameOverRef.current({
      levelId,
      stars: Math.max(0, Math.min(3, avg)),
      orders: solvedRef.current,
      totalOrders: ORDERS_PER_LEVEL,
      attempts,
      accuracy: Math.round((solvedRef.current / attempts) * 100),
      tip: levelTip(levelId),
      cleared: solvedRef.current >= ORDERS_PER_LEVEL,
    });
  }, [levelId]);

  const pickChip = useCallback((value: number) => {
    setChip(value);
  }, []);

  const cut = useCallback(() => {
    if (chip === null) {
      return;
    }
    setPhase('cutting');
    setCutInto(chip);
    setSelected([]);
    setHint(null);
    schedule(() => setPhase('serve'), CUT_TOTAL_MS);
  }, [chip, schedule]);

  const toggleSlice = useCallback((index: number) => {
    setSelected(current =>
      current.includes(index)
        ? current.filter(i => i !== index)
        : [...current, index],
    );
  }, []);

  const serve = useCallback(() => {
    if (selected.length === 0 || cutInto === 0) {
      return;
    }
    attemptsRef.current += 1;
    const correct = isServedCorrect(selected.length, cutInto, order.target);

    if (correct) {
      const starIndex = Math.min(attemptInOrderRef.current, STARS_BY_ATTEMPT.length - 1);
      const award = STARS_BY_ATTEMPT[starIndex];
      starsRef.current = [...starsRef.current, award];
      solvedRef.current += 1;
      setEarnedStars(value => value + award);
      setPhase('correct');
      setHint(null);
      schedule(() => {
        if (orderIndex + 1 >= ORDERS_PER_LEVEL) {
          finish();
        } else {
          setOrderIndex(index => index + 1);
          resetBoard();
        }
      }, CORRECT_HOLD_MS);
      return;
    }

    attemptInOrderRef.current += 1;
    setAttempt(attemptInOrderRef.current);
    setHint(wrongHint(selected.length, cutInto, order.target));
    setPhase('wrong');
    schedule(() => {
      setSelected([]);
      setPhase('serve');
    }, WRONG_SHAKE_MS);
  }, [cutInto, finish, order.target, orderIndex, resetBoard, schedule, selected.length]);

  const quit = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    finishedRef.current = true;
  }, []);

  return {
    order,
    orderIndex,
    phase,
    cutInto,
    chip,
    selected,
    attempt,
    hint,
    earnedStars,
    canCut: chip !== null && phase === 'cut',
    canServe: phase === 'serve' && selected.length > 0,
    pickChip,
    cut,
    toggleSlice,
    serve,
    quit,
  };
}

export default useGameSession;
