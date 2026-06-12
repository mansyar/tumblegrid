import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const cssPath = resolve(
  __dirname,
  '../../src/styles/mobile.css',
);
const cssContent = readFileSync(cssPath, 'utf-8');

describe('mobile.css', () => {
  it('defines a media query for mobile viewport (≤768px)', () => {
    expect(cssContent).toMatch(/@media\s*\(max-width:\s*768px\)/);
  });

  describe('inventory panel bottom drawer', () => {
    it('positions inventory panel at bottom of viewport', () => {
      expect(cssContent).toMatch(
        /\.inventory-panel[^{]*\{[^}]*bottom:\s*0/,
      );
    });

    it('makes inventory panel horizontal', () => {
      expect(cssContent).toMatch(
        /\.inventory-panel[^{]*\{[^}]*flex-direction:\s*row/,
      );
    });

    it('enables horizontal scrolling', () => {
      expect(cssContent).toMatch(
        /\.inventory-panel[^{]*\{[^}]*overflow-x:\s*auto/,
      );
    });

    it('hides scrollbar for clean appearance', () => {
      expect(cssContent).toMatch(/scrollbar-width:\s*none/);
    });
  });

  describe('compact inventory items', () => {
    it('hides piece type labels on mobile', () => {
      expect(cssContent).toMatch(
        /\.inventory-item-label[^{]*\{[^}]*display:\s*none/,
      );
    });

    it('makes inventory items compact (column layout)', () => {
      expect(cssContent).toMatch(
        /\.inventory-item[^{]*\{[^}]*flex-direction:\s*column/,
      );
    });
  });

  describe('safe area handling', () => {
    it('applies safe area padding to bottom of inventory', () => {
      expect(cssContent).toMatch(/env\(safe-area-inset-bottom/);
    });
  });

  describe('UI element repositioning', () => {
    it('repositions rotate button above inventory on mobile', () => {
      expect(cssContent).toMatch(
        /\.rotate-button[^{]*\{[^}]*bottom:\s*100px/,
      );
    });

    it('repositions mode toggle above inventory on mobile', () => {
      expect(cssContent).toMatch(
        /\.mode-toggle[^{]*\{[^}]*bottom:\s*100px/,
      );
    });
  });
});
