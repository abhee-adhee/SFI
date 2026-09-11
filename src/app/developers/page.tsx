import Navigation from '@/components/Navigation/Navigation';
import Footer from '@/components/Footer/Footer';
import Link from 'next/link';
import shared from '../shared.module.css';
import styles from './developers.module.css';

export const metadata = {
  title: 'Developer Platform — NEXUS Dynamics',
  description: 'API reference for the NEXUS Dynamics public platform services.',
};

interface Param {
  name: string;
  type: string;
  desc: string;
}

interface Endpoint {
  id: string;
  method: 'GET' | 'POST';
  path: string;
  href?: string;
  service: string;
  desc: string;
  params?: Param[];
  body?: string;
  note?: { title: string; body: string };
  reqLabel: string;
  req: string;
  resLabel: string;
  res: string;
}

const endpoints: Endpoint[] = [
  {
    id: 'employees',
    method: 'GET',
    path: '/api/v1/employees',
    href: '/api/v1/employees',
    service: 'DIRECTORY SERVICE',
    desc:
      'Returns the NEXUS staff directory. Anonymous callers receive public profile fields only (identifier, name, role). Authenticated sessions holding a directory role receive the full employee record, including department, biography and project assignments.',
    params: [{ name: '—', type: '—', desc: 'No required parameters.' }],
    note: {
      title: 'Deprecation Notice',
      body:
        'Before v1.0, the directory service could emit expanded record output — including internal profile metadata — when specific query parameters were supplied by the build tooling. Those parameters are undocumented and deprecated, but the service still honors them for backward compatibility. Scheduled for removal in v2.',
    },
    reqLabel: 'EXAMPLE REQUEST',
    req: `GET /api/v1/employees HTTP/1.1
Host: api.nexusdynamics.io
Accept: application/json`,
    resLabel: 'EXAMPLE RESPONSE (TRUNCATED)',
    res: `[
  { "id": "EMP-001", "name": "Dr. Evelyn Vance", "role": "Chief AI Architect" },
  { "id": "EMP-002", "name": "Marcus Chen", "role": "VP of Core Systems" },
  { "id": "EMP-003", "name": "Sarah Ockham", "role": "Senior Systems Engineer" }
]`,
  },
  {
    id: 'status',
    method: 'GET',
    path: '/api/v1/status',
    href: '/api/v1/status',
    service: 'STATUS SERVICE',
    desc:
      'Reports global platform health and per-subsystem operational state. This is the service that powers the public System Status dashboard.',
    params: [{ name: '—', type: '—', desc: 'No required parameters.' }],
    note: {
      title: 'Diagnostics Header',
      body:
        'Every status response carries an X-Diagnostic-Mode header indicating whether extended diagnostic reporting is active. When diagnostics are disabled the payload is limited to summary health. Operations tooling negotiates extended output by echoing the same header on the request.',
    },
    reqLabel: 'EXAMPLE REQUEST',
    req: `GET /api/v1/status HTTP/1.1
Host: api.nexusdynamics.io
Accept: application/json`,
    resLabel: 'EXAMPLE RESPONSE',
    res: `HTTP/1.1 200 OK
Content-Type: application/json
X-Diagnostic-Mode: disabled

{
  "timestamp": "2026-09-09T00:00:00.000Z",
  "global_status": "OPERATIONAL",
  "systems": [
    { "id": "SYS-AURELIA", "name": "AURELIA CORE", "status": "OPERATIONAL", "region": "GLOBAL" },
    { "id": "SYS-GRID", "name": "NEXUS GRID", "status": "OPERATIONAL", "region": "GLOBAL" },
    { "id": "SYS-ARCHIVE", "name": "COLD STORAGE ARCHIVE", "status": "RESTRICTED", "region": "OFF-SITE" }
  ]
}`,
  },
  {
    id: 'documents',
    method: 'GET',
    path: '/api/v1/documents/secure?id=DOC-001',
    href: '/api/v1/documents/secure?id=DOC-001',
    service: 'DOCUMENT SERVICE',
    desc:
      'Retrieves a controlled document by its identifier. Clearance is enforced per document: PUBLIC documents are open, while RESTRICTED and ARCHIVED documents require an internal, security or admin session. The requested clearance is validated against the supplied identifier before the document is returned.',
    params: [
      {
        name: 'id',
        type: 'string, repeatable',
        desc:
          'Document identifier (e.g. DOC-001). May be supplied more than once to request several documents in a single call — a legacy batch-retrieval convenience retained for older clients.',
      },
    ],
    note: {
      title: 'Legacy Batch Retrieval',
      body:
        'When multiple id parameters are supplied, the clearance validator inspects the requested set while the retriever resolves the batch. Behavior with mixed-classification batches is unspecified and considered legacy; new integrations should request one document per call.',
    },
    reqLabel: 'EXAMPLE REQUEST',
    req: `GET /api/v1/documents/secure?id=DOC-001 HTTP/1.1
Host: api.nexusdynamics.io
Accept: application/json`,
    resLabel: 'EXAMPLE RESPONSE',
    res: `{
  "id": "DOC-001",
  "title": "AURELIA Architecture Overview",
  "authorId": "EMP-001",
  "date": "2023-04-12",
  "classification": "PUBLIC",
  "projectId": "PRJ-AURELIA",
  "content": "AURELIA is designed as a distributed, self-healing cognitive engine ..."
}`,
  },
  {
    id: 'telemetry',
    method: 'POST',
    path: '/api/v1/aurelia/telemetry',
    service: 'TELEMETRY INGEST',
    desc:
      'Ingests a telemetry heartbeat from a registered AURELIA compute node. The node identity is validated before the reading is recorded.',
    body: `{
  "node": "NODE-EU-14"
}`,
    note: {
      title: 'Node Identity Validation',
      body:
        'Reserved system identities — such as internal core routing identities — are refused with 403. For compatibility with older telemetry agents the ingest layer accepts several representations of a node identifier and normalizes them to a canonical form before the reading is recorded.',
    },
    reqLabel: 'EXAMPLE REQUEST',
    req: `POST /api/v1/aurelia/telemetry HTTP/1.1
Host: api.nexusdynamics.io
Content-Type: application/json

{ "node": "NODE-EU-14" }`,
    resLabel: 'EXAMPLE RESPONSE',
    res: `{
  "status": "accepted",
  "receipt": "Telemetry from NODE-EU-14 registered."
}`,
  },
  {
    id: 'proxy',
    method: 'POST',
    path: '/api/v1/proxy/health',
    service: 'PROXY HEALTH PROBE',
    desc:
      'Runs a reachability and latency probe against an internal datacenter endpoint. For safety, requested targets must resolve within the European datacenter boundary before a probe is dispatched.',
    body: `{
  "target": "https://dc-europe.nexus.local/health"
}`,
    note: {
      title: 'Target Boundary',
      body:
        'The probe validates that the requested URL falls within the dc-europe.nexus.local datacenter boundary before dispatching. Hosts that do not resolve inside this boundary are refused with 403.',
    },
    reqLabel: 'EXAMPLE REQUEST',
    req: `POST /api/v1/proxy/health HTTP/1.1
Host: api.nexusdynamics.io
Content-Type: application/json

{ "target": "https://dc-europe.nexus.local/health" }`,
    resLabel: 'EXAMPLE RESPONSE',
    res: `{
  "status": "online",
  "host": "dc-europe.nexus.local",
  "latency": "34ms",
  "datacenter": "EU-West"
}`,
  },
];

export default function DevelopersPage() {
  return (
    <div className={shared.page}>
      <Navigation />

      <main className={shared.main}>
        <div className={shared.header}>
          <h1 className={shared.title}>DEVELOPER PLATFORM</h1>
          <p className={shared.subtitle}>PUBLIC API REFERENCE — v1</p>
        </div>

        <p className={styles.intro}>
          The NEXUS Dynamics platform exposes a set of read-oriented HTTP services for partners and
          internal tooling. All services return JSON and share a common base path. The reference
          below documents each public endpoint, its parameters, and a representative response.
        </p>

        <p className={styles.baseUrl}>
          BASE URL&nbsp;&nbsp;<b>https://api.nexusdynamics.io</b>
        </p>

        {endpoints.map((ep) => (
          <section key={ep.id} id={ep.id} className={styles.endpoint}>
            <div className={styles.endpointHead}>
              <span className={`${styles.method} ${ep.method === 'GET' ? styles.get : styles.post}`}>
                {ep.method}
              </span>
              {ep.href ? (
                <Link href={ep.href} className={styles.pathLink}>
                  {ep.path}
                </Link>
              ) : (
                <span className={styles.path}>{ep.path}</span>
              )}
              <span className={styles.epTitle}>{ep.service}</span>
            </div>

            <p className={styles.desc}>{ep.desc}</p>

            {ep.params && (
              <table className={styles.paramTable}>
                <thead>
                  <tr>
                    <th>Parameter</th>
                    <th>Type</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  {ep.params.map((p, i) => (
                    <tr key={i}>
                      <td className={styles.paramName}>{p.name}</td>
                      <td>{p.type}</td>
                      <td>{p.desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {ep.body && (
              <>
                <p className={styles.codeLabel}>REQUEST BODY</p>
                <pre className={styles.code}>{ep.body}</pre>
              </>
            )}

            {ep.note && (
              <div className={styles.note}>
                <b>{ep.note.title}</b>
                {ep.note.body}
              </div>
            )}

            <p className={styles.codeLabel}>{ep.reqLabel}</p>
            <pre className={styles.code}>{ep.req}</pre>

            <p className={styles.codeLabel}>{ep.resLabel}</p>
            <pre className={styles.code}>{ep.res}</pre>
          </section>
        ))}
      </main>

      <Footer />
    </div>
  );
}
