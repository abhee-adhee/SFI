import Navigation from '@/components/Navigation/Navigation';
import Footer from '@/components/Footer/Footer';
import styles from '../shared.module.css';
import repositories from '@/data/repositories.json';
import Link from 'next/link';

export default function RepositoriesPage() {
  return (
    <div className={styles.page}>
      <Navigation />
      
      <main className={styles.main}>
        <div className={styles.header}>
          <h1 className={styles.title}>CODE REPOSITORIES</h1>
          <p className={styles.subtitle}>PUBLIC OPEN SOURCE INITIATIVES</p>
        </div>

        <div className={styles.grid}>
          {repositories.filter(r => r.isPublic).map((repo) => (
            <Link href={`/repository/${repo.id}`} key={repo.id} className={styles.card}>
              <div className={styles.cardMeta}>{repo.id}</div>
              <h3 className={styles.cardTitle}>{repo.name}</h3>
              <div style={{ color: 'var(--color-gray-light)', fontSize: '0.875rem' }}>
                {repo.description}
              </div>
            </Link>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
