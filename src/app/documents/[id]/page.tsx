import Navigation from '@/components/Navigation/Navigation';
import Footer from '@/components/Footer/Footer';
import styles from '../../shared.module.css';
import DocumentViewer from '@/components/DocumentViewer/DocumentViewer';
import documents from '@/data/documents.json';
import characters from '@/data/characters.json';
import projects from '@/data/projects.json';
import { notFound } from 'next/navigation';
import Link from 'next/link';

import { getFlag } from '@/lib/secrets';

export async function generateStaticParams() {
  return documents.map((d) => ({ id: d.id }));
}

export default async function DocumentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const doc = documents.find(d => d.id === id);

  if (!doc) {
    notFound();
  }

  // Resolve flags in content
  let resolvedContent = doc.content;
  const match = resolvedContent.match(/_flagRef_(OSINT-\d+)/);
  if (match) {
    resolvedContent = resolvedContent.replace(match[0], getFlag(match[1]));
  }

  // Enforce access control conceptually
  const isRestricted = doc.classification === 'RESTRICTED' || doc.classification === 'ARCHIVED';

  const author = characters.find(c => c.id === doc.authorId);
  const project = projects.find(p => p.id === doc.projectId);

  return (
    <div className={styles.page}>
      <Navigation />

      <main className={styles.main}>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          {isRestricted ? (
            <div style={{ color: 'var(--color-pure-white)', textAlign: 'center', marginTop: '4rem' }}>
              <h1 style={{ color: 'var(--color-purple)', fontSize: '4rem', marginBottom: '1rem' }}>403</h1>
              <h2>CLEARANCE REQUIRED</h2>
              <p style={{ color: 'var(--color-gray-light)', marginTop: '1rem' }}>
                This document requires internal network access or elevated clearance.
              </p>
            </div>
          ) : (
            <DocumentViewer
              title={doc.title}
              id={doc.id}
              content={resolvedContent}
              classification={doc.classification}
              date={doc.date}
            />
          )}
        </div>

        {(author || project) && (
          <section className={styles.relatedSection}>
            <h2 className={styles.relatedHeading}>Record Metadata</h2>
            <ul className={styles.relatedList}>
              {author && (
                <li className={styles.relatedItem}>
                  <Link href={`/employees/${author.id}`} className={styles.link}>{author.name}</Link>
                  <div className={styles.relatedItemMeta}>AUTHOR · {author.role}</div>
                </li>
              )}
              {project && (
                <li className={styles.relatedItem}>
                  <Link href={`/projects/${project.id}`} className={styles.link}>{project.name}</Link>
                  <div className={styles.relatedItemMeta}>PROJECT · {project.status}</div>
                </li>
              )}
            </ul>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
