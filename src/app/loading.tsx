import { GlassCard } from '@/presentation/components/ui/GlassCard';

/**
 * Loading state component displayed during page transitions.
 * Uses a skeleton pulse animation for a polished user experience.
 */
export default function Loading() {
  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
        padding: '1rem 0',
      }}
      role="status"
      aria-label="Loading page content"
    >
      <div
        style={{
          height: '40px',
          width: '200px',
          background: 'var(--glass-bg)',
          borderRadius: '12px',
          animation: 'pulse 1.5s ease-in-out infinite',
        }}
      />
      <GlassCard
        style={{
          height: '200px',
          animation: 'pulse 1.5s ease-in-out infinite',
          opacity: 0.6,
        }}
      >
        <span className="sr-only">Loading...</span>
      </GlassCard>
      <GlassCard
        style={{
          height: '150px',
          animation: 'pulse 1.5s ease-in-out infinite',
          animationDelay: '0.2s',
          opacity: 0.4,
        }}
      >
        <span className="sr-only">Loading...</span>
      </GlassCard>
    </div>
  );
}
