import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const projectRoot = resolve(__dirname, '..');

describe('Environment and Git Configuration', () => {
  it('should have a .env.example file', () => {
    const envPath = resolve(projectRoot, '.env.example');
    expect(existsSync(envPath)).toBe(true);
  });

  it('should have placeholder environment variables in .env.example', () => {
    const envPath = resolve(projectRoot, '.env.example');
    const content = readFileSync(envPath, 'utf-8');
    expect(content).toContain('=');
    expect(content.length).toBeGreaterThan(0);
  });

  it('should have a .gitignore file', () => {
    const gitignorePath = resolve(projectRoot, '.gitignore');
    expect(existsSync(gitignorePath)).toBe(true);
  });

  it('should ignore node_modules in .gitignore', () => {
    const gitignorePath = resolve(projectRoot, '.gitignore');
    const content = readFileSync(gitignorePath, 'utf-8');
    expect(content).toContain('node_modules');
  });

  it('should ignore dist in .gitignore', () => {
    const gitignorePath = resolve(projectRoot, '.gitignore');
    const content = readFileSync(gitignorePath, 'utf-8');
    expect(content).toContain('dist');
  });

  it('should ignore .env files in .gitignore', () => {
    const gitignorePath = resolve(projectRoot, '.gitignore');
    const content = readFileSync(gitignorePath, 'utf-8');
    expect(content).toContain('.env');
  });

  it('should ignore coverage in .gitignore', () => {
    const gitignorePath = resolve(projectRoot, '.gitignore');
    const content = readFileSync(gitignorePath, 'utf-8');
    expect(content).toContain('coverage');
  });
});
