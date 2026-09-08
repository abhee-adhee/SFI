import Navigation from '@/components/Navigation/Navigation';
import styles from '../../shared.module.css';
import RepositoryViewer from '@/components/RepositoryViewer/RepositoryViewer';
import repositories from '@/data/repositories.json';
import { notFound } from 'next/navigation';

import { getFlag } from '@/lib/secrets';

export async function generateStaticParams() {
  return repositories.map((r) => ({ id: r.id }));
}

export default function RepositoryDetailPage({ params }: { params: { id: string } }) {
  const repo = repositories.find(r => r.id === params.id);
  
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
      </main>
    </div>
  );
}
