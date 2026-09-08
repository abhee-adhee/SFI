import React from 'react';
import styles from './LogViewer.module.css';

export interface LogEntry {
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR' | 'CRITICAL';
  process: string;
  message: string;
}

interface LogViewerProps {
  logs: LogEntry[];
  title?: string;
}

export default function LogViewer({ logs, title = 'SYSTEM LOGS' }: LogViewerProps) {
  return (
    <div className={styles.container}>
      <div className={styles.header}>{title}</div>
      <div className={styles.logBody}>
        {logs.map((log, idx) => (
          <div key={idx} className={`${styles.logRow} ${styles[log.level.toLowerCase()]}`}>
            <span className={styles.timestamp}>[{log.timestamp}]</span>
            <span className={styles.level}>{log.level}</span>
            <span className={styles.process}>[{log.process}]</span>
            <span className={styles.message}>{log.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
