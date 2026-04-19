'use client';

import { useRouter } from 'next/navigation';
import { Pill, Scan, Volume2, Camera } from 'lucide-react';
import { useState } from 'react';
import { useLanguage } from '../providers/LanguageProvider';
import { GlassCard } from '@/presentation/components/ui/GlassCard';
import { GlassButton } from '@/presentation/components/ui/GlassButton';

export default function MedicinePage() {
  const router = useRouter();
  const { language } = useLanguage();
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayAudio = async () => {
    setIsPlaying(true);
    try {
      const res = await fetch('/api/vani', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          childName: 'Aarav',
          vaccineCode: 'Paracetamol',
          urgency: 'YELLOW',
          targetLanguage: language
        })
      });
      const data = await res.json();
      if (data.success && data.data.audioBase64) {
        const audio = new Audio("data:audio/wav;base64," + data.data.audioBase64);
        audio.play();
        console.info(`Playing audio nudge in ${language}...`);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Audio playback failed';
      console.error('Vani playback error:', message);
    }
    setTimeout(() => setIsPlaying(false), 2000);
  };
  
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2rem', padding: '1rem 0' }}>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <GlassButton variant="secondary" onClick={() => router.push('/')} style={{ padding: '0.5rem', borderRadius: '50%', minWidth: '40px', minHeight: '40px' }}>
          ←
        </GlassButton>
        <h1 style={{ fontSize: '1.5rem', margin: 0 }}>Drug-Dose Safety</h1>
      </div>

      <GlassCard style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '3rem 1rem', border: '2px dashed rgba(168, 85, 247, 0.4)', cursor: 'pointer', background: 'linear-gradient(180deg, rgba(168, 85, 247, 0.05) 0%, transparent 100%)' }}>
        <div style={{ background: 'rgba(168, 85, 247, 0.2)', padding: '1.5rem', borderRadius: '16px', color: '#c084fc', marginBottom: '1rem' }}>
          <Scan size={48} />
        </div>
        <h2 style={{ fontSize: '1.25rem', textAlign: 'center', margin: '0.5rem 0' }}>Scan Medicine Strip</h2>
        <p style={{ textAlign: 'center', maxWidth: '300px', opacity: 0.8, fontSize: '0.9rem' }}>
          Gemini Vision will identify the drug and calculate age/weight appropriate dosage with audio instructions.
        </p>
        
        <GlassButton variant="primary" fullWidth onClick={() => router.push('/scan')} style={{ marginTop: '1.5rem', background: 'linear-gradient(135deg, rgba(147, 51, 234, 0.6), rgba(168, 85, 247, 0.8))' }}>
          <Camera size={18} /> Open Scanner
        </GlassButton>
      </GlassCard>

      <section>
        <h3 style={{ marginBottom: '1rem' }}>Recent Scan Results</h3>
        
        <GlassCard style={{ borderLeft: '4px solid #a855f7' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ background: 'rgba(147, 51, 234, 0.2)', padding: '0.5rem', borderRadius: '8px' }}>
                <Pill color="#c084fc" size={20} />
              </div>
              <div>
                <h4 style={{ margin: 0 }}>Paracetamol Syrup (Crocin 120)</h4>
                <p style={{ fontSize: '0.8rem', opacity: 0.7 }}>Identified via Gemini Multimodal</p>
              </div>
            </div>
          </div>
          
          <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '1rem', borderRadius: '12px', marginBottom: '1rem' }}>
            <p style={{ fontWeight: '600', marginBottom: '0.25rem', opacity: 0.9 }}>Calculated Dosage for Aarav (14 Weeks, 5.5kg):</p>
            <p style={{ color: '#c084fc', fontSize: '1.2rem', fontWeight: '700' }}>1.5 ml every 6 hours</p>
            <p style={{ fontSize: '0.85rem', marginTop: '0.25rem', opacity: 0.8 }}>Do not exceed 4 doses in 24 hours.</p>
          </div>

          <GlassButton 
            variant="secondary" 
            fullWidth
            onClick={handlePlayAudio}
            disabled={isPlaying}
          >
            <Volume2 size={18} /> {isPlaying ? 'Playing...' : `Play Audio Nudge (${language.toUpperCase()})`}
          </GlassButton>
        </GlassCard>
      </section>

    </div>
  );
}
