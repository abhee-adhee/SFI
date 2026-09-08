import Navigation from '@/components/Navigation/Navigation';
import styles from '../shared.module.css';

export default function ArchivePage() {
  return (
    <div className={styles.page}>
      <Navigation />
      
      <main className={styles.main}>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10rem' }}>
          <div style={{ color: 'var(--color-pure-white)', textAlign: 'center' }}>
            <h1 style={{ color: 'var(--color-gray)', fontSize: '4rem', marginBottom: '1rem' }}>OFFLINE</h1>
            <h2>ARCHIVE LOCKED</h2>
            <p style={{ color: 'var(--color-gray-light)', marginTop: '1rem' }}>
              The legacy archive system is currently under maintenance. Records prior to 2024 are inaccessible.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
