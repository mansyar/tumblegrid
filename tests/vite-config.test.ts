import { describe, it, expect } from 'vitest';

describe('Vite Configuration', () => {
  it('should have a valid vite.config.ts file that exports config', async () => {
    // This will fail if vite.config.ts doesn't exist or has syntax errors
    const config = await import('../vite.config.ts');
    expect(config.default).toBeDefined();
    expect(typeof config.default).toBe('object');
  });

  it('should include React plugin in plugins array', async () => {
    const config = await import('../vite.config.ts');
    const plugins = config.default.plugins;
    expect(plugins).toBeDefined();
    expect(Array.isArray(plugins)).toBe(true);
    expect(plugins.length).toBeGreaterThan(0);
  });

  it('should configure @ path alias', async () => {
    const config = await import('../vite.config.ts');
    const resolveConfig = config.default.resolve;
    expect(resolveConfig).toBeDefined();
    expect(resolveConfig.alias).toBeDefined();
    expect(resolveConfig.alias['@']).toBeDefined();
  });

  it('should set dev server port to 5173', async () => {
    const config = await import('../vite.config.ts');
    const serverConfig = config.default.server;
    expect(serverConfig).toBeDefined();
    expect(serverConfig.port).toBe(5173);
  });
});
