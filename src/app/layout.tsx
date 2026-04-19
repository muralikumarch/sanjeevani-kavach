import './globals.css';
import type { Metadata, Viewport } from 'next';
import { LanguageProvider } from './providers/LanguageProvider';
import { AuthProvider } from './providers/AuthProvider';
import { AgentProvider } from './providers/AgentProvider';
import { OfflineProvider } from './providers/OfflineProvider';
import { TopNav } from '../presentation/components/layout/TopNav';

export const metadata: Metadata = {
  title: 'Sanjeevani-Kavach — Agentic Health Companion',
  description: 'Offline-first, multi-agent PWA for India\'s Universal Immunization Programme. Built with Gemini 2.5, Google Cloud Translation, TTS, Firebase, and Cloud Run for PromptWars India 2026.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Kavach',
  },
  keywords: ['immunization', 'ASHA worker', 'PWA', 'offline-first', 'Gemini', 'Google Cloud', 'healthcare', 'DPI'],
  authors: [{ name: 'Team Sanjeevani-Kavach' }],
}

export const viewport: Viewport = {
  themeColor: '#10b981',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <a href="#main-content" className="skip-nav">
          Skip to main content
        </a>
        <AuthProvider>
          <AgentProvider>
            <OfflineProvider>
              <LanguageProvider>
                <div className="bg-blob" aria-hidden="true"></div>
                <div className="bg-blob-2" aria-hidden="true"></div>
                <main id="main-content" className="container" role="main">
                  <TopNav />
                  {children}
                </main>
                <div aria-live="polite" aria-atomic="true" className="sr-only" id="announcer"></div>
              </LanguageProvider>
            </OfflineProvider>
          </AgentProvider>
        </AuthProvider>
      </body>
    </html>
  )
}

