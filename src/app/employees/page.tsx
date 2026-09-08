import Navigation from '@/components/Navigation/Navigation';
import styles from '../shared.module.css';
import characters from '@/data/characters.json';
import Link from 'next/link';

export default function EmployeesPage() {
  return (
    <div className={styles.page}>
      <Navigation />
      
      <main className={styles.main}>
        <div className={styles.header}>
          <h1 className={styles.title}>EMPLOYEE DIRECTORY</h1>
          <p className={styles.subtitle}>GLOBAL PERSONNEL</p>
        </div>

        <div className={styles.grid}>
          {characters.map((char) => (
            <Link href={`/employees/${char.id}`} key={char.id} className={styles.card}>
              <div className={styles.cardMeta}>{char.id}</div>
              <h3 className={styles.cardTitle}>{char.name}</h3>
              <div style={{ color: 'var(--color-gray-light)', fontSize: '0.875rem' }}>
                {char.role}
              </div>
            </Link>
          ))}
        </div>
      </main>

      <footer className={styles.footer}>
        <p>&copy; {new Date().getFullYear()} NEXUS DYNAMICS. ALL RIGHTS RESERVED.</p>
        <p>SYS.ID: ND-EMP-DIR</p>
      </footer>
    </div>
  );
}
