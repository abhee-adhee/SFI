import Link from 'next/link';
import styles from './Footer.module.css';

/**
 * Global secondary navigation / site footer.
 * Provides the believable "corporate site" links that let an investigator
 * discover the deeper public surface (developer platform, system status, etc.)
 * without every route living in the primary navbar.
 */
export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.columns}>
        <div className={styles.col}>
          <span className={styles.colTitle}>COMPANY</span>
          <Link href="/company" className={styles.link}>About NEXUS</Link>
          <Link href="/research" className={styles.link}>Research</Link>
          <Link href="/employees" className={styles.link}>Leadership</Link>
          <Link href="/careers" className={styles.link}>Careers</Link>
        </div>
        <div className={styles.col}>
          <span className={styles.colTitle}>PLATFORM</span>
          <Link href="/aurelia" className={styles.link}>AURELIA</Link>
          <Link href="/developers" className={styles.link}>Developer Platform</Link>
          <Link href="/repository" className={styles.link}>Repositories</Link>
          <Link href="/status" className={styles.link}>System Status</Link>
        </div>
        <div className={styles.col}>
          <span className={styles.colTitle}>RESOURCES</span>
          <Link href="/documents" className={styles.link}>Public Archive</Link>
          <Link href="/research/publications" className={styles.link}>Publications</Link>
        </div>
        <div className={styles.col}>
          <span className={styles.colTitle}>TRUST</span>
          <Link href="/security" className={styles.link}>Security Center</Link>
          <Link href="/security/advisories" className={styles.link}>Advisories</Link>
          <Link href="/developers" className={styles.link}>API Reference</Link>
        </div>
      </div>
      <div className={styles.bar}>
        <p>&copy; {new Date().getFullYear()} NEXUS DYNAMICS. ALL RIGHTS RESERVED.</p>
        <p className={styles.sysId}>SYS.ID: ND-001</p>
      </div>
    </footer>
  );
}
