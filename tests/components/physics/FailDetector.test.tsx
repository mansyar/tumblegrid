import { FailDetector } from '@/components/physics/FailDetector';
import { useGameStore } from '@/store/useGameStore';
import { render } from '@testing-library/react';
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
});
