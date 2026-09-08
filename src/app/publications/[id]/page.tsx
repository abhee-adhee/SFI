import Navigation from '@/components/Navigation/Navigation';
import styles from '../../shared.module.css';
import publications from '@/data/publications.json';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export function generateStaticParams() {
  return publications.map((pub) => ({
    id: pub.id,
  }));
}

export default function PublicationDetail({ params }: { params: { id: string } }) {
  const pub = publications.find((p) => p.id === params.id);

  if (!pub) {
    notFound();
  }

  return (
    <div className={styles.page}>
      <Navigation />
      
      <main className={styles.main}>
        <div className={styles.header}>
          <h1 className={styles.title}>{pub.title}</h1>
          <div className={styles.subtitle}>
            DATE: {pub.date} | AUTHOR: <Link href={`/employees/${pub.authorId}`} className={styles.link}>{pub.authorId}</Link>
          </div>
        </div>

        <div className={styles.content}>
          <div style={{ marginBottom: '2rem', padding: '1rem', border: '1px solid var(--color-gray-dark)', backgroundColor: 'var(--color-bg-darker)' }}>
            <h3 style={{ color: 'var(--color-acid-green)', marginBottom: '0.5rem' }}>ABSTRACT</h3>
            <p style={{ color: 'var(--color-pure-white)' }}>{pub.abstract}</p>
          </div>

          {pub.status === 'RETRACTED' && pub.retractionNote && (
            <div style={{ padding: '1rem', border: '1px solid var(--color-critical-red)', backgroundColor: 'rgba(255, 68, 68, 0.1)' }}>
              <h3 style={{ color: 'var(--color-critical-red)', marginBottom: '0.5rem' }}>RETRACTION NOTICE</h3>
              <p style={{ color: 'var(--color-pure-white)' }}>{pub.retractionNote}</p>
            </div>
          )}
        </div>
      </main>

      <footer className={styles.footer}>
        <p>&copy; {new Date().getFullYear()} NEXUS DYNAMICS. ALL RIGHTS RESERVED.</p>
        <p>SYS.ID: ND-PUB-DETAIL</p>
      </footer>
    </div>
  );
}
