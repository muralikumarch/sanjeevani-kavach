'use client';

import { useLanguage } from '../../../app/providers/LanguageProvider';

export function TopNav() {
  const { language, cycleLanguage } = useLanguage();

  return (
    <nav style={{ padding: '1rem 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>
          +
        </div>
        <span style={{ fontWeight: '700', fontSize: '1.2rem', color: 'var(--foreground)' }}>Kavach</span>
      </div>
      <button 
        className="glass-button secondary" 
        style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
        onClick={cycleLanguage}
      >
        A/क ({language.toUpperCase()})
      </button>
    </nav>
  );
}
