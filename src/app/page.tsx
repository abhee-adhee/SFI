import Navigation from '@/components/Navigation/Navigation';
import Footer from '@/components/Footer/Footer';
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
          <Link href="/research" className={styles.gridItem}>
            <h3>RESEARCH</h3>
            <p>Pioneering computational cognitive architectures.</p>
          </Link>
          <Link href="/aurelia" className={styles.gridItem}>
            <h3>SYSTEMS</h3>
            <p>Intelligent infrastructure for global operations.</p>
          </Link>
          <Link href="/security" className={styles.gridItem}>
            <h3>SECURITY</h3>
            <p>Next-generation zero-trust AI environments.</p>
          </Link>
          <Link href="/careers" className={styles.gridItem}>
            <h3>CAREERS</h3>
            <p>Build the future of autonomous intelligence.</p>
          </Link>
          <Link href="/developers" className={styles.gridItem}>
            <h3>DEVELOPERS</h3>
            <p>Public platform APIs and integration reference.</p>
          </Link>
          <Link href="/status" className={styles.gridItem}>
            <h3>STATUS</h3>
            <p>Real-time platform health and incident history.</p>
          </Link>
        </section>
      </main>

      <Footer />
    </div>
  );
}
