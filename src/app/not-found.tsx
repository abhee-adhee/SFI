import Link from 'next/link';
import Navigation from '@/components/Navigation/Navigation';
import Footer from '@/components/Footer/Footer';
import styles from './shared.module.css';

/**
 * Global 404 handler.
 * Framed in-world as a decommissioned / relocated resource rather than a raw
 * error. A genuinely invalid manual URL still lands here, but the page keeps
 * the visitor inside the NEXUS surface and always offers a way onward, so no
 * navigation ever ends in a true dead end.
 */
export default function NotFound() {
  const destinations = [
    { href: '/', label: 'Home', meta: 'NEXUS DYNAMICS' },
    { href: '/company', label: 'About NEXUS', meta: 'COMPANY // HISTORY' },
    { href: '/aurelia', label: 'AURELIA Platform', meta: 'FLAGSHIP SYSTEM' },
    { href: '/documents', label: 'Public Archive', meta: 'DOCUMENTATION' },
    { href: '/status', label: 'System Status', meta: 'LIVE METRICS' },
  ];

  return (
    <div className={styles.page}>
      <Navigation />

      <main className={styles.main}>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '5rem' }}>
          <div style={{ maxWidth: '620px', width: '100%' }}>
            <div style={{ textAlign: 'center' }}>
              <h1 style={{ color: 'var(--color-purple)', fontSize: '4rem', marginBottom: '0.5rem', lineHeight: 1 }}>
                404
              </h1>
              <h2 style={{ color: 'var(--color-pure-white)', letterSpacing: '0.04em' }}>
                RESOURCE NOT FOUND
              </h2>
              <p style={{ color: 'var(--color-gray-light)', marginTop: '1rem', lineHeight: 1.7 }}>
                The requested record could not be located on the public surface. Resources are
                periodically decommissioned, relocated to cold storage, or restricted to internal
                divisions. If you followed a link, the target may no longer be published.
              </p>
            </div>

            <p
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                color: 'var(--color-gray)',
                textAlign: 'center',
                marginTop: '1.5rem',
                padding: '0.75rem',
                border: '1px solid var(--color-gray-dark)',
                backgroundColor: 'var(--color-near-black)',
              }}
            >
              STATUS 404 // RESOLVER: NO MAPPING FOR REQUESTED PATH
            </p>

            <div className={styles.relatedSection}>
              <div className={styles.relatedHeading}>CONTINUE FROM</div>
              <ul className={styles.relatedList}>
                {destinations.map((d) => (
                  <li key={d.href} className={styles.relatedItem}>
                    <Link href={d.href} className={styles.link}>
                      {d.label}
                    </Link>
                    <div className={styles.relatedItemMeta}>{d.meta}</div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
