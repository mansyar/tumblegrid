import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock localStorage before importing the hook
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

import { useCampaignProgress } from '@/hooks/useCampaignProgress';

describe('useCampaignProgress', () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  it('should return isLevelUnlocked as a function', () => {
    const { result } = renderHook(() => useCampaignProgress());
    expect(typeof result.current.isLevelUnlocked).toBe('function');
  });

  it('should have level 0 unlocked by default', () => {
    const { result } = renderHook(() => useCampaignProgress());
    expect(result.current.isLevelUnlocked(0)).toBe(true);
  });

  it('should have levels 1-4 locked by default (no completion data)', () => {
    const { result } = renderHook(() => useCampaignProgress());
    expect(result.current.isLevelUnlocked(1)).toBe(false);
    expect(result.current.isLevelUnlocked(2)).toBe(false);
    expect(result.current.isLevelUnlocked(3)).toBe(false);
    expect(result.current.isLevelUnlocked(4)).toBe(false);
  });

  it('should unlock level 1 after level 0 is completed', () => {
    const { result } = renderHook(() => useCampaignProgress());

    act(() => {
      result.current.completeLevel(0);
    });

    expect(result.current.isLevelUnlocked(0)).toBe(true);
    expect(result.current.isLevelUnlocked(1)).toBe(true);
    expect(result.current.isLevelUnlocked(2)).toBe(false);
  });

  it('should unlock level 2 after level 1 is completed (with level 0 already done)', () => {
    const { result } = renderHook(() => useCampaignProgress());

    act(() => {
      result.current.completeLevel(0);
    });

    act(() => {
      result.current.completeLevel(1);
    });

    expect(result.current.isLevelUnlocked(2)).toBe(true);
    expect(result.current.isLevelUnlocked(3)).toBe(false);
  });

  it('should persist completed levels to localStorage', () => {
    const { result } = renderHook(() => useCampaignProgress());

    act(() => {
      result.current.completeLevel(0);
    });

    act(() => {
      result.current.completeLevel(1);
    });

    expect(localStorageMock.setItem).toHaveBeenCalled();
    const setCalls = localStorageMock.setItem.mock.calls.filter(
      (call: string[]) => call[0] === 'tumblegrid_campaign_progress',
    );
    // Last call should have both levels
    const lastCall = setCalls[setCalls.length - 1];
    const saved = JSON.parse(lastCall[1]);
    expect(saved).toContain(0);
    expect(saved).toContain(1);
  });

  it('should restore completed levels from localStorage on mount', () => {
    // Pre-seed localStorage
    localStorageMock.getItem.mockReturnValueOnce('[0,1]');

    const { result } = renderHook(() => useCampaignProgress());

    expect(result.current.isLevelUnlocked(2)).toBe(true);
    expect(result.current.isLevelUnlocked(3)).toBe(false);
  });

  it('should return all unlocked levels via getUnlockedLevels', () => {
    const { result } = renderHook(() => useCampaignProgress());

    // Initially only level 0
    expect(result.current.getUnlockedLevels()).toEqual([0]);

    act(() => {
      result.current.completeLevel(0);
    });

    // Level 0 and 1 unlocked
    expect(result.current.getUnlockedLevels()).toEqual([0, 1]);

    act(() => {
      result.current.completeLevel(1);
    });

    // Levels 0, 1, 2 unlocked
    expect(result.current.getUnlockedLevels()).toEqual([0, 1, 2]);
  });

  it('should handle localStorage errors gracefully (private browsing)', () => {
    // Make localStorage.setItem throw
    localStorageMock.setItem.mockImplementationOnce(() => {
      throw new Error('Storage full');
    });

    const { result } = renderHook(() => useCampaignProgress());

    // Should not throw
    expect(() => {
      act(() => {
        result.current.completeLevel(0);
      });
    }).not.toThrow();

    // Should still work in memory even if localStorage fails
    expect(result.current.isLevelUnlocked(1)).toBe(true);
  });

  it('should handle localStorage getItem errors gracefully', () => {
    localStorageMock.getItem.mockImplementationOnce(() => {
      throw new Error('Storage error');
    });

    const { result } = renderHook(() => useCampaignProgress());

    // Should still have level 0 unlocked
    expect(result.current.isLevelUnlocked(0)).toBe(true);
    expect(result.current.isLevelUnlocked(1)).toBe(false);
  });
});
