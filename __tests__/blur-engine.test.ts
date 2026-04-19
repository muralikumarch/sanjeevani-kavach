import { describe, it, expect, vi } from 'vitest';
import { blurPII } from '../src/infrastructure/pii/blur-engine';

describe('PII Blur Engine — Privacy Tests', () => {
  it('should return a File object after processing', async () => {
    const inputFile = new File(['fake-image-data'], 'yellowcard.jpg', { type: 'image/jpeg' });
    const result = await blurPII(inputFile);
    
    expect(result).toBeInstanceOf(File);
    expect(result.name).toBe('yellowcard.jpg');
  });

  it('should preserve original file during mock blur pass', async () => {
    const inputFile = new File(['test-data'], 'card.png', { type: 'image/png' });
    const result = await blurPII(inputFile);
    
    // In the prototype, the file is returned as-is after the simulated blur
    expect(result).toBe(inputFile);
  });

  it('should handle empty files gracefully', async () => {
    const emptyFile = new File([], 'empty.jpg', { type: 'image/jpeg' });
    const result = await blurPII(emptyFile);
    
    expect(result).toBeDefined();
    expect(result.size).toBe(0);
  });
});
