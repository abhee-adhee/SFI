import Navigation from '@/components/Navigation/Navigation';
import Footer from '@/components/Footer/Footer';
import styles from '../../shared.module.css';
import advisories from '@/data/advisories.json';
import Link from 'next/link';

export default function AdvisoriesPage() {
  return (
    <div className={styles.page}>
      <Navigation />
      
      <main className={styles.main}>
        <div className={styles.header}>
          <h1 className={styles.title}>SECURITY ADVISORIES</h1>
          <p className={styles.subtitle}>PUBLIC INCIDENT & VULNERABILITY DISCLOSURES</p>
        </div>

        <div className={styles.grid}>
          {advisories.map((adv) => (
            <Link href={`/advisories/${adv.id}`} key={adv.id} className={styles.card}>
              <div className={styles.cardMeta}>{adv.id} {"//"} {adv.date}</div>
              <h3 className={styles.cardTitle}>{adv.title}</h3>
              <div style={{ color: adv.severity === 'CRITICAL' ? 'var(--color-critical-red)' : 'var(--color-acid-green)', fontSize: '0.875rem' }}>
                SEVERITY: {adv.severity}
              </div>
            </Link>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
