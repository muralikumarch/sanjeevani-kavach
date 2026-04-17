import './globals.css';
import type { Metadata, Viewport } from 'next';
import { LanguageProvider } from './providers/LanguageProvider';
import { AuthProvider } from './providers/AuthProvider';
import { AgentProvider } from './providers/AgentProvider';
import { OfflineProvider } from './providers/OfflineProvider';
import { TopNav } from '../presentation/components/layout/TopNav';

export const metadata: Metadata = {
  title: 'Sanjeevani-Kavach',
  description: 'Agentic Health Companion for India\'s Universal Immunization Programme.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Kavach',
  },
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
        <AuthProvider>
          <AgentProvider>
            <OfflineProvider>
              <LanguageProvider>
                <div className="bg-blob"></div>
                <div className="bg-blob-2"></div>
                <main className="container">
                  <TopNav />
                  {children}
                </main>
              </LanguageProvider>
            </OfflineProvider>
          </AgentProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
