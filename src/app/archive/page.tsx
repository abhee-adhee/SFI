import Navigation from '@/components/Navigation/Navigation';
import Footer from '@/components/Footer/Footer';
import Link from 'next/link';
import styles from '../shared.module.css';

export default function ArchivePage() {
  return (
    <div className={styles.page}>
      <Navigation />

      <main className={styles.main}>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '8rem' }}>
          <div style={{ color: 'var(--color-pure-white)', textAlign: 'center', maxWidth: '520px' }}>
            <h1 style={{ color: 'var(--color-gray)', fontSize: '4rem', marginBottom: '1rem' }}>OFFLINE</h1>
            <h2>ARCHIVE LOCKED</h2>
            <p style={{ color: 'var(--color-gray-light)', marginTop: '1rem' }}>
              The legacy archive system is currently under maintenance. Records prior to 2024 are inaccessible.
            </p>
            <p style={{ marginTop: '2rem' }}>
              <Link href="/documents" className={styles.link}>&larr; Return to Public Archive</Link>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
