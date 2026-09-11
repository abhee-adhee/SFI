import Navigation from '@/components/Navigation/Navigation';
import Footer from '@/components/Footer/Footer';
import styles from '../../shared.module.css';
import projects from '@/data/projects.json';
import characters from '@/data/characters.json';
import documents from '@/data/documents.json';
import departments from '@/data/departments.json';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export function generateStaticParams() {
  return projects.map((proj) => ({
    id: proj.id,
  }));
}

export default async function ProjectDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const proj = projects.find((p) => p.id === id);

  if (!proj) {
    notFound();
  }

  const lead = characters.find((c) => c.id === proj.leadId);
  const dept = lead ? departments.find((d) => d.id === lead.department) : undefined;
  const contributors = characters.filter((c) => c.projects.includes(proj.id));
  const relatedDocs = documents.filter((d) => d.projectId === proj.id);

  return (
    <div className={styles.page}>
      <Navigation />

      <main className={styles.main}>
        <div className={styles.header}>
          <h1 className={styles.title}>{proj.name}</h1>
          <div className={styles.subtitle}>
            {proj.id} {"//"} STATUS: {proj.status}
          </div>
        </div>

        <div className={styles.content}>
          {proj.description && (
            <p style={{ marginBottom: '2rem' }}>{proj.description}</p>
          )}

          <div style={{ marginBottom: '2rem', padding: '1rem', border: '1px solid var(--color-gray-dark)', backgroundColor: 'var(--color-bg-darker)' }}>
            <h3 style={{ color: 'var(--color-acid-green)', marginBottom: '0.5rem' }}>PROJECT METADATA</h3>
            <p style={{ color: 'var(--color-pure-white)' }}>
              <strong>LEAD:</strong>{' '}
              <Link href={`/employees/${proj.leadId}`} className={styles.link}>
                {lead ? lead.name : proj.leadId}
              </Link>
            </p>
            {dept && (
              <p style={{ color: 'var(--color-pure-white)' }}>
                <strong>DIVISION:</strong> {dept.name} <span style={{ color: 'var(--color-gray)', fontFamily: 'var(--font-mono)', fontSize: '0.8125rem' }}>({dept.id})</span>
              </p>
            )}
            <p style={{ color: 'var(--color-pure-white)' }}>
              <strong>REPOSITORY:</strong>{' '}
              <Link href={`/repository/${proj.repoId}`} className={styles.link}>{proj.repoId}</Link>
            </p>
          </div>
        </div>

        {contributors.length > 0 && (
          <section className={styles.relatedSection}>
            <h2 className={styles.relatedHeading}>Contributors</h2>
            <ul className={styles.relatedList}>
              {contributors.map((c) => (
                <li key={c.id} className={styles.relatedItem}>
                  <Link href={`/employees/${c.id}`} className={styles.link}>{c.name}</Link>
                  <div className={styles.relatedItemMeta}>{c.role}{c.id === proj.leadId ? ' · LEAD' : ''}</div>
                </li>
              ))}
            </ul>
          </section>
        )}

        {relatedDocs.length > 0 && (
          <section className={styles.relatedSection}>
            <h2 className={styles.relatedHeading}>Related Documents</h2>
            <ul className={styles.relatedList}>
              {relatedDocs.map((d) => (
                <li key={d.id} className={styles.relatedItem}>
                  <Link href={`/documents/${d.id}`} className={styles.link}>{d.title}</Link>
                  <div className={styles.relatedItemMeta}>{d.id} · {d.classification}</div>
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
