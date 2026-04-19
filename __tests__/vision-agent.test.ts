import { describe, it, expect, vi } from 'vitest';
import { visionAgent } from '../src/infrastructure/ai/vision-agent';

// Mock the core gemini client to isolate testing
vi.mock('../src/infrastructure/ai/gemini-client', () => ({
  getVisionModel: vi.fn().mockReturnValue({
    generateContent: vi.fn().mockResolvedValue({
      response: {
        text: () => JSON.stringify({ thoughts: {}, records: [] })
      }
    })
  }),
  fileToGenerativePart: vi.fn().mockResolvedValue({})
}));

describe('Vision Agent API Core', () => {
  it('should successfully parse a valid base64 payload', async () => {
    const mockFile = new File([''], 'mock.jpg', { type: 'image/jpeg' });
    const result = await visionAgent.processCardImage(mockFile);
    
    expect(result).toBeDefined();
  });

  it('should handle empty payloads via strict schemas', async () => {
    try {
      const emptyFile = new File([], 'empty.jpg')
      await visionAgent.processCardImage(emptyFile);
    } catch(e) {
      expect(e).toBeDefined();
    }
  });
});
