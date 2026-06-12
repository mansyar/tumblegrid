/**
 * Unified pointer input normalization for mouse, touch, and pen events.
 *
 * Converts any pointer/touch/mouse event into a normalized format
 * with coordinates in the range [-1, 1] (matching R3F convention).
 */

export interface NormalizedPointer {
  /** Normalized X coordinate: -1 (left) to 1 (right) */
  x: number;
  /** Normalized Y coordinate: 1 (top) to -1 (bottom) */
  y: number;
  /** Button identifier: 0=left, 1=middle, 2=right, -1=touch/no-button */
  button: number;
  /** Whether this event originated from a touch input */
  isTouch: boolean;
}

/**
 * Normalize a pointer/touch/mouse event to a unified format.
 *
 * @param event - The input event (MouseEvent, TouchEvent, or PointerEvent)
 * @param element - The target element for coordinate normalization
 * @returns Normalized pointer data with coordinates in [-1, 1] range
 */
export function normalizePointer(
  event: MouseEvent | TouchEvent | PointerEvent,
  element: HTMLElement,
): NormalizedPointer {
  let clientX: number;
  let clientY: number;
  let button: number;
  let isTouch = false;

  if ('touches' in event) {
    // TouchEvent
    isTouch = true;
    const touches =
      event.touches.length > 0 ? event.touches : event.changedTouches;
    if (touches.length > 0) {
      clientX = touches[0].clientX;
      clientY = touches[0].clientY;
    } else {
      clientX = 0;
      clientY = 0;
    }
    button = -1;
  } else if ('pointerType' in event) {
    // PointerEvent
    isTouch = event.pointerType === 'touch';
    clientX = event.clientX;
    clientY = event.clientY;
    button = event.button;
  } else {
    // MouseEvent
    clientX = event.clientX;
    clientY = event.clientY;
    button = event.button;
  }

  const rect = element.getBoundingClientRect();
  const x = rect.width > 0 ? ((clientX - rect.left) / rect.width) * 2 - 1 : 0;
  const y = rect.height > 0 ? -((clientY - rect.top) / rect.height) * 2 + 1 : 0;

  return { x, y, button, isTouch };
}
