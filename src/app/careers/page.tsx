import Navigation from '@/components/Navigation/Navigation';
import styles from '../shared.module.css';

export default function CareersPage() {
  return (
    <div className={styles.page}>
      <Navigation />
      
      <main className={styles.main}>
        <div className={styles.header}>
          <h1 className={styles.title}>CAREERS</h1>
          <p className={styles.subtitle}>BUILD THE FUTURE</p>
        </div>

        <div className={styles.content}>
          <p>
            We are looking for exceptional individuals to join the team working on the world&apos;s most advanced autonomous systems.
          </p>
          
          <div style={{ marginTop: '2rem' }}>
            <div style={{ padding: '1rem', border: '1px solid var(--color-gray-dark)', marginBottom: '1rem' }}>
              <h3 style={{ color: 'var(--color-pure-white)' }}>Cognitive Architect</h3>
              <p style={{ color: 'var(--color-gray)', fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>LOCATION: GLOBAL // DEPT-AI</p>
            </div>
            <div style={{ padding: '1rem', border: '1px solid var(--color-gray-dark)', marginBottom: '1rem' }}>
              <h3 style={{ color: 'var(--color-pure-white)' }}>Security Analyst</h3>
              <p style={{ color: 'var(--color-gray)', fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>LOCATION: REGION 4 // DEPT-SEC</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
