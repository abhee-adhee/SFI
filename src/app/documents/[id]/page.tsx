import Navigation from '@/components/Navigation/Navigation';
import styles from '../../shared.module.css';
import DocumentViewer from '@/components/DocumentViewer/DocumentViewer';
import documents from '@/data/documents.json';
import { notFound } from 'next/navigation';

import { getFlag } from '@/lib/secrets';

export async function generateStaticParams() {
  return documents.map((d) => ({ id: d.id }));
}

export default function DocumentDetailPage({ params }: { params: { id: string } }) {
  const doc = documents.find(d => d.id === params.id);
  
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
      </main>
    </div>
  );
}
