'use client';
import Navigation from '@/components/Navigation/Navigation';
import SystemStatus from '@/components/SystemStatus/SystemStatus';
import AnomalyGlitch from '@/components/AnomalyGlitch/AnomalyGlitch';
import Terminal from '@/components/Terminal/Terminal';
import { useNarrative } from '@/context/NarrativeContext';
import styles from './aurelia.module.css';

export default function AureliaPage() {
  const { systemState } = useNarrative();

  return (
    <div className={styles.page}>
      <Navigation />
      
      <main className={styles.main}>
        <div className={styles.headerRow}>
          <div>
            <h1 className={styles.title}>AURELIA CORE</h1>
            <p className={styles.subtitle}>AUTONOMOUS INTELLIGENCE PLATFORM</p>
          </div>
          <AnomalyGlitch active={systemState === 'COMPROMISED'} intensity="medium">
            <SystemStatus status={systemState} systemName="AURELIA CORE" />
          </AnomalyGlitch>
        </div>

        <div className={styles.grid}>
          <div className={styles.panel}>
            <h2>PLATFORM OVERVIEW</h2>
            <p>
              AURELIA represents the pinnacle of autonomous cognitive research at NEXUS Dynamics. 
              Designed to optimize global infrastructure and process unparalleled datasets in real-time.
            </p>
            <p>
              Current deployment spans 42 regional data centers with dynamic resource allocation and 
              self-healing capabilities.
            </p>
          </div>
          
          <div className={styles.panel}>
            <h2>INVESTIGATION TERMINAL</h2>
            <AnomalyGlitch active={systemState === 'DEGRADED'} intensity="low">
              <Terminal initialPath={systemState === 'COMPROMISED' ? 'ghost@aurelia:~#' : 'admin@aurelia:~#'} />
            </AnomalyGlitch>
          </div>
        </div>
      </main>

      <footer className={styles.footer}>
        <p>&copy; {new Date().getFullYear()} NEXUS DYNAMICS. ALL RIGHTS RESERVED.</p>
        <p className={styles.sysId}>SYS.ID: AU-CORE-9</p>
      </footer>
    </div>
  );
}
