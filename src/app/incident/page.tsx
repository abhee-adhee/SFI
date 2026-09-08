import Navigation from '@/components/Navigation/Navigation';
import styles from '../shared.module.css';

export default function IncidentPage() {
  return (
    <div className={styles.page}>
      <Navigation />
      
      <main className={styles.main}>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10rem' }}>
          <div style={{ color: 'var(--color-pure-white)', textAlign: 'center' }}>
            <h1 style={{ color: 'var(--color-purple)', fontSize: '4rem', marginBottom: '1rem' }}>403</h1>
            <h2>INCIDENT RESPONSE PORTAL</h2>
            <p style={{ color: 'var(--color-gray-light)', marginTop: '1rem' }}>
              DEPT-SEC Clearance Required.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
