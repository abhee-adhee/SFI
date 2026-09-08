import React from 'react';
import styles from './DocumentViewer.module.css';

interface DocumentProps {
  title: string;
  id: string;
  content: string;
  classification?: string;
  date?: string;
}

export default function DocumentViewer({ 
  title, 
  id, 
  content, 
  classification = 'UNCLASSIFIED',
  date
}: DocumentProps) {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.meta}>
          <span className={styles.docId}>DOC ID: {id}</span>
          <span className={styles.date}>{date}</span>
        </div>
        <h2 className={styles.title}>{title}</h2>
        <div className={classification === 'RESTRICTED' ? styles.classRestricted : styles.classNormal}>
          CLASSIFICATION: {classification}
        </div>
      </div>
      <div className={styles.content}>
        {content}
      </div>
    </div>
  );
}
