'use client';
import Navigation from '@/components/Navigation/Navigation';
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
      </main>
    </div>
  );
}
