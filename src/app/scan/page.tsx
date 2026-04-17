'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { Camera, RefreshCw, StopCircle } from 'lucide-react';
import { useCamera } from '@/presentation/hooks/useCamera';
import { GlassCard } from '@/presentation/components/ui/GlassCard';
import { GlassButton } from '@/presentation/components/ui/GlassButton';

export default function ScanPage() {
  const { videoRef, startCamera, stopCamera, captureImage, stream, error } = useCamera();

  useEffect(() => {
    // Optionally start camera on mount, but it's better to wait for user interaction to avoid permission denied auto-popups before they are ready.
    // For now we require explicit click to start.
    return () => stopCamera();
  }, [stopCamera]);

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2rem', padding: '1rem 0' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <GlassButton variant="secondary" style={{ padding: '0.5rem', borderRadius: '50%', minWidth: '40px', minHeight: '40px' }}>
            ←
          </GlassButton>
        </Link>
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
        
        <GlassButton variant="primary" fullWidth disabled={!stream} onClick={() => captureImage()}>
           Capture Card
        </GlassButton>
        
        <Link href="/sync" style={{ flex: 1, textDecoration: 'none', display: 'block', width: '100%' }}>
          <GlassButton variant="secondary" fullWidth>
             <RefreshCw size={18} /> Skip to Sync
          </GlassButton>
        </Link>
      </div>
    </div>
  );
}
