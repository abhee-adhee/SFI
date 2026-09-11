import Navigation from '@/components/Navigation/Navigation';
import Footer from '@/components/Footer/Footer';
import Link from 'next/link';
import styles from '../shared.module.css';

export default function NetworkPage() {
  return (
    <div className={styles.page}>
      <Navigation />

      <main className={styles.main}>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '8rem' }}>
          <div style={{ color: 'var(--color-pure-white)', textAlign: 'center', maxWidth: '520px' }}>
            <h1 style={{ color: 'var(--color-purple)', fontSize: '4rem', marginBottom: '1rem' }}>403</h1>
            <h2>GLOBAL GRID DIAGNOSTICS RESTRICTED</h2>
            <p style={{ color: 'var(--color-gray-light)', marginTop: '1rem' }}>
              Access to real-time grid telemetry requires DEPT-SYS authorization. Public health summaries remain available on the status dashboard.
            </p>
            <p style={{ marginTop: '2rem' }}>
              <Link href="/status" className={styles.link}>&larr; Return to System Status</Link>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
