import Navigation from '@/components/Navigation/Navigation';
import Footer from '@/components/Footer/Footer';
import Link from 'next/link';
import styles from '../shared.module.css';

interface Role {
  title: string;
  location: string;
  dept: string;
  summary: string;
}

const roles: Role[] = [
  {
    title: 'Cognitive Architect',
    location: 'REGION 1',
    dept: 'DEPT-AI',
    summary: 'Design bounded recursive learning systems for the AURELIA platform.',
  },
  {
    title: 'Research Scientist, Advanced Models',
    location: 'REGION 1',
    dept: 'DEPT-RES',
    summary: 'Investigate the theoretical limits of large-scale cognitive models.',
  },
  {
    title: 'Systems Reliability Engineer',
    location: 'EU-WEST',
    dept: 'DEPT-SYS',
    summary: 'Operate and scale the Global Nexus Grid across 42 datacenters.',
  },
  {
    title: 'Memory Systems Engineer',
    location: 'EU-WEST',
    dept: 'DEPT-SYS',
    summary: 'Build allocation and diagnostics tooling for AURELIA Core.',
  },
  {
    title: 'Security Analyst',
    location: 'REGION 4',
    dept: 'DEPT-SEC',
    summary: 'Monitor anomaly-detection grids and enforce zero-trust boundaries.',
  },
  {
    title: 'Platform Developer Advocate',
    location: 'REGION 1',
    dept: 'DEPT-SYS',
    summary: 'Support integrators building on the public NEXUS developer platform.',
  },
];

const process = [
  { step: '01', label: 'Application Review', desc: 'Your profile is reviewed by the hiring division.' },
  { step: '02', label: 'Technical Screen', desc: 'A focused conversation on your domain and past work.' },
  { step: '03', label: 'Division Panel', desc: 'Meet the team you would join and its leadership.' },
  { step: '04', label: 'Offer & Clearance', desc: 'Offer, followed by role-appropriate access provisioning.' },
];

export default function CareersPage() {
  return (
    <div className={styles.page}>
      <Navigation />

      <main className={styles.main}>
        <div className={styles.header}>
          <h1 className={styles.title}>CAREERS</h1>
          <p className={styles.subtitle}>BUILD THE FUTURE</p>
        </div>

        <div className={styles.content}>
          <p>
            We are looking for exceptional individuals to join the teams building the world&apos;s most
            advanced autonomous systems. Our people work across four divisions and four global sites, on
            problems that range from cognitive architecture to grid-scale reliability and security.
          </p>
          <p style={{ marginTop: '1rem', color: 'var(--color-gray-light)', fontSize: '0.9375rem' }}>
            Learn more about our divisions and leadership on the{' '}
            <Link href="/company#leadership" className={styles.link}>company overview</Link>.
          </p>
        </div>

        <section className={styles.relatedSection}>
          <h2 className={styles.relatedHeading}>Open Roles</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
            {roles.map((r) => (
              <div key={r.title} style={{ border: '1px solid var(--color-gray-dark)', padding: '1.25rem', backgroundColor: 'var(--color-near-black)' }}>
                <h3 style={{ color: 'var(--color-pure-white)', marginBottom: '0.5rem' }}>{r.title}</h3>
                <p style={{ color: 'var(--color-gray)', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', marginBottom: '0.65rem' }}>
                  {r.location} {"//"} {r.dept}
                </p>
                <p style={{ color: 'var(--color-gray-light)', fontSize: '0.875rem' }}>{r.summary}</p>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.relatedSection}>
          <h2 className={styles.relatedHeading}>How We Hire</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}>
            {process.map((p) => (
              <div key={p.step} style={{ border: '1px solid var(--color-gray-dark)', padding: '1rem', backgroundColor: 'var(--color-near-black)' }}>
                <div style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-acid-green)', fontSize: '1.25rem' }}>{p.step}</div>
                <div style={{ color: 'var(--color-pure-white)', marginTop: '0.35rem' }}>{p.label}</div>
                <div style={{ color: 'var(--color-gray)', fontSize: '0.8125rem', marginTop: '0.25rem' }}>{p.desc}</div>
              </div>
            ))}
          </div>
          <p style={{ color: 'var(--color-gray)', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', marginTop: '1.25rem' }}>
            To apply, contact your NEXUS Dynamics recruiting partner or the division listed on the role.
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}
