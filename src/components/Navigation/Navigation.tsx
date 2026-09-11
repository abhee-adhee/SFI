import Link from 'next/link';
import styles from './Navigation.module.css';

export default function Navigation() {
  return (
    <nav className={styles.nav}>
      <div className={styles.logo}>
        <Link href="/">
          NEXUS<span className={styles.accent}>DYNAMICS</span>
        </Link>
      </div>
      <div className={styles.links}>
        <Link href="/research" className={styles.link}>RESEARCH</Link>
        <Link href="/aurelia" className={styles.link}>SYSTEMS</Link>
        <Link href="/security" className={styles.link}>SECURITY</Link>
        <Link href="/company" className={styles.link}>COMPANY</Link>
        <Link href="/careers" className={styles.link}>CAREERS</Link>
      </div>
    </nav>
  );
}
