import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Canvas } from '@react-three/fiber';
import { GridFloor } from '@/components/scene/GridFloor';

describe('GridFloor', () => {
  it('should render without errors', () => {
    const { container } = render(
      <Canvas>
        <GridFloor />
      </Canvas>
    );
    expect(container).toBeTruthy();
  });

  it('should have a canvas element', () => {
    const { container } = render(
      <Canvas>
        <GridFloor />
      </Canvas>
    );
    const canvas = container.querySelector('canvas');
    expect(canvas).toBeTruthy();
  });

  it('should render GridFloor component inside Canvas', () => {
    const { container } = render(
      <Canvas>
        <GridFloor />
      </Canvas>
    );
    // Verify the Canvas structure is present
    expect(container.firstChild).toBeTruthy();
  });
});
