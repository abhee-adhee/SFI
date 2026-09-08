import Navigation from '@/components/Navigation/Navigation';
import styles from '../shared.module.css';

export default function SecurityPage() {
  return (
    <div className={styles.page}>
      <Navigation />
      
      <main className={styles.main}>
        <div className={styles.header}>
          <h1 className={styles.title}>SECURITY CENTER</h1>
          <p className={styles.subtitle}>ZERO-TRUST ARCHITECTURE</p>
        </div>

        <div className={styles.content}>
          <h2 style={{ color: 'var(--color-pure-white)', marginBottom: '1rem' }}>VULNERABILITY DISCLOSURE</h2>
          <p style={{ marginBottom: '2rem' }}>
            NEXUS Dynamics is committed to ensuring the safety of our global cognitive grid. We enforce a strict Zero-Trust model across all internal and public-facing interfaces.
          </p>
          
          <h2 style={{ color: 'var(--color-pure-white)', marginBottom: '1rem' }}>RECENT ADVISORIES</h2>
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            <li style={{ marginBottom: '1rem', padding: '1rem', border: '1px solid var(--color-gray-dark)' }}>
              <div style={{ color: 'var(--color-acid-green)', fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>ADV-2025-01</div>
              <strong style={{ color: 'var(--color-white)' }}>Routing Deviation Incident</strong>
              <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>Minor anomaly detected in the Global Grid routing logic. Patched and isolated. No data compromise confirmed.</p>
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
}
