import { Grid } from '@react-three/drei';

export function GridFloor() {
  return (
    <Grid
      cellSize={2}
      cellColor="#C0B8B0"
      sectionSize={10}
      sectionColor="#E8E0D8"
      fadeDistance={50}
      fadeStrength={1}
      infiniteGrid
      position={[0, 0, 0]}
    />
  );
}
