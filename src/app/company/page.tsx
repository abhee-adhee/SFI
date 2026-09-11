import Navigation from '@/components/Navigation/Navigation';
import Footer from '@/components/Footer/Footer';
import styles from '../shared.module.css';
import timeline from '@/data/timeline.json';
import departments from '@/data/departments.json';
import characters from '@/data/characters.json';
import Link from 'next/link';

const offices = [
  { region: 'REGION 1', name: 'Global Headquarters', focus: 'Executive · Applied AI' },
  { region: 'EU-WEST', name: 'Datacenter Campus', focus: 'Core Systems · Grid Operations' },
  { region: 'REGION 4', name: 'Security Operations Center', focus: 'Information Security' },
  { region: 'OFF-SITE', name: 'Cold Storage Archive Facility', focus: 'Retention · Restricted Access' },
];

export default function CompanyPage() {
  const leadership = departments
    .map((d) => ({ dept: d, head: characters.find((c) => c.id === d.headId) }))
    .filter((x) => x.head);

  return (
    <div className={styles.page}>
      <Navigation />

      <main className={styles.main}>
        <div className={styles.header}>
          <h1 className={styles.title}>COMPANY OVERVIEW</h1>
          <p className={styles.subtitle}>HISTORY & LEADERSHIP</p>
        </div>

        <div className={styles.content}>
          <p>
            Founded in 2015, NEXUS Dynamics was established to push the boundaries of computational intelligence and autonomous infrastructure.
          </p>
          <p style={{ marginTop: '1rem', color: 'var(--color-gray-light)', fontSize: '0.875rem' }}>
            Our early research, including the 2016 Foundational AI Grant, has been declassified and is available in the <Link href="/documents" style={{ color: 'var(--color-acid-green)' }}>Public Archive</Link>.
          </p>
          <p style={{ marginTop: '1rem', color: 'var(--color-gray-light)', fontSize: '0.875rem' }}>
            Our research and engineering programs are led by the scientists and staff listed in the <Link href="/employees" style={{ color: 'var(--color-acid-green)' }}>leadership directory</Link>.
          </p>
        </div>

        {/* At a glance */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--color-gray-dark)' }}>
          {[
            { k: 'FOUNDED', v: '2015' },
            { k: 'DIVISIONS', v: String(departments.length) },
            { k: 'DATACENTERS', v: '42' },
            { k: 'FLAGSHIP PLATFORM', v: 'AURELIA' },
          ].map((s) => (
            <div key={s.k}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', letterSpacing: '0.1em', color: 'var(--color-gray)' }}>{s.k}</div>
              <div style={{ fontSize: '1.75rem', color: 'var(--color-pure-white)' }}>{s.v}</div>
            </div>
          ))}
        </div>

        {/* Leadership */}
        <section id="leadership" className={styles.relatedSection}>
          <h2 className={styles.relatedHeading}>Leadership &amp; Divisions</h2>
          <div className={styles.grid}>
            {leadership.map(({ dept, head }) => (
              <Link href={`/employees/${head!.id}`} key={dept.id} className={styles.card}>
                <div className={styles.cardMeta}>{dept.id} {"//"} {dept.name}</div>
                <h3 className={styles.cardTitle}>{head!.name}</h3>
                <div style={{ color: 'var(--color-acid-green)', fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>
                  {head!.role}
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Global operations */}
        <section className={styles.relatedSection}>
          <h2 className={styles.relatedHeading}>Global Operations</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1rem' }}>
            {offices.map((o) => (
              <div key={o.region} style={{ border: '1px solid var(--color-gray-dark)', padding: '1rem', backgroundColor: 'var(--color-near-black)' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--color-acid-green)', letterSpacing: '0.1em' }}>{o.region}</div>
                <div style={{ color: 'var(--color-pure-white)', marginTop: '0.35rem' }}>{o.name}</div>
                <div style={{ color: 'var(--color-gray)', fontSize: '0.8125rem', marginTop: '0.15rem' }}>{o.focus}</div>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.relatedSection}>
          <h2 style={{ marginBottom: '1rem', color: 'var(--color-pure-white)' }}>TIMELINE</h2>
          <div style={{ borderLeft: '2px solid var(--color-gray-dark)', paddingLeft: '1rem' }}>
            {timeline.map((event) => (
              <div key={event.id} style={{ marginBottom: '1.5rem' }}>
                <div style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-acid-green)', fontSize: '0.875rem' }}>
                  {event.year} {"//"} {event.type}
                </div>
                <div style={{ color: 'var(--color-pure-white)' }}>
                  {event.event}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
