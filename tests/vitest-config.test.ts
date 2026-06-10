import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const projectRoot = resolve(__dirname, '..');

describe('Vitest Configuration', () => {
  it('should have a vitest.config.ts file', () => {
    const configPath = resolve(projectRoot, 'vitest.config.ts');
    const content = readFileSync(configPath, 'utf-8');
    expect(content).toBeDefined();
  });

  it('should be valid TypeScript', async () => {
    const configPath = resolve(projectRoot, 'vitest.config.ts');
    const config = await import(configPath);
    expect(config.default).toBeDefined();
    expect(typeof config.default).toBe('object');
  });

  it('should enable globals', async () => {
    const configPath = resolve(projectRoot, 'vitest.config.ts');
    const config = await import(configPath);
    expect(config.default.test).toBeDefined();
    expect(config.default.test.globals).toBe(true);
  });

  it('should include test files pattern', async () => {
    const configPath = resolve(projectRoot, 'vitest.config.ts');
    const config = await import(configPath);
    expect(config.default.test.include).toBeDefined();
    expect(Array.isArray(config.default.test.include)).toBe(true);
    expect(config.default.test.include.length).toBeGreaterThan(0);
  });
});
