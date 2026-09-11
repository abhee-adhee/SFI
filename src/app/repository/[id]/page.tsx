import Navigation from '@/components/Navigation/Navigation';
import Footer from '@/components/Footer/Footer';
import styles from '../../shared.module.css';
import RepositoryViewer from '@/components/RepositoryViewer/RepositoryViewer';
import repositories from '@/data/repositories.json';
import characters from '@/data/characters.json';
import projects from '@/data/projects.json';
import { notFound } from 'next/navigation';
import Link from 'next/link';

import { getFlag } from '@/lib/secrets';

export async function generateStaticParams() {
  return repositories.map((r) => ({ id: r.id }));
}

export default async function RepositoryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const repo = repositories.find(r => r.id === id);

  if (!repo) {
    notFound();
  }

  // Clone commits to avoid mutating static data, and resolve flags
  const resolvedCommits = repo.commits.map(c => {
    let msg = c.message;
    const match = msg.match(/_flagRef_(OSINT-\d+)/);
    if (match) {
      msg = msg.replace(match[0], getFlag(match[1]));
    }
    return { ...c, message: msg };
  });

  const owner = characters.find(c => c.id === repo.ownerId);
  const usedBy = projects.filter(p => p.repoId === repo.id);

  return (
    <div className={styles.page}>
      <Navigation />

      <main className={styles.main}>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          {!repo.isPublic ? (
            <div style={{ color: 'var(--color-pure-white)', textAlign: 'center', marginTop: '4rem' }}>
              <h1 style={{ color: 'var(--color-purple)', fontSize: '4rem', marginBottom: '1rem' }}>403</h1>
              <h2>ACCESS DENIED</h2>
              <p style={{ color: 'var(--color-gray-light)', marginTop: '1rem' }}>
                You do not have the required permissions to view this internal repository.
              </p>
            </div>
          ) : (
            <RepositoryViewer
              repoName={repo.name}
              commits={resolvedCommits}
            />
          )}
        </div>

        {(owner || usedBy.length > 0) && (
          <section className={styles.relatedSection}>
            <h2 className={styles.relatedHeading}>Repository Metadata</h2>
            <ul className={styles.relatedList}>
              {owner && (
                <li className={styles.relatedItem}>
                  <Link href={`/employees/${owner.id}`} className={styles.link}>{owner.name}</Link>
                  <div className={styles.relatedItemMeta}>OWNER · {owner.role}</div>
                </li>
              )}
              {usedBy.map((p) => (
                <li key={p.id} className={styles.relatedItem}>
                  <Link href={`/projects/${p.id}`} className={styles.link}>{p.name}</Link>
                  <div className={styles.relatedItemMeta}>PROJECT · {p.status}</div>
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
