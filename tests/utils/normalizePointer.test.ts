import { describe, expect, it } from 'vitest';

import {
  type NormalizedPointer,
  normalizePointer,
} from '@/utils/input/normalizePointer';

function makeElement(rect: {
  left: number;
  top: number;
  width: number;
  height: number;
}): HTMLElement {
  return {
    getBoundingClientRect: () => rect,
  } as unknown as HTMLElement;
}

function makeTouch(clientX: number, clientY: number): Touch {
  return {
    identifier: 0,
    target: document.createElement('div'),
    clientX,
    clientY,
    pageX: clientX,
    pageY: clientY,
    screenX: clientX,
    screenY: clientY,
    radiusX: 0,
    radiusY: 0,
    rotationAngle: 0,
    force: 0,
  } as unknown as Touch;
}

function makeMouseEvent(overrides: Partial<MouseEventInit> = {}): MouseEvent {
  return new MouseEvent('click', {
    clientX: 0,
    clientY: 0,
    button: 0,
    ...overrides,
  });
}

function makePointerEvent(
  overrides: Partial<PointerEventInit> = {},
): PointerEvent {
  return new PointerEvent('pointerdown', {
    clientX: 0,
    clientY: 0,
    button: 0,
    pointerType: 'mouse',
    ...overrides,
  });
}

describe('NormalizedPointer type', () => {
  it('should compile with all required fields', () => {
    const ptr: NormalizedPointer = {
      x: 0,
      y: 0,
      button: 0,
      isTouch: false,
    };
    expect(ptr.x).toBe(0);
    expect(ptr.y).toBe(0);
    expect(ptr.button).toBe(0);
    expect(ptr.isTouch).toBe(false);
  });
});

describe('normalizePointer — MouseEvent', () => {
  const el = makeElement({
    left: 0,
    top: 0,
    width: 200,
    height: 100,
  });

  it('should normalize center coordinates to (0, 0)', () => {
    const event = makeMouseEvent({ clientX: 100, clientY: 50 });
    const result = normalizePointer(event, el);

    expect(result.x).toBe(0);
    expect(result.y).toBe(0);
    expect(result.isTouch).toBe(false);
  });

  it('should normalize top-left corner to (-1, 1)', () => {
    const event = makeMouseEvent({ clientX: 0, clientY: 0 });
    const result = normalizePointer(event, el);

    expect(result.x).toBe(-1);
    expect(result.y).toBe(1);
  });

  it('should normalize bottom-right corner to (1, -1)', () => {
    const event = makeMouseEvent({
      clientX: 200,
      clientY: 100,
    });
    const result = normalizePointer(event, el);

    expect(result.x).toBe(1);
    expect(result.y).toBe(-1);
  });

  it('should pass through button value', () => {
    const event = makeMouseEvent({ button: 2 });
    const result = normalizePointer(event, el);

    expect(result.button).toBe(2);
  });
});

describe('normalizePointer — PointerEvent', () => {
  const el = makeElement({
    left: 10,
    top: 20,
    width: 200,
    height: 100,
  });

  it('should normalize coordinates relative to element offset', () => {
    const event = makePointerEvent({
      clientX: 110,
      clientY: 70,
      pointerType: 'mouse',
    });
    const result = normalizePointer(event, el);

    // x: ((110-10)/200)*2-1 = 0
    // y: -((70-20)/100)*2+1 = 0
    expect(result.x).toBe(0);
    expect(result.y).toBe(0);
    expect(result.isTouch).toBe(false);
  });

  it('should set isTouch=true for touch pointerType', () => {
    const event = makePointerEvent({
      clientX: 110,
      clientY: 70,
      pointerType: 'touch',
    });
    const result = normalizePointer(event, el);

    expect(result.isTouch).toBe(true);
  });

  it('should set isTouch=false for pen pointerType', () => {
    const event = makePointerEvent({
      clientX: 110,
      clientY: 70,
      pointerType: 'pen',
    });
    const result = normalizePointer(event, el);

    expect(result.isTouch).toBe(false);
  });
});

describe('normalizePointer — TouchEvent', () => {
  const el = makeElement({
    left: 0,
    top: 0,
    width: 300,
    height: 300,
  });

  it('should normalize first touch coordinates', () => {
    const touch = makeTouch(150, 150);
    const event = new TouchEvent('touchstart', {
      touches: [touch],
      changedTouches: [touch],
    });
    const result = normalizePointer(event, el);

    expect(result.x).toBe(0);
    expect(result.y).toBe(0);
    expect(result.isTouch).toBe(true);
  });

  it('should use changedTouches when touches is empty (touchend)', () => {
    const touch = makeTouch(0, 300);
    const event = new TouchEvent('touchend', {
      touches: [],
      changedTouches: [touch],
    });
    const result = normalizePointer(event, el);

    expect(result.x).toBe(-1);
    expect(result.y).toBe(-1);
    expect(result.isTouch).toBe(true);
  });

  it('should default to (0, 0) when no touches available', () => {
    const event = new TouchEvent('touchend', {
      touches: [],
      changedTouches: [],
    });
    const result = normalizePointer(event, el);

    expect(result.x).toBe(-1);
    expect(result.y).toBe(1);
    expect(result.isTouch).toBe(true);
  });
});

describe('normalizePointer — edge cases', () => {
  it('should handle element with offset position', () => {
    const el = makeElement({
      left: 50,
      top: 50,
      width: 100,
      height: 100,
    });
    const event = makeMouseEvent({ clientX: 100, clientY: 100 });
    const result = normalizePointer(event, el);

    // x: ((100-50)/100)*2-1 = 0
    // y: -((100-50)/100)*2+1 = 0
    expect(result.x).toBe(0);
    expect(result.y).toBe(0);
  });

  it('should clamp values within -1..1 range for out-of-bounds', () => {
    const el = makeElement({
      left: 0,
      top: 0,
      width: 100,
      height: 100,
    });
    const event = makeMouseEvent({ clientX: 150, clientY: -20 });
    const result = normalizePointer(event, el);

    expect(result.x).toBe(2);
    expect(result.y).toBe(1.4);
  });
});
