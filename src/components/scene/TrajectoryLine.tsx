import { useGameStore } from '@/store/useGameStore';
import { Line } from '@react-three/drei';
import { useMemo } from 'react';

const LINE_COLOR = '#88ccff';
const LINE_OPACITY = 0.35;
const DASH_SIZE = 0.3;
const GAP_SIZE = 0.2;

export function TrajectoryLine() {
  const cache = useGameStore((s) => s.trajectoryPreviewCache);

  const lines = useMemo(() => {
    const entries = Array.from(cache.entries()).filter(
      ([_, points]) => points.length > 0,
    );
    if (entries.length === 0) return null;

    return entries.map(([key, points]) => (
      <Line
        key={key}
        points={points}
        color={LINE_COLOR}
        lineWidth={1}
        opacity={LINE_OPACITY}
        transparent
        dashed
        dashSize={DASH_SIZE}
        gapSize={GAP_SIZE}
      />
    ));
  }, [cache]);

  return <>{lines}</>;
}
