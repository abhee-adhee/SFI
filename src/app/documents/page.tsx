import Navigation from '@/components/Navigation/Navigation';
import Footer from '@/components/Footer/Footer';
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

        <div style={{ marginTop: '3rem', paddingTop: '1.5rem', borderTop: '1px solid var(--color-gray-dark)' }}>
          <p style={{ color: 'var(--color-gray-light)', fontSize: '0.875rem', marginBottom: '1rem', maxWidth: '760px' }}>
            Only declassified, publicly releasable records are listed above. Older material is held in the
            legacy archive system, which is periodically taken offline for maintenance.
          </p>
          <Link href="/archive" className={styles.restrictedLink}>
            <span className={styles.restrictedLock}>◈</span> Legacy Archive (pre-2024) · OFFLINE
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
