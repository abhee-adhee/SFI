import Navigation from '@/components/Navigation/Navigation';
import styles from '../shared.module.css';
import projects from '@/data/projects.json';

export default function ResearchPage() {
  return (
    <div className={styles.page}>
      <Navigation />
      
      <main className={styles.main}>
        <div className={styles.header}>
          <h1 className={styles.title}>RESEARCH DIVISION</h1>
          <p className={styles.subtitle}>ADVANCED COGNITIVE MODELING</p>
        </div>

        <div className={styles.grid}>
          {projects.map((proj) => (
            <div key={proj.id} className={styles.card}>
              <div className={styles.cardMeta}>{proj.id} {"//"} {proj.status}</div>
              <h3 className={styles.cardTitle}>{proj.name}</h3>
              <div style={{ color: 'var(--color-acid-green)', fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>
                LEAD: {proj.leadId}
              </div>
            </div>
          ))}
        </div>
      </main>

      <footer className={styles.footer}>
        <p>&copy; {new Date().getFullYear()} NEXUS DYNAMICS. ALL RIGHTS RESERVED.</p>
        <p>SYS.ID: ND-RES-DIV</p>
      </footer>
    </div>
  );
}
