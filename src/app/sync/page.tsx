'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Camera, CheckCircle, AlertTriangle } from 'lucide-react';
import { GlassCard } from '@/presentation/components/ui/GlassCard';
import { GlassButton } from '@/presentation/components/ui/GlassButton';
import { StatusBadge } from '@/presentation/components/ui/StatusBadge';

export default function SyncPage() {
  const router = useRouter();
  const [isApproved, setIsApproved] = useState(false);

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2rem', padding: '1rem 0' }}>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <GlassButton variant="secondary" onClick={() => router.push('/')} style={{ padding: '0.5rem', borderRadius: '50%', minWidth: '40px', minHeight: '40px' }}>
          ←
        </GlassButton>
        <h1 style={{ fontSize: '1.5rem', margin: 0 }}>Sync Immunization Card</h1>
      </div>

      <GlassCard style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '3rem 1rem', border: '2px dashed rgba(255, 255, 255, 0.2)', cursor: 'pointer' }}>
        <div style={{ background: 'rgba(59, 130, 246, 0.2)', padding: '1.5rem', borderRadius: '50%', color: '#60a5fa', marginBottom: '1rem' }}>
          <Camera size={48} />
        </div>
        <h2 style={{ fontSize: '1.25rem', textAlign: 'center', margin: '0.5rem 0' }}>Capture Yellow Card</h2>
        <p style={{ textAlign: 'center', maxWidth: '300px', opacity: 0.8, fontSize: '0.9rem' }}>
          Align the handwritten card within the frame. The Vision-Agent will automatically blur any PII before cloud processing.
        </p>
        <GlassButton variant="primary" onClick={() => router.push('/scan')} style={{ marginTop: '1.5rem' }}>
          <Camera size={18} /> Open Camera
        </GlassButton>
      </GlassCard>

      <section>
        <h3 style={{ marginBottom: '1rem' }}>Verification Sandbox (Mock U-WIN)</h3>
        
        <GlassCard>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertTriangle color="#fbbf24" size={20} />
              <h4 style={{ margin: 0 }}>Discrepancy Detected</h4>
            </div>
            {!isApproved ? (
               <StatusBadge status="YELLOW" label="Pending Review" />
            ) : (
               <StatusBadge status="GREEN" label="Approved & Synced" />
            )}
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '12px' }}>
            <div>
              <p style={{ fontSize: '0.8rem', marginBottom: '0.25rem', opacity: 0.7 }}>Vision-Agent Extracted</p>
              <p style={{ fontWeight: '600' }}>PENTA-3 : 15/04/2026</p>
            </div>
            <div>
              <p style={{ fontSize: '0.8rem', marginBottom: '0.25rem', opacity: 0.7 }}>U-WIN Database</p>
              <p style={{ fontWeight: '600', color: !isApproved ? '#f87171' : '#34d399' }}>
                {!isApproved ? 'Missing Entry' : 'Entry Synced'}
              </p>
            </div>
          </div>
          
          <p style={{ fontSize: '0.85rem', marginTop: '1rem', opacity: 0.8 }}>
            ASHA Worker Verification Request generated. Audio nudge sent via Vani-Agent.
          </p>
          
          {!isApproved && (
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
              <GlassButton variant="primary" fullWidth onClick={() => setIsApproved(true)}>
                <CheckCircle size={18} /> Approve Vision Data
              </GlassButton>
            </div>
          )}
        </GlassCard>
      </section>

    </div>
  );
}
