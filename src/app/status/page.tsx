'use client';
import Navigation from '@/components/Navigation/Navigation';
import Footer from '@/components/Footer/Footer';
import Link from 'next/link';
import styles from '../shared.module.css';
import SystemStatus from '@/components/SystemStatus/SystemStatus';
import AnomalyGlitch from '@/components/AnomalyGlitch/AnomalyGlitch';
import { useNarrative } from '@/context/NarrativeContext';
import systems from '@/data/systems.json';
import incidents from '@/data/incidents.json';

export default function StatusPage() {
  const { systemState } = useNarrative();

  return (
    <div className={styles.page}>
      <Navigation />
      
      <main className={styles.main}>
        <div className={styles.header}>
          <h1 className={styles.title}>GLOBAL SYSTEM STATUS</h1>
          <p className={styles.subtitle}>REAL-TIME METRICS</p>
        </div>

        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', marginBottom: '4rem' }}>
          {systems.map(sys => (
            <div key={sys.id} style={{ flex: '1', minWidth: '300px' }}>
              <AnomalyGlitch active={sys.id === 'SYS-AURELIA' && systemState !== 'OPERATIONAL'} intensity="low">
                <SystemStatus 
                  systemName={sys.name} 
                  status={sys.id === 'SYS-AURELIA' ? systemState : sys.status as "OPERATIONAL" | "DEGRADED" | "COMPROMISED" | "RESTRICTED" | "UNKNOWN"} 
                />
              </AnomalyGlitch>
            </div>
          ))}
        </div>

        <div>
          <h2 style={{ color: 'var(--color-pure-white)', marginBottom: '1rem' }}>INCIDENT LOG</h2>
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            {incidents.map(inc => (
              <li key={inc.id} style={{ marginBottom: '1rem', padding: '1rem', border: '1px solid var(--color-gray-dark)', backgroundColor: 'var(--color-black)' }}>
                <div style={{ color: 'var(--color-gray)', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', display: 'flex', justifyContent: 'space-between' }}>
                  <span>{inc.id}</span>
                  <span>DATE: {inc.date}</span>
                </div>
                <strong style={{ color: 'var(--color-white)', display: 'block', marginTop: '0.5rem' }}>SYSTEM: {inc.systemId}</strong>
                <p style={{ fontSize: '0.875rem', marginTop: '0.5rem', color: 'var(--color-gray-light)' }}>{inc.description}</p>
              </li>
            ))}
          </ul>
        </div>

        <div style={{ marginTop: '4rem', paddingTop: '2rem', borderTop: '1px solid var(--color-gray-dark)' }}>
          <h2 style={{ color: 'var(--color-pure-white)', marginBottom: '1rem' }}>STATUS API</h2>
          <p style={{ color: 'var(--color-gray-light)', fontSize: '0.9375rem', maxWidth: '760px', lineHeight: 1.7 }}>
            This dashboard is rendered from the public status service. Integrators can poll the same
            endpoint directly for machine-readable health data. Each response carries an{' '}
            <code style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-acid-green)' }}>X-Diagnostic-Mode</code>{' '}
            header describing the current reporting level.
          </p>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', marginTop: '1rem' }}>
            <span style={{ color: 'var(--color-acid-green)', marginRight: '0.75rem' }}>GET</span>
            <a href="/api/v1/status" style={{ color: 'var(--color-white)', borderBottom: '1px dashed var(--color-gray)' }}>
              /api/v1/status
            </a>
          </p>
          <p style={{ marginTop: '1rem', fontSize: '0.875rem' }}>
            <Link href="/developers#status" style={{ color: 'var(--color-gray-light)', borderBottom: '1px dashed var(--color-gray)' }}>
              View in API reference →
            </Link>
          </p>
        </div>

        <div style={{ marginTop: '4rem', paddingTop: '2rem', borderTop: '1px solid var(--color-gray-dark)' }}>
          <h2 style={{ color: 'var(--color-pure-white)', marginBottom: '0.75rem' }}>RESTRICTED DIAGNOSTICS</h2>
          <p style={{ color: 'var(--color-gray-light)', fontSize: '0.875rem', marginBottom: '1rem', maxWidth: '760px' }}>
            Deep telemetry and internal diagnostics are access-controlled. Operators with the appropriate
            division authorization can reach the internal consoles below.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <Link href="/network" className={styles.restrictedLink}>
              <span className={styles.restrictedLock}>◈</span> Global Grid Diagnostics · DEPT-SYS
            </Link>
            <Link href="/system" className={styles.restrictedLink}>
              <span className={styles.restrictedLock}>◈</span> Internal System Console · RESTRICTED
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
