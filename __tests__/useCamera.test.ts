import { renderHook, act } from '@testing-library/react';
import { useCamera } from '../src/presentation/hooks/useCamera';
import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('useCamera custom Hook lifecycle', () => {
  beforeEach(() => {
    // Safely inject mock navigator boundaries for vitest DOM simulating
    Object.defineProperty(global.navigator, 'mediaDevices', {
      value: {
        getUserMedia: vi.fn(),
      },
      writable: true,
    });
  });

  it('should initialize exactly with empty stream state matrices', () => {
    const { result } = renderHook(() => useCamera());
    expect(result.current.stream).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it('should handle camera access permissions sequentially', async () => {
    const mockStream = { getTracks: () => [{ stop: vi.fn() }] };
    (global.navigator.mediaDevices.getUserMedia as any).mockResolvedValue(mockStream);
    
    const { result } = renderHook(() => useCamera());
    
    // Test the async trigger
    await act(async () => {
      await result.current.startCamera();
    });
    
    expect(result.current.stream).toBe(mockStream);
    expect(result.current.error).toBeNull();
  });
});
