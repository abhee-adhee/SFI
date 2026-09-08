import Navigation from '@/components/Navigation/Navigation';
import styles from './page.module.css';
import Link from 'next/link';

export default function Home() {
  return (
    <div className={styles.page}>
      <Navigation />
      
      <main className={styles.main}>
        <div className={styles.hero}>
          <h1 className={styles.headline}>ADVANCING INTELLIGENCE.</h1>
          <h1 className={styles.headline}>ENGINEERING AUTONOMY.</h1>
          
          <div className={styles.description}>
            <p>NEXUS Dynamics is a highly advanced technology company specializing in artificial intelligence, autonomous systems, computational research, and intelligent infrastructure.</p>
          </div>
        </div>

        <section className={styles.productSection}>
          <div className={styles.productCard}>
            <div className={styles.productMeta}>FLAGSHIP AI PLATFORM</div>
            <h2 className={styles.productTitle}>AURELIA</h2>
            <p className={styles.productDesc}>Autonomous Intelligence Platform designed for enterprise-scale computational modeling and infrastructure management.</p>
            <Link href="/aurelia" className={styles.actionBtn}>
              [ EXPLORE AURELIA ]
            </Link>
          </div>
        </section>

        <section className={styles.gridSection}>
          <div className={styles.gridItem}>
            <h3>RESEARCH</h3>
            <p>Pioneering computational cognitive architectures.</p>
          </div>
          <div className={styles.gridItem}>
            <h3>SYSTEMS</h3>
            <p>Intelligent infrastructure for global operations.</p>
          </div>
          <div className={styles.gridItem}>
            <h3>SECURITY</h3>
            <p>Next-generation zero-trust AI environments.</p>
          </div>
          <div className={styles.gridItem}>
            <h3>CAREERS</h3>
            <p>Build the future of autonomous intelligence.</p>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <p>&copy; {new Date().getFullYear()} NEXUS DYNAMICS. ALL RIGHTS RESERVED.</p>
        <p className={styles.sysId}>SYS.ID: ND-001</p>
      </footer>
    </div>
  );
}
