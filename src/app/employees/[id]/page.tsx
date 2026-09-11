import Navigation from '@/components/Navigation/Navigation';
import Footer from '@/components/Footer/Footer';
import styles from '../../shared.module.css';
import characters from '@/data/characters.json';
import projects from '@/data/projects.json';
import publications from '@/data/publications.json';
import repositories from '@/data/repositories.json';
import departments from '@/data/departments.json';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export async function generateStaticParams() {
  return characters.map((c) => ({ id: c.id }));
}

export default async function EmployeeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const char = characters.find(c => c.id === id);

  if (!char) {
    notFound();
  }

  const dept = departments.find(d => d.id === char.department);
  const isDeptHead = dept?.headId === char.id;
  const charProjects = projects.filter(p => char.projects.includes(p.id));
  const charPublications = publications.filter(p => char.publications.includes(p.id));
  const ownedRepos = repositories.filter(r => r.ownerId === char.id);

  return (
    <div className={styles.page}>
      <Navigation />

      <main className={styles.main}>
        <div className={styles.header}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <p className={styles.subtitle}>{char.id}</p>
            <p className={styles.subtitle}>STATUS: ACTIVE</p>
          </div>
          <h1 className={styles.title}>{char.name}</h1>
          <h2 style={{ color: 'var(--color-gray-light)', fontSize: '1.25rem', marginBottom: '1rem' }}>
            {char.role} {"//"}{' '}
            <Link href="/company#leadership" className={styles.link}>{dept?.name || char.department}</Link>
            {isDeptHead && <span style={{ color: 'var(--color-acid-green)', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', marginLeft: '0.75rem' }}>DIVISION HEAD</span>}
          </h2>
        </div>

        <div className={styles.content}>
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ color: 'var(--color-pure-white)', marginBottom: '0.5rem' }}>PROFILE</h3>
            <p>{char.bio}</p>
            <p style={{ marginTop: '1rem', fontFamily: 'var(--font-mono)', fontSize: '0.875rem' }}>
              EMPLOYMENT START: {char.employmentDate}
            </p>
          </div>
        </div>

        {charProjects.length > 0 && (
          <section className={styles.relatedSection}>
            <h2 className={styles.relatedHeading}>Assigned Projects</h2>
            <ul className={styles.relatedList}>
              {charProjects.map(proj => (
                <li key={proj.id} className={styles.relatedItem}>
                  <Link href={`/projects/${proj.id}`} className={styles.link}>{proj.name}</Link>
                  <div className={styles.relatedItemMeta}>{proj.id} · {proj.status}</div>
                </li>
              ))}
            </ul>
          </section>
        )}

        {charPublications.length > 0 && (
          <section className={styles.relatedSection}>
            <h2 className={styles.relatedHeading}>Publications</h2>
            <ul className={styles.relatedList}>
              {charPublications.map(pub => (
                <li key={pub.id} className={styles.relatedItem}>
                  <Link href={`/publications/${pub.id}`} className={styles.link}>{pub.title}</Link>
                  <div className={styles.relatedItemMeta}>{pub.id} · {pub.date} · {pub.status}</div>
                </li>
              ))}
            </ul>
          </section>
        )}

        {ownedRepos.length > 0 && (
          <section className={styles.relatedSection}>
            <h2 className={styles.relatedHeading}>Repositories</h2>
            <ul className={styles.relatedList}>
              {ownedRepos.map(repo => (
                <li key={repo.id} className={styles.relatedItem}>
                  <Link href={`/repository/${repo.id}`} className={styles.link}>{repo.name}</Link>
                  <div className={styles.relatedItemMeta}>{repo.id} · {repo.isPublic ? 'PUBLIC' : 'RESTRICTED'}</div>
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
