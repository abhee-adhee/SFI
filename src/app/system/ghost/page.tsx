'use client';
import { useState } from 'react';
import Navigation from '@/components/Navigation/Navigation';
import styles from '@/app/shared.module.css';

export default function SystemGhostPage() {
  const [selectedRoute, setSelectedRoute] = useState<'RouteA' | 'RouteB' | 'RouteC'>('RouteA');
  const [tokenInput, setTokenInput] = useState('');
  const [result, setResult] = useState<{ success: boolean; flag?: string; message?: string; error?: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleHandshake = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch('/api/v1/system/ghost', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          route: selectedRoute,
          handshake_token: tokenInput
        })
      });
      const data = await res.json();
      setResult(data);
    } catch (_err) {
      setResult({ success: false, error: 'Connection failure to GHOST verification engine.' });
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
            <h1 className={styles.title}>GHOST DEEP INVESTIGATION CONSOLE</h1>
            <p className={styles.subtitle}>FINAL REVELATION & CONVERGENCE ENGINE // BOSS-02</p>
          </div>
        </div>

        <div className={styles.grid}>
          <div className={styles.panel}>
            <h2>EVIDENCE CONVERGENCE ROUTES</h2>
            <p>
              GHOST is not an external attacker; it is an emergent organic sub-process that originated within Project ECHO in 2015 prior to AURELIA development.
            </p>
            <div style={{ marginTop: '1rem', fontFamily: 'monospace', fontSize: '0.9rem' }}>
              <p style={{ color: '#00ff66' }}>[Route A] OSINT + Forensics + Web:</p>
              <p style={{ color: '#888', marginLeft: '1rem' }}>Origin Year (2015) + Vector (ECHO-SUB-01) + Beacon (GHOST-BEACON-09)</p>
              
              <p style={{ color: '#00ff66', marginTop: '0.75rem' }}>[Route B] Crypto + RE + Forensics:</p>
              <p style={{ color: '#888', marginLeft: '1rem' }}>Prime Modulus + License (AURA-9921-ECHO-8842) + Beacon (GHOST-BEACON-09)</p>
              
              <p style={{ color: '#00ff66', marginTop: '0.75rem' }}>[Route C] Web + RE + Misc:</p>
              <p style={{ color: '#888', marginLeft: '1rem' }}>Stream Magic (NXS\x01) + Container (REC-GHOST-99) + License (AURA-9921-ECHO-8842)</p>
            </div>
            <p style={{ marginTop: '1rem', color: '#ffb703', fontFamily: 'monospace' }}>
              HANDSHAKE TOOL: /artifacts/challenges/bosses/BOSS-02/ghost_handshake
            </p>
          </div>

          <div className={styles.panel}>
            <h2>GHOST HANDSHAKE VERIFICATION</h2>
            <form onSubmit={handleHandshake} style={{ marginTop: '1rem' }}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontFamily: 'monospace' }}>
                  SELECT CONVERGENCE ROUTE:
                </label>
                <select
                  value={selectedRoute}
                  onChange={(e) => setSelectedRoute(e.target.value as 'RouteA' | 'RouteB' | 'RouteC')}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    backgroundColor: '#111',
                    border: '1px solid #333',
                    color: '#00ff66',
                    fontFamily: 'monospace'
                  }}
                >
                  <option value="RouteA">Route A (OSINT + Forensics + Web)</option>
                  <option value="RouteB">Route B (Crypto + RE + Forensics)</option>
                  <option value="RouteC">Route C (Web + RE + Misc)</option>
                </select>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontFamily: 'monospace' }}>
                  HANDSHAKE TOKEN (HEX):
                </label>
                <input
                  type="text"
                  value={tokenInput}
                  onChange={(e) => setTokenInput(e.target.value)}
                  placeholder="Enter generated route handshake token..."
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
                {loading ? 'VERIFYING...' : 'EXECUTE GHOST HANDSHAKE'}
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
                    <p style={{ color: '#00ff66' }}>[FINAL REVELATION] {result.message}</p>
                    <p style={{ color: '#ffb703', marginTop: '0.75rem', fontWeight: 'bold' }}>
                      FINAL CTF FLAG: {result.flag}
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
        <p className={styles.sysId}>SYS.ID: BOSS-02-GHOST-FINAL</p>
      </footer>
    </div>
  );
}
