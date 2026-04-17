'use client';

import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { GlassCard } from '@/presentation/components/ui/GlassCard';
import { GlassButton } from '@/presentation/components/ui/GlassButton';
import { StatusBadge } from '@/presentation/components/ui/StatusBadge';

// Dynamically import the 3D canvas so we don't break SSR
const Timeline3D = dynamic(() => import('../../presentation/components/timeline/Timeline3D'), {
  ssr: false,
  loading: () => <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.05)', borderRadius: '16px' }}>Loading 3D Engine...</div>
})

export default function TimelinePage() {
  const router = useRouter();
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2rem', padding: '1rem 0' }}>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <GlassButton variant="secondary" onClick={() => router.push('/')} style={{ padding: '0.5rem', borderRadius: '50%', minWidth: '40px', minHeight: '40px' }}>
          ←
        </GlassButton>
        <h1 style={{ fontSize: '1.5rem', margin: 0 }}>Smart Timeline</h1>
      </div>

      <GlassCard style={{ padding: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', alignItems: 'flex-start' }}>
           <div>
             <h2 style={{ fontSize: '1.1rem', margin: '0 0 0.25rem 0' }}>Protocol-Agent Trajectory</h2>
             <p style={{ fontSize: '0.85rem', margin: 0, opacity: 0.7 }}>Calculated using MoHFW NIS 2026 Rules</p>
           </div>
           <StatusBadge status="RED" label="Catch-up Active" />
        </div>
        
        {/* Render the 3D Fiber component here */}
        <div style={{ height: '300px', width: '100%', borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(255, 255, 255, 0.2)', background: 'radial-gradient(circle at center, rgba(16, 185, 129, 0.1) 0%, transparent 70%)' }}>
           <Timeline3D />
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
            <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#34d399', display: 'inline-block', boxShadow: '0 0 8px #34d399' }}></span> On-track
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
             <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#fbbf24', display: 'inline-block', boxShadow: '0 0 8px #fbbf24' }}></span> Due (&lt; 14 days)
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
             <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#f87171', display: 'inline-block', boxShadow: '0 0 8px #f87171' }}></span> Critical / Missed
          </div>
        </div>
      </GlassCard>

      <section>
        <h3 style={{ marginBottom: '1rem' }}>Catch-up Schedule</h3>
        
        <GlassCard style={{ borderLeft: '4px solid #f87171', marginBottom: '1rem' }}>
           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
             <h4 style={{ margin: 0 }}>Pentavalent-3</h4>
             <span style={{ color: '#f87171', fontWeight: '600', fontSize: '0.9rem' }}>Missed</span>
           </div>
           <p style={{ fontSize: '0.85rem', marginTop: '0.5rem', opacity: 0.8 }}>Originally due on 15/04/2026. Schedule immediately to maintain immunity sequence.</p>
        </GlassCard>

        <GlassCard style={{ borderLeft: '4px solid #34d399' }}>
           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
             <h4 style={{ margin: 0 }}>Measles & Rubella (MR-1)</h4>
             <span style={{ color: '#34d399', fontWeight: '600', fontSize: '0.9rem' }}>Oct 2026</span>
           </div>
           <p style={{ fontSize: '0.85rem', marginTop: '0.5rem', opacity: 0.8 }}>Due between 9-12 Months.</p>
        </GlassCard>
      </section>

    </div>
  );
}
