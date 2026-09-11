import Navigation from '@/components/Navigation/Navigation';
import Footer from '@/components/Footer/Footer';
import styles from '../../shared.module.css';
import advisories from '@/data/advisories.json';
import characters from '@/data/characters.json';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export function generateStaticParams() {
  return advisories.map((adv) => ({
    id: adv.id,
  }));
}

export default async function AdvisoryDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const adv = advisories.find((a) => a.id === id);

  if (!adv) {
    notFound();
  }

  const author = characters.find((c) => c.id === adv.authorId);
  const otherAdvisories = advisories.filter((a) => a.id !== adv.id);

  return (
    <div className={styles.page}>
      <Navigation />

      <main className={styles.main}>
        <div className={styles.header}>
          <h1 className={styles.title}>{adv.title}</h1>
          <div className={styles.subtitle}>
            {adv.id} {"//"} {adv.date} {"//"} AUTHOR:{' '}
            <Link href={`/employees/${adv.authorId}`} className={styles.link}>
              {author ? author.name : adv.authorId}
            </Link>
          </div>
        </div>

        <div className={styles.content}>
          <div style={{ padding: '1rem', border: '1px solid var(--color-gray-dark)', backgroundColor: 'var(--color-bg-darker)' }}>
            <h3 style={{ color: adv.severity === 'CRITICAL' ? 'var(--color-critical-red)' : 'var(--color-acid-green)', marginBottom: '0.5rem' }}>
              SEVERITY: {adv.severity}
            </h3>
            <p style={{ color: 'var(--color-pure-white)' }}>{adv.description}</p>
          </div>
        </div>

        {otherAdvisories.length > 0 && (
          <section className={styles.relatedSection}>
            <h2 className={styles.relatedHeading}>Advisory Archive</h2>
            <ul className={styles.relatedList}>
              {otherAdvisories.map((a) => (
                <li key={a.id} className={styles.relatedItem}>
                  <Link href={`/advisories/${a.id}`} className={styles.link}>{a.title}</Link>
                  <div className={styles.relatedItemMeta}>{a.id} · {a.date} · {a.severity}</div>
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
