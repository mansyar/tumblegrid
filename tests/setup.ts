import '@testing-library/jest-dom/vitest';

// Polyfill ResizeObserver for jsdom (required by R3F Canvas)
class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

window.ResizeObserver = ResizeObserverMock;
