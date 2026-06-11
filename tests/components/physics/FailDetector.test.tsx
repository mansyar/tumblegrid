import { FailDetector } from '@/components/physics/FailDetector';
import { useGameStore } from '@/store/useGameStore';
import { act, render } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';

// ─── Mock Rapier ───────────────────────────────────────────────────────

const mockRigidBody = vi.fn();
const mockForEachRigidBody = vi.fn();
let registeredBeforePhysicsCallback: (() => void) | null = null;

vi.mock('@react-three/rapier', () => ({
  useRapier: () => ({
    world: {
      forEachRigidBody: mockForEachRigidBody,
    },
  }),
  useBeforePhysicsStep: (cb: () => void) => {
    registeredBeforePhysicsCallback = cb;
  },
}));

// ─── Tests ─────────────────────────────────────────────────────────────

describe('FailDetector', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    registeredBeforePhysicsCallback = null;

    useGameStore.setState({
      machineState: 'PLAYING',
    });

    // Default mock: a dynamic body above fail threshold
    mockRigidBody.mockReturnValue({
      isDynamic: () => true,
      translation: () => ({ x: 0, y: 0, z: 0 }),
    });
    mockForEachRigidBody.mockImplementation(
      (cb: (body: unknown) => void) => {
        cb(mockRigidBody());
      },
    );
  });

  it('should render null', () => {
    const { container } = render(<FailDetector />);
    expect(container.innerHTML).toBe('');
  });

  it('should not trigger fail when marble is above threshold', () => {
    render(<FailDetector />);

    // Simulate physics step
    const cb = registeredBeforePhysicsCallback as () => void;
    cb();

    // State should remain PLAYING
    expect(useGameStore.getState().machineState).toBe('PLAYING');
  });

  it('should not trigger fail when not in play mode', () => {
    useGameStore.setState({ machineState: 'BUILDING' });

    render(<FailDetector />);

    const cb = registeredBeforePhysicsCallback as () => void;
    cb();

    expect(useGameStore.getState().machineState).toBe('BUILDING');
  });

  it('should trigger fail detection when marble is below Y = -5', () => {
    vi.useFakeTimers();
    useGameStore.setState({ machineState: 'PLAYING' });

    mockRigidBody.mockReturnValue({
      isDynamic: () => true,
      translation: () => ({ x: 0, y: -10, z: 0 }),
    });

    render(<FailDetector />);

    // Trigger physics step — should start fail timer
    const cb = registeredBeforePhysicsCallback as () => void;
    cb();

    // Before timeout, state should still be PLAYING
    expect(useGameStore.getState().machineState).toBe('PLAYING');

    // After 500ms, state should transition to BUILDING
    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(useGameStore.getState().machineState).toBe('BUILDING');

    vi.useRealTimers();
  });

  it('should cancel fail timer if marble returns above threshold', () => {
    vi.useFakeTimers();
    useGameStore.setState({ machineState: 'PLAYING' });

    // First tick: marble below threshold -> starts timer
    mockRigidBody.mockReturnValue({
      isDynamic: () => true,
      translation: () => ({ x: 0, y: -10, z: 0 }),
    });

    render(<FailDetector />);
    const cb = registeredBeforePhysicsCallback as () => void;
    cb();

    // Second tick: marble back above threshold -> should cancel timer
    mockRigidBody.mockReturnValue({
      isDynamic: () => true,
      translation: () => ({ x: 0, y: 0, z: 0 }),
    });
    cb();

    // Advance past the delay — state should NOT change
    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(useGameStore.getState().machineState).toBe('PLAYING');

    vi.useRealTimers();
  });
});
