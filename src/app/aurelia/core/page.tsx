'use client';
import { useState } from 'react';
import Link from 'next/link';
import Navigation from '@/components/Navigation/Navigation';
import styles from './core.module.css';

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
        <div className={styles.classified}>
          <span>RESTRICTED // AUTHORIZED CORE ENGINEERING ACCESS ONLY</span>
          <span>INTEGRITY STATE: UNVERIFIED</span>
        </div>

        <div className={styles.headerRow}>
          <div>
            <h1 className={styles.title}>AURELIA CORE</h1>
            <p className={styles.subtitle}>DIAGNOSTIC STATE RECONSTRUCTION</p>
          </div>
          <span className={styles.statusChip}>◇ CORE LOCKED — RECONSTRUCTION REQUIRED</span>
        </div>

        <div className={styles.grid}>
          <div className={styles.panel}>
            <h2 className={styles.panelTitle}>CORE MODULE LINEAGE</h2>
            <p className={styles.para}>
              The active core substrate is a direct descendant of the legacy platform it superseded.
              Every AURELIA core revision inherits state semantics from the ECHO subsystem it was built
              on; the current substrate cannot be diagnosed in isolation from that lineage.
            </p>
            <div className={styles.lineage}>
              <div className={`${styles.lineageRow} ${styles.lineageCurrent}`}>
                <span className={styles.lineageId}>AURELIA-CORE-V4</span>
                <span className={styles.lineageNote}>active substrate</span>
              </div>
              <div className={styles.lineageRow}>
                <span className={styles.lineageId}>AURELIA-CORE-V3</span>
                <span className={styles.lineageNote}>superseded</span>
              </div>
              <div className={styles.lineageRow}>
                <span className={styles.lineageId}>AURELIA-CORE-V1 · V2</span>
                <span className={styles.lineageNote}>early integration</span>
              </div>
              <div className={styles.lineageRow}>
                <span className={styles.lineageId}>ECHO-AURELIA-BRIDGE</span>
                <span className={styles.lineageNote}>legacy handoff · deprecated</span>
              </div>
              <div className={styles.lineageRow}>
                <span className={styles.lineageId}>ECHO-CORE</span>
                <span className={styles.lineageNote}>origin substrate · legacy</span>
              </div>
            </div>
            <p className={styles.para}>
              Diagnostic state reconstruction is scoped to the core-integrity incident on record.
              Reconstruction is performed offline with the authorized core diagnostic utility issued
              with your investigation package; this console verifies the resulting state token only.
            </p>
          </div>

          <div className={styles.panel}>
            <h2 className={styles.panelTitle}>STATE TOKEN VERIFICATION</h2>
            <p className={styles.para}>
              Submit the reconstructed core state token to confirm the core&apos;s diagnostic state for
              the incident under review.
            </p>
            <form onSubmit={handleVerify}>
              <label className={styles.inputLabel} htmlFor="stateToken">
                RECONSTRUCTED STATE TOKEN · 32-BYTE SHA-256 HEX
              </label>
              <input
                id="stateToken"
                type="text"
                className={styles.input}
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
                placeholder="reconstructed hex token…"
                autoComplete="off"
                spellCheck={false}
                required
              />
              <button type="submit" className={styles.button} disabled={loading}>
                {loading ? 'VERIFYING…' : 'VERIFY CORE STATE'}
              </button>
            </form>

            {result && (
              <div className={result.success ? `${styles.resultBox} ${styles.resultOk}` : `${styles.resultBox} ${styles.resultFail}`}>
                {result.success ? (
                  <div>
                    <p className={styles.resultLabelOk}>[AUTHENTICATED] {result.message}</p>
                    <p className={styles.sig}>VERIFICATION SIGNATURE: {result.flag}</p>
                  </div>
                ) : (
                  <p className={styles.resultLabelFail}>[REJECTED] {result.error}</p>
                )}
              </div>
            )}
          </div>
        </div>

        <div className={styles.referral}>
          RESIDUAL DIAGNOSTIC NOTE — one sub-process signature observed within core state could not be
          reconciled to any known AURELIA or ECHO module. It exceeds core diagnostic scope and has been
          referred for{' '}
          <Link href="/system/ghost" className={styles.referralLink}>system-level anomaly investigation</Link>.
        </div>
      </main>

      <footer className={styles.footer}>
        <p>&copy; {new Date().getFullYear()} NEXUS DYNAMICS. ALL RIGHTS RESERVED.</p>
        <p className={styles.sysId}>SYS.ID: AU-CORE-DIAG</p>
      </footer>
    </div>
  );
}
