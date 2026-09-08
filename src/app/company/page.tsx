import Navigation from '@/components/Navigation/Navigation';
import styles from '../shared.module.css';
import timeline from '@/data/timeline.json';
import Link from 'next/link';

export default function CompanyPage() {
  return (
    <div className={styles.page}>
      <Navigation />
      
      <main className={styles.main}>
        <div className={styles.header}>
          <h1 className={styles.title}>COMPANY OVERVIEW</h1>
          <p className={styles.subtitle}>HISTORY & LEADERSHIP</p>
        </div>

        <div className={styles.content}>
          <p>
            Founded in 2015, NEXUS Dynamics was established to push the boundaries of computational intelligence and autonomous infrastructure.
          </p>
          <p style={{ marginTop: '1rem', color: 'var(--color-gray-light)', fontSize: '0.875rem' }}>
            Our early research, including the 2016 Foundational AI Grant, has been declassified and is available in the <Link href="/documents" style={{ color: 'var(--color-acid-green)' }}>Public Archive</Link>.
          </p>
          
          <h2 style={{ marginTop: '2rem', marginBottom: '1rem', color: 'var(--color-pure-white)' }}>TIMELINE</h2>
          <div style={{ borderLeft: '2px solid var(--color-gray-dark)', paddingLeft: '1rem' }}>
            {timeline.map((event) => (
              <div key={event.id} style={{ marginBottom: '1.5rem' }}>
                <div style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-acid-green)', fontSize: '0.875rem' }}>
                  {event.year} {"//"} {event.type}
                </div>
                <div style={{ color: 'var(--color-pure-white)' }}>
                  {event.event}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <footer className={styles.footer}>
        <p>&copy; {new Date().getFullYear()} NEXUS DYNAMICS. ALL RIGHTS RESERVED.</p>
        <p>SYS.ID: ND-CMP-01</p>
      </footer>
    </div>
  );
}
