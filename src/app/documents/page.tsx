import Navigation from '@/components/Navigation/Navigation';
import styles from '../shared.module.css';
import documents from '@/data/documents.json';
import Link from 'next/link';

export default function DocumentsPage() {
  return (
    <div className={styles.page}>
      <Navigation />
      
      <main className={styles.main}>
        <div className={styles.header}>
          <h1 className={styles.title}>PUBLIC ARCHIVE</h1>
          <p className={styles.subtitle}>DOCUMENTATION & PUBLICATIONS</p>
        </div>

        <div className={styles.grid}>
          {documents.filter(d => d.classification === 'PUBLIC').map((doc) => (
            <Link href={`/documents/${doc.id}`} key={doc.id} className={styles.card}>
              <div className={styles.cardMeta}>{doc.id} {"//"} {doc.date}</div>
              <h3 className={styles.cardTitle}>{doc.title}</h3>
              <div style={{ color: 'var(--color-acid-green)', fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>
                CLASSIFICATION: {doc.classification}
              </div>
            </Link>
          ))}
        </div>
      </main>

      <footer className={styles.footer}>
        <p>&copy; {new Date().getFullYear()} NEXUS DYNAMICS. ALL RIGHTS RESERVED.</p>
        <p>SYS.ID: ND-DOC-PUB</p>
      </footer>
    </div>
  );
}
