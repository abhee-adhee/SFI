import Navigation from '@/components/Navigation/Navigation';
import Footer from '@/components/Footer/Footer';
import styles from '../shared.module.css';
import projects from '@/data/projects.json';
import Link from 'next/link';

export default function ResearchPage() {
  return (
    <div className={styles.page}>
      <Navigation />

      <main className={styles.main}>
        <div className={styles.header}>
          <h1 className={styles.title}>RESEARCH DIVISION</h1>
          <p className={styles.subtitle}>ADVANCED COGNITIVE MODELING</p>
          <p className={styles.subtitle} style={{ marginTop: '0.75rem' }}>
            <Link href="/research/publications" className={styles.link}>VIEW PUBLISHED RESEARCH &rarr;</Link>
          </p>
        </div>

        <div className={styles.grid}>
          {projects.map((proj) => (
            <Link href={`/projects/${proj.id}`} key={proj.id} className={styles.card}>
              <div className={styles.cardMeta}>{proj.id} {"//"} {proj.status}</div>
              <h3 className={styles.cardTitle}>{proj.name}</h3>
              <div style={{ color: 'var(--color-acid-green)', fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>
                LEAD: {proj.leadId}
              </div>
            </Link>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
