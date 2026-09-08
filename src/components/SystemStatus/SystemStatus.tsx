import React from 'react';
import styles from './SystemStatus.module.css';

export type StatusLevel = 'OPERATIONAL' | 'DEGRADED' | 'COMPROMISED' | 'RESTRICTED' | 'UNKNOWN';

interface SystemStatusProps {
  status?: StatusLevel;
  systemName?: string;
}

export default function SystemStatus({ status = 'OPERATIONAL', systemName = 'AURELIA CORE' }: SystemStatusProps) {
  
  const getStatusColorClass = () => {
    switch (status) {
      case 'OPERATIONAL': return styles.operational;
      case 'DEGRADED': return styles.degraded;
      case 'COMPROMISED': return styles.compromised;
      default: return styles.operational;
    }
  };

  return (
    <div className={`${styles.container} ${getStatusColorClass()}`}>
      <div className={styles.header}>
        <span className={styles.label}>SYSTEM STATUS</span>
        <span className={styles.value}>{status}</span>
      </div>
      
      <div className={styles.metrics}>
        <div className={styles.metric}>
          <span className={styles.metricLabel}>SYSTEM</span>
          <span className={styles.metricValue}>{systemName}</span>
        </div>
        <div className={styles.metric}>
          <span className={styles.metricLabel}>NETWORK</span>
          <span className={styles.metricValue}>{status === 'COMPROMISED' ? 'UNSTABLE' : 'NOMINAL'}</span>
        </div>
        <div className={styles.metric}>
          <span className={styles.metricLabel}>MEMORY</span>
          <span className={styles.metricValue}>{status === 'OPERATIONAL' ? 'NOMINAL' : 'ANOMALY DETECTED'}</span>
        </div>
      </div>

      {status === 'COMPROMISED' && (
        <div className={styles.alert}>
          UNKNOWN PROCESS DETECTED: <span>GHOST</span>
        </div>
      )}
    </div>
  );
}
