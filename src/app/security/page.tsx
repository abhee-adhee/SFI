import Navigation from '@/components/Navigation/Navigation';
import Footer from '@/components/Footer/Footer';
import styles from '../shared.module.css';
import incidents from '@/data/incidents.json';
import Link from 'next/link';

export default function SecurityPage() {
  return (
    <div className={styles.page}>
      <Navigation />

      <main className={styles.main}>
        <div className={styles.header}>
          <h1 className={styles.title}>SECURITY CENTER</h1>
          <p className={styles.subtitle}>ZERO-TRUST ARCHITECTURE</p>
        </div>

        <div className={styles.content}>
          <h2 style={{ color: 'var(--color-pure-white)', marginBottom: '1rem' }}>VULNERABILITY DISCLOSURE</h2>
          <p style={{ marginBottom: '2rem' }}>
            NEXUS Dynamics is committed to ensuring the safety of our global cognitive grid. We enforce a strict Zero-Trust model across all internal and public-facing interfaces. Historical vulnerability and containment disclosures are maintained in the <Link href="/security/advisories" style={{ color: 'var(--color-acid-green)' }}>advisory archive</Link>.
          </p>

          <h2 style={{ color: 'var(--color-pure-white)', marginBottom: '1rem' }}>INCIDENT DISCLOSURES</h2>
          <p style={{ marginBottom: '1rem', fontSize: '0.875rem' }}>
            Public post-incident summaries for events affecting production infrastructure.
          </p>
          <ul style={{ listStyleType: 'none', padding: 0, marginBottom: '2rem' }}>
            {incidents.map((inc) => (
              <li key={inc.id} style={{ marginBottom: '1rem', padding: '1rem', border: '1px solid var(--color-gray-dark)' }}>
                <div style={{ color: 'var(--color-acid-green)', fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>
                  {inc.id} {"//"} {inc.date} {"//"} SEVERITY: {inc.severity}
                </div>
                <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>{inc.description}</p>
              </li>
            ))}
          </ul>

          <h2 style={{ color: 'var(--color-pure-white)', marginBottom: '1rem' }}>RECENT ADVISORIES</h2>
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            <li style={{ marginBottom: '1rem', padding: '1rem', border: '1px solid var(--color-gray-dark)' }}>
              <div style={{ color: 'var(--color-acid-green)', fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>ADV-2025-01</div>
              <strong style={{ color: 'var(--color-white)' }}>Routing Deviation Incident</strong>
              <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>Minor anomaly detected in the Global Grid routing logic. Patched and isolated. No data compromise confirmed.</p>
            </li>
          </ul>
          <p style={{ fontSize: '0.875rem' }}>
            View the complete disclosure history in the <Link href="/security/advisories" style={{ color: 'var(--color-acid-green)' }}>security advisories</Link> section.
          </p>

          <div style={{ marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--color-gray-dark)' }}>
            <h2 style={{ color: 'var(--color-pure-white)', marginBottom: '0.75rem' }}>RESTRICTED OPERATIONS</h2>
            <p style={{ fontSize: '0.875rem', marginBottom: '1rem' }}>
              Active incident coordination is handled in the access-controlled response portal, available to authorized DEPT-SEC personnel.
            </p>
            <Link href="/incident" className={styles.restrictedLink}>
              <span className={styles.restrictedLock}>◈</span> Incident Response Portal · DEPT-SEC
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
