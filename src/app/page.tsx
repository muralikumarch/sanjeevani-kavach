import Link from 'next/link';
import { Camera, Calendar, Pill, ShieldAlert } from 'lucide-react';

export default function Dashboard() {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2rem', padding: '1rem 0' }}>
      
      <header className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <span className="badge badge-green" style={{ marginBottom: '0.5rem' }}>Active Profile</span>
            <h1>Aarav Kumar</h1>
            <p className="text-sub">Age: 14 Weeks • ID: Kavach-8492-X</p>
          </div>
        </div>
      </header>

      <section>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Agentic Interventions</h2>
        <div className="dashboard-grid">
          
          <Link href="/sync" className="glass-card" style={{ textDecoration: 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{ padding: '0.75rem', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '12px', color: '#3b82f6' }}>
                <Camera size={24} />
              </div>
              <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Scan Yellow Card</h3>
            </div>
            <p className="text-sub" style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>
              Extract handwritten data with Gemini Vision and sync with U-WIN.
            </p>
            <div className="badge badge-yellow">Needs Sync</div>
          </Link>

          <Link href="/timeline" className="glass-card" style={{ textDecoration: 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{ padding: '0.75rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '12px', color: 'var(--color-primary)' }}>
                <Calendar size={24} />
              </div>
              <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Smart Timeline</h3>
            </div>
            <p className="text-sub" style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>
              View the 3D proactive schedule calculated by the Protocol-Agent.
            </p>
            <div className="badge badge-red">1 Dose Overdue</div>
          </Link>

          <Link href="/medicine" className="glass-card" style={{ textDecoration: 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{ padding: '0.75rem', background: 'rgba(168, 85, 247, 0.1)', borderRadius: '12px', color: '#a855f7' }}>
                <Pill size={24} />
              </div>
              <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Drug-Dose Safety</h3>
            </div>
            <p className="text-sub" style={{ fontSize: '0.9rem' }}>
              Scan a medicine strip for localized audio dosage instructions.
            </p>
          </Link>

        </div>
      </section>

      <section className="glass-card" style={{ background: 'var(--card-bg)', borderLeft: '4px solid var(--color-yellow)' }}>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <ShieldAlert color="var(--color-yellow)" />
          <div>
            <h3 style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>ASHA Worker Alert</h3>
            <p className="text-sub" style={{ fontSize: '0.9rem' }}>Aarav missed the 14-week Pentavalent-3. Protocol-Agent suggests Catch-up dose ASAP.</p>
          </div>
        </div>
      </section>
      
    </div>
  )
}
