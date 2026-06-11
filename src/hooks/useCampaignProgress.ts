import { useCallback, useState } from 'react';

const STORAGE_KEY = 'tumblegrid_campaign_progress';
const TOTAL_LEVELS = 5;

function loadCompletedLevels(): Set<number> {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored !== null) {
      const parsed: unknown = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        return new Set(parsed.filter((n) => typeof n === 'number'));
      }
    }
  } catch {
    // Private browsing or storage full — fail silently
  }
  return new Set<number>();
}

function saveCompletedLevels(levels: Set<number>): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...levels]));
  } catch {
    // Private browsing or storage full — fail silently
  }
}

export function useCampaignProgress() {
  const [completedLevels, setCompletedLevels] =
    useState<Set<number>>(loadCompletedLevels);

  const isLevelUnlocked = useCallback(
    (levelIndex: number): boolean => {
      if (levelIndex < 0 || levelIndex >= TOTAL_LEVELS) return false;
      if (levelIndex === 0) return true;
      return completedLevels.has(levelIndex - 1);
    },
    [completedLevels],
  );

  const completeLevel = useCallback((levelIndex: number): void => {
    if (levelIndex < 0 || levelIndex >= TOTAL_LEVELS) return;
    setCompletedLevels((prev) => {
      const next = new Set(prev);
      next.add(levelIndex);
      saveCompletedLevels(next);
      return next;
    });
  }, []);

  const getUnlockedLevels = useCallback((): number[] => {
    const levels: number[] = [];
    for (let i = 0; i < TOTAL_LEVELS; i++) {
      if (isLevelUnlocked(i)) {
        levels.push(i);
      }
    }
    return levels;
  }, [isLevelUnlocked]);

  return { isLevelUnlocked, completeLevel, getUnlockedLevels, completedLevels };
}
