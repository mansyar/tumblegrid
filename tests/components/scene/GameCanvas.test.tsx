import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { GameCanvas } from '@/components/scene/GameCanvas';

describe('GameCanvas', () => {
  it('should render without errors', () => {
    expect(() => render(<GameCanvas />)).not.toThrow();
  });

  it('should render a canvas element that fills the viewport', () => {
    render(<GameCanvas />);

    const canvasContainer = screen.getByTestId('game-canvas');
    expect(canvasContainer).toBeInTheDocument();

    const styles = window.getComputedStyle(canvasContainer);
    expect(styles.width).toBe('100%');
    expect(styles.height).toBe('100%');
  });

  it('should render a canvas element inside the container', () => {
    render(<GameCanvas />);

    const canvasContainer = screen.getByTestId('game-canvas');
    const canvas = canvasContainer.querySelector('canvas');
    expect(canvas).toBeInTheDocument();
  });

  it('should have R3F Canvas structure', () => {
    render(<GameCanvas />);

    // R3F Canvas creates a specific DOM structure
    const canvasContainer = screen.getByTestId('game-canvas');
    expect(canvasContainer).toBeInTheDocument();

    // Canvas should be nested inside the container
    const canvas = canvasContainer.querySelector('canvas');
    expect(canvas).toBeInTheDocument();
    expect(canvas?.style.display).toBe('block');
  });
});
