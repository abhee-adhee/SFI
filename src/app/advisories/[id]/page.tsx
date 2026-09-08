import Navigation from '@/components/Navigation/Navigation';
import styles from '../../shared.module.css';
import advisories from '@/data/advisories.json';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export function generateStaticParams() {
  return advisories.map((adv) => ({
    id: adv.id,
  }));
}

export default function AdvisoryDetail({ params }: { params: { id: string } }) {
  const adv = advisories.find((a) => a.id === params.id);

  if (!adv) {
    notFound();
  }

  return (
    <div className={styles.page}>
      <Navigation />
      
      <main className={styles.main}>
        <div className={styles.header}>
          <h1 className={styles.title}>{adv.title}</h1>
          <div className={styles.subtitle}>
            DATE: {adv.date} | AUTHOR: <Link href={`/employees/${adv.authorId}`} className={styles.link}>{adv.authorId}</Link>
          </div>
        </div>

        <div className={styles.content}>
          <div style={{ padding: '1rem', border: '1px solid var(--color-gray-dark)', backgroundColor: 'var(--color-bg-darker)' }}>
            <h3 style={{ color: adv.severity === 'CRITICAL' ? 'var(--color-critical-red)' : 'var(--color-acid-green)', marginBottom: '0.5rem' }}>
              SEVERITY: {adv.severity}
            </h3>
            <p style={{ color: 'var(--color-pure-white)' }}>{adv.description}</p>
          </div>
        </div>
      </main>

      <footer className={styles.footer}>
        <p>&copy; {new Date().getFullYear()} NEXUS DYNAMICS. ALL RIGHTS RESERVED.</p>
        <p>SYS.ID: ND-ADV-DETAIL</p>
      </footer>
    </div>
  );
}
