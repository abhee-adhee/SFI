'use client';
import { useState } from 'react';
import Navigation from '@/components/Navigation/Navigation';
import styles from './ghost.module.css';

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
        <div className={styles.classified}>
          <span>SYSTEM ANOMALY // CONTAINMENT ACTIVE // ATTRIBUTION UNRESOLVED</span>
          <span>SIGNATURE: PERSISTENT</span>
        </div>

        <div className={styles.headerRow}>
          <div>
            <h1 className={styles.title}>GHOST</h1>
            <p className={styles.subtitle}>SYSTEM-LEVEL ANOMALY INVESTIGATION</p>
          </div>
          <span className={styles.statusChip}>● ACTIVE ANOMALY — UNATTRIBUTED</span>
        </div>

        <div className={styles.grid}>
          <div className={styles.panel}>
            <h2 className={styles.panelTitle}>ANOMALY BRIEF</h2>
            <p className={styles.para}>
              An anomalous sub-process — internally designated GHOST — persists within NEXUS system state
              and has resisted attribution. It cannot be traced to any single subsystem, deployment, or
              actor, and its origin remains unresolved.
            </p>
            <p className={styles.para}>
              Resolving the anomaly requires correlating independent evidence recovered across the
              investigation along a single convergence route. Correlation is computed offline with the
              authorized correlation utility issued with your investigation package; this console verifies
              the resulting convergence handshake only.
            </p>

            <div className={styles.route}>
              <div className={styles.routeName}>ROUTE A — PROVENANCE CORRELATION</div>
              <div className={styles.routeParams}>inputs: origin_year · echo_vector · ghost_beacon</div>
            </div>
            <div className={styles.route}>
              <div className={styles.routeName}>ROUTE B — CRYPTOGRAPHIC LINEAGE</div>
              <div className={styles.routeParams}>inputs: prime_modulus_p · lss_matrix · ghost_beacon</div>
            </div>
            <div className={styles.route}>
              <div className={styles.routeName}>ROUTE C — SIGNAL / CONTAINER CORRELATION</div>
              <div className={styles.routeParams}>inputs: stream_magic · nxc_classified · lss_matrix</div>
            </div>
          </div>

          <div className={styles.panel}>
            <h2 className={styles.panelTitle}>CONVERGENCE HANDSHAKE</h2>
            <p className={styles.para}>
              Select the route you correlated, then submit its convergence handshake to resolve the
              anomaly.
            </p>
            <form onSubmit={handleHandshake}>
              <label className={styles.inputLabel} htmlFor="routeSel">CONVERGENCE ROUTE</label>
              <select
                id="routeSel"
                className={styles.select}
                value={selectedRoute}
                onChange={(e) => setSelectedRoute(e.target.value as 'RouteA' | 'RouteB' | 'RouteC')}
              >
                <option value="RouteA">Route A — Provenance Correlation</option>
                <option value="RouteB">Route B — Cryptographic Lineage</option>
                <option value="RouteC">Route C — Signal / Container Correlation</option>
              </select>

              <label className={styles.inputLabel} htmlFor="handshake">CONVERGENCE HANDSHAKE · HEX</label>
              <input
                id="handshake"
                type="text"
                className={styles.input}
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
                placeholder="computed convergence handshake…"
                autoComplete="off"
                spellCheck={false}
                required
              />

              <button type="submit" className={styles.button} disabled={loading}>
                {loading ? 'CORRELATING…' : 'EXECUTE CONVERGENCE HANDSHAKE'}
              </button>
            </form>

            {result && (
              <div className={result.success ? `${styles.resultBox} ${styles.resultOk}` : `${styles.resultBox} ${styles.resultFail}`}>
                {result.success ? (
                  <div>
                    <p className={styles.resultLabelOk}>[ANOMALY RESOLVED] {result.message}</p>
                    <p className={styles.sig}>RESOLUTION SIGNATURE: {result.flag}</p>
                  </div>
                ) : (
                  <p className={styles.resultLabelFail}>[UNRESOLVED] {result.error}</p>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className={styles.footer}>
        <p>&copy; {new Date().getFullYear()} NEXUS DYNAMICS. ALL RIGHTS RESERVED.</p>
        <p className={styles.sysId}>SYS.ID: SYS-GHOST</p>
      </footer>
    </div>
  );
}
