import Navigation from '@/components/Navigation/Navigation';
import styles from '../../shared.module.css';
import characters from '@/data/characters.json';
import projects from '@/data/projects.json';
import departments from '@/data/departments.json';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  return characters.map((c) => ({ id: c.id }));
}

export default function EmployeeDetailPage({ params }: { params: { id: string } }) {
  const char = characters.find(c => c.id === params.id);
  
  if (!char) {
    notFound();
  }

  const dept = departments.find(d => d.id === char.department);
  const charProjects = projects.filter(p => char.projects.includes(p.id));

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
            {char.role} {"//"} {dept?.name || char.department}
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

          <h3 style={{ color: 'var(--color-pure-white)', marginBottom: '0.5rem' }}>ASSIGNED PROJECTS</h3>
          <ul style={{ listStyleType: 'square', paddingLeft: '1.5rem', color: 'var(--color-acid-green)', marginBottom: '2rem' }}>
            {charProjects.map(proj => (
              <li key={proj.id} style={{ marginBottom: '0.5rem' }}>
                <a href={`/projects/${proj.id}`} style={{ color: 'var(--color-white)', textDecoration: 'none' }}>{proj.name}</a>
                <span style={{ color: 'var(--color-gray)', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', marginLeft: '1rem' }}>
                  [{proj.status}]
                </span>
              </li>
            ))}
          </ul>

          {char.publications && char.publications.length > 0 && (
            <>
              <h3 style={{ color: 'var(--color-pure-white)', marginBottom: '0.5rem' }}>PUBLICATIONS</h3>
              <ul style={{ listStyleType: 'square', paddingLeft: '1.5rem', color: 'var(--color-purple)' }}>
                {char.publications.map(pubId => (
                  <li key={pubId} style={{ marginBottom: '0.5rem' }}>
                    <a href={`/publications/${pubId}`} style={{ color: 'var(--color-white)', textDecoration: 'none' }}>{pubId}</a>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
