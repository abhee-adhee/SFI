'use client';
import { useState } from 'react';
import Navigation from '@/components/Navigation/Navigation';
import styles from '@/app/shared.module.css';

export default function AureliaCorePage() {
  const [tokenInput, setTokenInput] = useState('');
  const [result, setResult] = useState<{ success: boolean; flag?: string; message?: string; error?: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch('/api/v1/aurelia/core', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'verify', token: tokenInput })
      });
      const data = await res.json();
      setResult(data);
    } catch (_err) {
      setResult({ success: false, error: 'Connection failure to AURELIA Core diagnostic engine.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <Navigation />
      
      <main className={styles.main}>
        <div className={styles.headerRow}>
          <div>
            <h1 className={styles.title}>AURELIA RESTRICTED CORE</h1>
            <p className={styles.subtitle}>DIAGNOSTIC & STATE VERIFICATION CONSOLE // BOSS-01</p>
          </div>
        </div>

        <div className={styles.grid}>
          <div className={styles.panel}>
            <h2>DIAGNOSTIC OVERVIEW</h2>
            <p>
              Deepest accessible diagnostic subsystem for AURELIA core services.
            </p>
            <p style={{ fontFamily: 'monospace', color: '#ffb703' }}>
              COMPONENT: AURELIA-CORE-V4<br />
              INCIDENT TIMESTAMP: 2025-10-14T08:00:00Z<br />
              ARTIFACT: /artifacts/challenges/bosses/BOSS-01/core_diagnostic
            </p>
            <p>
              Reconstruct the 32-byte hex state token from the diagnostic binary using the incident timestamp and target core module ID.
            </p>
          </div>

          <div className={styles.panel}>
            <h2>STATE TOKEN VERIFICATION</h2>
            <form onSubmit={handleVerify} style={{ marginTop: '1rem' }}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontFamily: 'monospace' }}>
                  STATE TOKEN (32-BYTE SHA256 HEX):
                </label>
                <input
                  type="text"
                  value={tokenInput}
                  onChange={(e) => setTokenInput(e.target.value)}
                  placeholder="Enter calculated hex token..."
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    backgroundColor: '#111',
                    border: '1px solid #333',
                    color: '#00ff66',
                    fontFamily: 'monospace'
                  }}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#222',
                  border: '1px solid #00ff66',
                  color: '#00ff66',
                  cursor: 'pointer',
                  fontFamily: 'monospace'
                }}
              >
                {loading ? 'VERIFYING...' : 'VERIFY CORE STATE'}
              </button>
            </form>

            {result && (
              <div
                style={{
                  marginTop: '1.5rem',
                  padding: '1rem',
                  border: result.success ? '1px solid #00ff66' : '1px solid #ff4444',
                  backgroundColor: '#0a0a0a',
                  fontFamily: 'monospace'
                }}
              >
                {result.success ? (
                  <div>
                    <p style={{ color: '#00ff66' }}>[AUTHENTICATED] {result.message}</p>
                    <p style={{ color: '#ffb703', marginTop: '0.5rem', fontWeight: 'bold' }}>
                      FLAG: {result.flag}
                    </p>
                  </div>
                ) : (
                  <p style={{ color: '#ff4444' }}>[FAILED] {result.error}</p>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className={styles.footer}>
        <p>&copy; {new Date().getFullYear()} NEXUS DYNAMICS. ALL RIGHTS RESERVED.</p>
        <p className={styles.sysId}>SYS.ID: BOSS-01-AURELIA-CORE</p>
      </footer>
    </div>
  );
}
