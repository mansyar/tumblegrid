import { TrajectoryLine } from '@/components/scene/TrajectoryLine';
import { useGameStore } from '@/store/useGameStore';
import { render, screen } from '@testing-library/react';
import {
  describe,
  expect,
  it,
  vi,
  beforeEach,
  type Mock,
} from 'vitest';

// ─── Mocks ────────────────────────────────────────────────────────────

vi.mock('@react-three/drei', () => ({
  Line: vi.fn((props: Record<string, unknown>) => (
    <div
      data-testid="trajectory-line"
      data-props={JSON.stringify(props)}
    />
  )),
}));

vi.mock('@/store/useGameStore', () => ({
  useGameStore: vi.fn(),
}));

// ─── Tests ────────────────────────────────────────────────────────────

describe('TrajectoryLine', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders nothing when trajectoryPreviewCache is empty', () => {
    (useGameStore as unknown as Mock).mockImplementation(
      (selector: (state: Record<string, unknown>) => unknown) => {
        const state = { trajectoryPreviewCache: new Map() };
        return selector(state);
      },
    );

    const { container } = render(<TrajectoryLine />);
    expect(container.firstChild).toBeNull();
  });

  it('renders nothing when cache entries have empty points arrays', () => {
    const cache = new Map<string, [number, number, number][]>();
    cache.set('preview', []);

    (useGameStore as unknown as Mock).mockImplementation(
      (selector: (state: Record<string, unknown>) => unknown) => {
        const state = { trajectoryPreviewCache: cache };
        return selector(state);
      },
    );

    const { container } = render(<TrajectoryLine />);
    expect(container.firstChild).toBeNull();
  });

  it('renders a dotted polyline for each cache entry', () => {
    const cache = new Map<string, [number, number, number][]>();
    cache.set('entry-1', [
      [1, 0, 2],
      [3, 0, 2],
      [5, 0, 2],
    ]);

    (useGameStore as unknown as Mock).mockImplementation(
      (selector: (state: Record<string, unknown>) => unknown) => {
        const state = { trajectoryPreviewCache: cache };
        return selector(state);
      },
    );

    render(<TrajectoryLine />);
    const lines = screen.getAllByTestId('trajectory-line');
    expect(lines).toHaveLength(1);
  });

  it('renders multiple lines when cache has multiple entries', () => {
    const cache = new Map<string, [number, number, number][]>();
    cache.set('a', [
      [0, 0, 0],
      [1, 0, 0],
    ]);
    cache.set('b', [
      [4, 0, 4],
      [6, 0, 6],
    ]);

    (useGameStore as unknown as Mock).mockImplementation(
      (selector: (state: Record<string, unknown>) => unknown) => {
        const state = { trajectoryPreviewCache: cache };
        return selector(state);
      },
    );

    render(<TrajectoryLine />);
    const lines = screen.getAllByTestId('trajectory-line');
    expect(lines).toHaveLength(2);
  });

  it('passes correct points to Line component', () => {
    const points: [number, number, number][] = [
      [1, 0, 2],
      [3, 0, 2],
      [5, 0, 2],
    ];
    const cache = new Map<string, [number, number, number][]>();
    cache.set('test', points);

    (useGameStore as unknown as Mock).mockImplementation(
      (selector: (state: Record<string, unknown>) => unknown) => {
        const state = { trajectoryPreviewCache: cache };
        return selector(state);
      },
    );

    render(<TrajectoryLine />);

    const line = screen.getByTestId('trajectory-line');
    const props = JSON.parse(line.getAttribute('data-props') ?? '{}');
    expect(props.points).toEqual(points);
  });

  it('applies dashed, transparent, low-opacity pastel styling', () => {
    const cache = new Map<string, [number, number, number][]>();
    cache.set('test', [
      [0, 0, 0],
      [2, 0, 0],
    ]);

    (useGameStore as unknown as Mock).mockImplementation(
      (selector: (state: Record<string, unknown>) => unknown) => {
        const state = { trajectoryPreviewCache: cache };
        return selector(state);
      },
    );

    render(<TrajectoryLine />);

    const line = screen.getByTestId('trajectory-line');
    const props = JSON.parse(line.getAttribute('data-props') ?? '{}');
    expect(props.transparent).toBe(true);
    expect(props.dashed).toBe(true);
    // opacity should be low (< 0.5)
    expect(props.opacity).toBeLessThan(0.5);
    // color should be a pastel hex
    expect(props.color).toMatch(/^#[0-9a-f]{6}$/i);
  });
});
