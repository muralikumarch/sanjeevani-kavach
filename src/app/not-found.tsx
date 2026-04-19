'use client';

import Link from 'next/link';
import { GlassCard } from '@/presentation/components/ui/GlassCard';
import { GlassButton } from '@/presentation/components/ui/GlassButton';

/**
 * Custom 404 Not Found page.
 * Provides a clear, accessible error state with navigation back to the dashboard.
 */
export default function NotFound() {
  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
      }}
      role="alert"
      aria-label="Page not found"
    >
      <GlassCard style={{ maxWidth: '500px', width: '100%', textAlign: 'center' }}>
        <h1 style={{ fontSize: '3rem', margin: '0 0 0.5rem 0', opacity: 0.3 }}>404</h1>
        <h2 style={{ margin: '0 0 1rem 0' }}>Page Not Found</h2>
        <p style={{ opacity: 0.7, fontSize: '0.9rem', marginBottom: '1.5rem' }}>
          The requested route does not exist in the Sanjeevani-Kavach application.
        </p>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <GlassButton variant="primary" style={{ width: '100%' }}>
            Return to Dashboard
          </GlassButton>
        </Link>
      </GlassCard>
    </div>
  );
}
