import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const projectRoot = resolve(__dirname, '..');

describe('Biome Configuration', () => {
  it('should have a biome.json file', () => {
    const configPath = resolve(projectRoot, 'biome.json');
    const content = readFileSync(configPath, 'utf-8');
    expect(content).toBeDefined();
  });

  it('should be valid JSON', () => {
    const configPath = resolve(projectRoot, 'biome.json');
    const content = readFileSync(configPath, 'utf-8');
    expect(() => JSON.parse(content)).not.toThrow();
  });

  it('should configure TypeScript and React settings', () => {
    const configPath = resolve(projectRoot, 'biome.json');
    const content = JSON.parse(readFileSync(configPath, 'utf-8'));
    expect(content.javascript).toBeDefined();
    expect(content.javascript.parserUnsafeParameterDecoratorsEnabled).toBeDefined();
  });

  it('should configure formatter with space indent style and width 2', () => {
    const configPath = resolve(projectRoot, 'biome.json');
    const content = JSON.parse(readFileSync(configPath, 'utf-8'));
    expect(content.formatter).toBeDefined();
    expect(content.formatter.indentStyle).toBe('space');
    expect(content.formatter.indentWidth).toBe(2);
  });

  it('should configure linter with recommended rules', () => {
    const configPath = resolve(projectRoot, 'biome.json');
    const content = JSON.parse(readFileSync(configPath, 'utf-8'));
    expect(content.linter).toBeDefined();
    expect(content.linter.enabled).toBe(true);
    expect(content.linter.rules).toBeDefined();
    expect(content.linter.rules.recommended).toBeDefined();
  });

  it('should include src and tests directories', () => {
    const configPath = resolve(projectRoot, 'biome.json');
    const content = JSON.parse(readFileSync(configPath, 'utf-8'));
    expect(content.files).toBeDefined();
    expect(content.files.include).toBeDefined();
    expect(content.files.include).toContain('src/**');
    expect(content.files.include).toContain('tests/**');
  });

  it('should exclude node_modules and dist directories', () => {
    const configPath = resolve(projectRoot, 'biome.json');
    const content = JSON.parse(readFileSync(configPath, 'utf-8'));
    expect(content.files.exclude).toBeDefined();
    expect(content.files.exclude).toContain('node_modules');
    expect(content.files.exclude).toContain('dist');
  });
});
