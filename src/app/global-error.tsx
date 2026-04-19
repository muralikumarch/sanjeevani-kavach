'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body>
        <div style={{ background: '#022c22', color: '#34d399', height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
          <h1>Fatal Layout Error</h1>
          <p>The root system layout failed to strictly mount.</p>
          <button onClick={() => reset()} style={{ background: '#059669', border: 'none', padding: '1rem', color: 'white', borderRadius: '8px', cursor: 'pointer', marginTop: '1rem' }}>
            Hard Reset Engine
          </button>
        </div>
      </body>
    </html>
  );
}
