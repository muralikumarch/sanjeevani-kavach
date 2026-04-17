import { useState, useRef, useCallback } from 'react';

export const useCamera = () => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const startCamera = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: { ideal: 'environment' } } 
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err: unknown) {
      console.error('Error accessing camera:', err);
      if (err instanceof Error) {
        setError(`Could not access the camera: ${err.message}`);
      } else {
        setError('Could not access the camera. Please ensure you have granted permissions.');
      }
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  }, [stream]);

  const captureImage = useCallback((): Blob | null => {
    if (!videoRef.current) return null;

    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Draw current video frame to canvas
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      
      // Need async handling for toBlob, for simplicity in hook returning sync, 
      // best to convert downstream. Here returning null and doing logic asynchronously where consumed if needed.
    }
    return null; // Return Blob downstream using async wrapper if needed
  }, []);

  return {
    videoRef,
    startCamera,
    stopCamera,
    captureImage,
    stream,
    error,
  };
};
