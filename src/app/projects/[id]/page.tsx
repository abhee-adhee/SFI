import Navigation from '@/components/Navigation/Navigation';
import styles from '../../shared.module.css';
import projects from '@/data/projects.json';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export function generateStaticParams() {
  return projects.map((proj) => ({
    id: proj.id,
  }));
}

export default function ProjectDetail({ params }: { params: { id: string } }) {
  const proj = projects.find((p) => p.id === params.id);

  if (!proj) {
    notFound();
  }

  return (
    <div className={styles.page}>
      <Navigation />
      
      <main className={styles.main}>
        <div className={styles.header}>
          <h1 className={styles.title}>{proj.name}</h1>
          <div className={styles.subtitle}>
            STATUS: {proj.status}
          </div>
        </div>

        <div className={styles.content}>
          <div style={{ marginBottom: '2rem', padding: '1rem', border: '1px solid var(--color-gray-dark)', backgroundColor: 'var(--color-bg-darker)' }}>
            <h3 style={{ color: 'var(--color-acid-green)', marginBottom: '0.5rem' }}>PROJECT METADATA</h3>
            <p style={{ color: 'var(--color-pure-white)' }}>
              <strong>LEAD:</strong> <Link href={`/employees/${proj.leadId}`} className={styles.link}>{proj.leadId}</Link>
            </p>
            <p style={{ color: 'var(--color-pure-white)' }}>
              <strong>REPOSITORY:</strong> <Link href={`/repository/${proj.repoId}`} className={styles.link}>{proj.repoId}</Link>
            </p>
          </div>
        </div>
      </main>

      <footer className={styles.footer}>
        <p>&copy; {new Date().getFullYear()} NEXUS DYNAMICS. ALL RIGHTS RESERVED.</p>
        <p>SYS.ID: ND-PROJ-DETAIL</p>
      </footer>
    </div>
  );
}
