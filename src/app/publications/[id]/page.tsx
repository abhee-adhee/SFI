import Navigation from '@/components/Navigation/Navigation';
import Footer from '@/components/Footer/Footer';
import styles from '../../shared.module.css';
import publications from '@/data/publications.json';
import characters from '@/data/characters.json';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export function generateStaticParams() {
  return publications.map((pub) => ({
    id: pub.id,
  }));
}

export default async function PublicationDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const pub = publications.find((p) => p.id === id);

  if (!pub) {
    notFound();
  }

  const author = characters.find((c) => c.id === pub.authorId);
  const moreByAuthor = publications.filter(
    (p) => p.authorId === pub.authorId && p.id !== pub.id
  );

  return (
    <div className={styles.page}>
      <Navigation />

      <main className={styles.main}>
        <div className={styles.header}>
          <h1 className={styles.title}>{pub.title}</h1>
          <div className={styles.subtitle}>
            {pub.id} {"//"} {pub.date} {"//"} AUTHOR:{' '}
            <Link href={`/employees/${pub.authorId}`} className={styles.link}>
              {author ? author.name : pub.authorId}
            </Link>
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

        {moreByAuthor.length > 0 && (
          <section className={styles.relatedSection}>
            <h2 className={styles.relatedHeading}>More from this author</h2>
            <ul className={styles.relatedList}>
              {moreByAuthor.map((p) => (
                <li key={p.id} className={styles.relatedItem}>
                  <Link href={`/publications/${p.id}`} className={styles.link}>{p.title}</Link>
                  <div className={styles.relatedItemMeta}>{p.id} · {p.date} · {p.status}</div>
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
