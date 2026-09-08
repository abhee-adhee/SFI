import Navigation from '@/components/Navigation/Navigation';
import styles from '../../shared.module.css';
import publications from '@/data/publications.json';
import Link from 'next/link';

export default function PublicationsPage() {
  return (
    <div className={styles.page}>
      <Navigation />
      
      <main className={styles.main}>
        <div className={styles.header}>
          <h1 className={styles.title}>PUBLICATIONS</h1>
          <p className={styles.subtitle}>RESEARCH & THEORETICAL MODELS</p>
        </div>

        <div className={styles.grid}>
          {publications.map((pub) => (
            <Link href={`/publications/${pub.id}`} key={pub.id} className={styles.card}>
              <div className={styles.cardMeta}>{pub.id} {"//"} {pub.date}</div>
              <h3 className={styles.cardTitle}>{pub.title}</h3>
              <div style={{ color: pub.status === 'RETRACTED' ? 'var(--color-critical-red)' : 'var(--color-gray-light)', fontSize: '0.875rem' }}>
                STATUS: {pub.status}
              </div>
            </Link>
          ))}
        </div>
      </main>

      <footer className={styles.footer}>
        <p>&copy; {new Date().getFullYear()} NEXUS DYNAMICS. ALL RIGHTS RESERVED.</p>
        <p>SYS.ID: ND-PUB-LIST</p>
      </footer>
    </div>
  );
}
