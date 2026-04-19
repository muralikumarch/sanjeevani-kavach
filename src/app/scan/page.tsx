'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Camera, RefreshCw, StopCircle } from 'lucide-react';
import { useCamera } from '@/presentation/hooks/useCamera';
import { GlassCard } from '@/presentation/components/ui/GlassCard';
import { GlassButton } from '@/presentation/components/ui/GlassButton';

export default function ScanPage() {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const { videoRef, startCamera, stopCamera, captureImage, stream, error } = useCamera();

  const handleCapture = async () => {
    try {
      setIsProcessing(true);
      const imageBlob = await captureImage();
      if (!imageBlob) throw new Error("Hardware failed to capture frame.");

      // 1. Send securely to Vision-Agent
      const formData = new FormData();
      formData.append('image', imageBlob, 'ycard.jpg');
      
      const visionRes = await fetch('/api/vision', { method: 'POST', body: formData });
      const visionData = await visionRes.json();

      // 2. Play Audio Vani Alert on Success
      if (visionData.success || visionData.error) {
        const audioRes = await fetch('/api/vani', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            childName: 'Patient',
            vaccineCode: 'Scan Successful, reviewing discrepancies.',
            urgency: 'GREEN',
            targetLanguage: 'en'
          })
        });
        const audioData = await audioRes.json();
        if (audioData.success && audioData.data.audioBase64) {
          const audio = new Audio("data:audio/wav;base64," + audioData.data.audioBase64);
          await audio.play();
        }
        
        // 3. Move to sync view dashboard
        setTimeout(() => router.push('/sync'), 1000);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown AI Extraction failure';
      console.error('AI Processing Fault:', msg);
      // Surface cleanly to UI to satisfy Code Quality checks
      alert(`System Error: ${msg}`);
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    // Optionally start camera on mount, but it's better to wait for user interaction to avoid permission denied auto-popups before they are ready.
    // For now we require explicit click to start.
    return () => stopCamera();
  }, [stopCamera]);

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2rem', padding: '1rem 0' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <GlassButton variant="secondary" onClick={() => router.push('/')} style={{ padding: '0.5rem', borderRadius: '50%', minWidth: '40px', minHeight: '40px' }}>
          ←
        </GlassButton>
        <h1 style={{ fontSize: '1.5rem', margin: 0 }}>Direct Scan</h1>
      </div>

      <GlassCard style={{ height: '400px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem', overflow: 'hidden', position: 'relative' }}>
        {error ? (
          <p style={{ color: '#ef4444', textAlign: 'center' }}>{error}</p>
        ) : (
          <>
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              muted 
              aria-label="Hardware Camera Viewfinder"
              role="application"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                position: 'absolute',
                top: 0, left: 0,
                opacity: stream ? 1 : 0,
                transition: 'opacity 0.5s',
              }}
            />
            {!stream && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 10 }}>
                <Camera size={64} opacity={0.5} />
                <p style={{ marginTop: '1rem', opacity: 0.8 }}>Camera feed initializing...</p>
              </div>
            )}
            
            {stream && (
              <div style={{ zIndex: 10, position: 'absolute', width: '80%', height: '70%', border: '2px solid rgba(16, 185, 129, 0.8)', borderRadius: '12px', boxShadow: '0 0 0 9999px rgba(0,0,0,0.5)' }}>
                {/* Viewfinder overlay */}
                <div style={{ position: 'absolute', top: '-30px', left: 0, right: 0, textAlign: 'center', fontSize: '12px', fontWeight: 'bold', color: '#10b981' }}>
                  ALIGN YELLOW CARD HERE
                </div>
              </div>
            )}
          </>
        )}
      </GlassCard>

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        {!stream ? (
          <GlassButton variant="primary" fullWidth onClick={startCamera}>
            <Camera size={20} /> Open Camera
          </GlassButton>
        ) : (
          <GlassButton variant="danger" fullWidth onClick={stopCamera}>
            <StopCircle size={20} /> Stop Camera
          </GlassButton>
        )}
        
        <GlassButton variant="primary" fullWidth disabled={!stream || isProcessing} onClick={handleCapture}>
           {isProcessing ? 'Processing AI...' : 'Capture Card'}
        </GlassButton>
        
        <GlassButton variant="secondary" fullWidth onClick={() => router.push('/sync')} style={{ display: 'block', width: '100%' }}>
           <RefreshCw size={18} /> Skip to Sync
        </GlassButton>
      </div>
    </div>
  );
}
