import Navigation from '@/components/Navigation/Navigation';
import styles from '../shared.module.css';

export default function SystemPage() {
  return (
    <div className={styles.page}>
      <Navigation />
      
      <main className={styles.main}>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10rem' }}>
          <div style={{ color: 'var(--color-pure-white)', textAlign: 'center' }}>
            <h1 style={{ color: 'var(--color-purple)', fontSize: '4rem', marginBottom: '1rem' }}>403</h1>
            <h2>INTERNAL SYSTEM ACCESS DENIED</h2>
            <p style={{ color: 'var(--color-gray-light)', marginTop: '1rem' }}>
              Your current session does not have clearance to view internal system diagnostics.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
