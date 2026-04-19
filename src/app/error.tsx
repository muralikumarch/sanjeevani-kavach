'use client';
import { useEffect } from 'react';
import { GlassCard } from '@/presentation/components/ui/GlassCard';
import { GlassButton } from '@/presentation/components/ui/GlassButton';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('App Routing Boundary Error:', error);
  }, [error]);

  return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <GlassCard style={{ borderLeft: '4px solid #ef4444', maxWidth: '500px', width: '100%' }}>
        <h2 style={{ margin: '0 0 1rem 0', color: '#ef4444' }}>Runtime Integrity Fault</h2>
        <p style={{ opacity: 0.8, fontSize: '0.9rem' }}>An explicit rendering miscalculation was caught by the boundary.</p>
        <p style={{ fontSize: '0.8rem', background: 'rgba(239, 68, 68, 0.1)', padding: '0.5rem', borderRadius: '4px', fontFamily: 'monospace', wordBreak: 'break-all' }}>
          {error.message || 'Unknown routing failure.'}
        </p>
        <GlassButton variant="primary" onClick={() => reset()} style={{ marginTop: '1.5rem', width: '100%' }}>
          Acknowledge & Recover
        </GlassButton>
      </GlassCard>
    </div>
  );
}
