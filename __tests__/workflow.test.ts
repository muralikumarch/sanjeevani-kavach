import { describe, it, expect, vi } from 'vitest';
import { generateUrgencyVoiceNudgeUseCase } from '../src/core/usecases/generate-voice-nudge';

describe('Voice Nudge Use Case — End-to-End Workflow', () => {
  const mockVaniAgent = {
    generateAudioNudge: vi.fn().mockResolvedValue('base64-audio-data'),
  };

  it('should generate RED urgency alert with correct messaging', async () => {
    const result = await generateUrgencyVoiceNudgeUseCase(
      'Aarav',
      'PENTA-3',
      'RED',
      'hi',
      mockVaniAgent
    );

    expect(result).toBe('base64-audio-data');
    expect(mockVaniAgent.generateAudioNudge).toHaveBeenCalledWith(
      expect.stringContaining('missed'),
      'en',
      'hi'
    );
  });

  it('should generate YELLOW urgency alert with scheduling message', async () => {
    mockVaniAgent.generateAudioNudge.mockClear();
    
    await generateUrgencyVoiceNudgeUseCase(
      'Priya',
      'MR-1',
      'YELLOW',
      'ta',
      mockVaniAgent
    );

    expect(mockVaniAgent.generateAudioNudge).toHaveBeenCalledWith(
      expect.stringContaining('due for'),
      'en',
      'ta'
    );
  });

  it('should generate GREEN urgency alert with positive message', async () => {
    mockVaniAgent.generateAudioNudge.mockClear();
    
    await generateUrgencyVoiceNudgeUseCase(
      'Rohan',
      'OPV-1',
      'GREEN',
      'en',
      mockVaniAgent
    );

    expect(mockVaniAgent.generateAudioNudge).toHaveBeenCalledWith(
      expect.stringContaining('on track'),
      'en',
      'en'
    );
  });

  it('should propagate errors from the Vani-Agent', async () => {
    const failingAgent = {
      generateAudioNudge: vi.fn().mockRejectedValue(new Error('TTS API unavailable')),
    };

    await expect(
      generateUrgencyVoiceNudgeUseCase('Aarav', 'PENTA-1', 'RED', 'hi', failingAgent)
    ).rejects.toThrow('TTS API unavailable');
  });
});
