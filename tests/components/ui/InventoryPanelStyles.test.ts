import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const cssPath = resolve(
  __dirname,
  '../../../src/components/ui/InventoryPanel.css',
);
const cssContent = readFileSync(cssPath, 'utf-8');

describe('InventoryPanel styles', () => {
  it('defines a layout for the panel container', () => {
    expect(cssContent).toMatch(/\.inventory-panel\b/);
  });

  it('defines styles for individual inventory items', () => {
    expect(cssContent).toMatch(/\.inventory-item\b/);
  });

  describe('active state', () => {
    it('provides distinct visual style for active item', () => {
      // CSS uses single quotes for attribute selectors
      expect(cssContent).toMatch(/\[data-active='true'\]/);
    });

    it('active item has a highlighted border or background', () => {
      expect(cssContent).toMatch(
        /\[data-active='true'\][^{]*\{(?:[^}]*(?:border|background|outline|box-shadow)[^}]*)\}/,
      );
    });
  });

  describe('disabled state', () => {
    it('provides greyed-out appearance for disabled item', () => {
      expect(cssContent).toMatch(/\[data-disabled='true'\]/);
    });

    it('disabled item has reduced opacity or grey color', () => {
      expect(cssContent).toMatch(
        /\[data-disabled='true'\][^{]*\{(?:[^}]*(?:opacity|color|cursor)[^}]*)\}/,
      );
    });

    it('disabled item cursor is not-allowed', () => {
      expect(cssContent).toMatch(
        /\.inventory-item:disabled[^{]*\{(?:[^}]*(?:cursor|opacity)[^}]*)\}/,
      );
    });
  });

  describe('hover state', () => {
    it('defines hover styles for non-disabled items', () => {
      expect(cssContent).toMatch(/:hover/);
    });

    it('hover state changes background or brightness', () => {
      expect(cssContent).toMatch(
        /:hover[^{]*\{(?:[^}]*(?:background|opacity|filter|brightness|transform)[^}]*)\}/,
      );
    });
  });

  describe('touch targets', () => {
    it('ensures minimum 44px touch target height', () => {
      expect(cssContent).toMatch(/min-height:\s*44px/);
    });
  });
});
