import { useCallback, useState } from 'react';
import { TOTAL_LEVELS } from '../constants/config';
import type { LevelResult } from './useGameSession';

export type Progress = {
  level: number;
  stars: number;
  ordersDone: number;
  factsLearned: number;
  cleared: number[];
};

const INITIAL: Progress = {
  level: 1,
  stars: 0,
  ordersDone: 0,
  factsLearned: 0,
  cleared: [],
};

/** In-memory run progress — no storage dependency, no money, just counters. */
export function useProgress() {
  const [progress, setProgress] = useState<Progress>(INITIAL);

  const applyResult = useCallback((result: LevelResult) => {
    setProgress(prev => {
      const cleared =
        result.cleared && !prev.cleared.includes(result.levelId)
          ? [...prev.cleared, result.levelId]
          : prev.cleared;
      return {
        ...prev,
        stars: prev.stars + result.stars,
        ordersDone: prev.ordersDone + result.orders,
        cleared,
      };
    });
  }, []);

  const advanceLevel = useCallback(() => {
    setProgress(prev => ({
      ...prev,
      level: prev.level >= TOTAL_LEVELS ? TOTAL_LEVELS : prev.level + 1,
    }));
  }, []);

  const learnFacts = useCallback((count: number) => {
    setProgress(prev => ({
      ...prev,
      factsLearned: Math.max(prev.factsLearned, count),
    }));
  }, []);

  return { progress, applyResult, advanceLevel, learnFacts };
}

export default useProgress;
