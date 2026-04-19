import { describe, it, expect } from 'vitest';
import { validateEnv } from '../src/lib/env';

describe('Environment Configuration', () => {
  it('should return config object even when env vars are missing', () => {
    const config = validateEnv();
    expect(config).toBeDefined();
    expect(config).toHaveProperty('GEMINI_API_KEY');
    expect(config).toHaveProperty('NEXT_PUBLIC_FIREBASE_API_KEY');
    expect(config).toHaveProperty('NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN');
    expect(config).toHaveProperty('NEXT_PUBLIC_FIREBASE_PROJECT_ID');
  });

  it('should return string values for all config keys', () => {
    const config = validateEnv();
    Object.values(config).forEach((value) => {
      expect(typeof value).toBe('string');
    });
  });
});
