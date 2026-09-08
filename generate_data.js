/* eslint-disable */
const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, 'src', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// 1. Departments
const departments = [
  { id: 'DEPT-AI', name: 'Applied AI', headId: 'EMP-001' },
  { id: 'DEPT-SYS', name: 'Core Systems', headId: 'EMP-002' },
  { id: 'DEPT-SEC', name: 'Information Security', headId: 'EMP-004' },
  { id: 'DEPT-RES', name: 'Advanced Research', headId: 'EMP-005' }
];

// 2. Characters / Employees
const characters = [
  {
    id: 'EMP-001',
    name: 'Dr. Evelyn Vance',
    role: 'Chief AI Architect',
    department: 'DEPT-AI',
    bio: 'Lead architect of AURELIA. Pioneer in recursive cognitive modeling.',
    projects: ['PRJ-AURELIA', 'PRJ-COGNITION'],
    publications: ['PUB-001'],
    employmentDate: '2019-03-15'
  },
  {
    id: 'EMP-002',
    name: 'Marcus Chen',
    role: 'VP of Core Systems',
    department: 'DEPT-SYS',
    bio: 'Oversees the global infrastructure network supporting AURELIA deployments.',
    projects: ['PRJ-INFRA-NET'],
    publications: [],
    employmentDate: '2020-08-01'
  },
  {
    id: 'EMP-003',
    name: 'Sarah Ockham',
    role: 'Senior Systems Engineer',
    department: 'DEPT-SYS',
    bio: 'Key contributor to AURELIA memory management and allocation systems.',
    projects: ['PRJ-AURELIA', 'PRJ-MEM-ALLOC'],
    publications: [],
    employmentDate: '2022-11-10'
  },
  {
    id: 'EMP-004',
    name: 'David Aris',
    role: 'Chief Security Officer',
    department: 'DEPT-SEC',
    bio: 'Defines zero-trust architecture for all NEXUS deployments.',
    projects: ['PRJ-ZERO-TRUST'],
    publications: ['PUB-002'],
    employmentDate: '2021-02-20'
  },
  {
    id: 'EMP-005',
    name: 'Dr. Arthur Penhaligon',
    role: 'Director of Advanced Research',
    department: 'DEPT-RES',
    bio: 'Focuses on theoretical boundaries of artificial intelligence. Rarely seen in public operations.',
    projects: ['PRJ-ECHO', 'PRJ-AURELIA-ALPHA'],
    publications: ['PUB-003'],
    employmentDate: '2016-09-01'
  },
  {
    id: 'EMP-006',
    name: 'Elena Rostova',
    role: 'Lead Security Analyst',
    department: 'DEPT-SEC',
    bio: 'Monitors global anomaly detection grids.',
    projects: ['PRJ-ZERO-TRUST'],
    publications: [],
    employmentDate: '2024-01-15'
  },
  {
    id: 'EMP-007',
    name: 'J.T. Halpern',
    role: 'Systems Maintainer',
    department: 'DEPT-SYS',
    bio: 'Maintains legacy subsystems and archival repositories.',
    projects: ['PRJ-ARCHIVE'],
    publications: [],
    employmentDate: '2018-05-05'
  }
];

// 3. Projects
const projects = [
  { id: 'PRJ-AURELIA', name: 'AURELIA Core', status: 'ACTIVE', leadId: 'EMP-001', repoId: 'REPO-AURELIA-CORE' },
  { id: 'PRJ-COGNITION', name: 'Recursive Cognition', status: 'ACTIVE', leadId: 'EMP-001', repoId: 'REPO-COG-MODELS' },
  { id: 'PRJ-INFRA-NET', name: 'Global Nexus Grid', status: 'ACTIVE', leadId: 'EMP-002', repoId: 'REPO-INFRA' },
  { id: 'PRJ-MEM-ALLOC', name: 'Dynamic Memory Allocator', status: 'ACTIVE', leadId: 'EMP-003', repoId: 'REPO-MEM' },
  { id: 'PRJ-ZERO-TRUST', name: 'Zero-Trust Protocol', status: 'ACTIVE', leadId: 'EMP-004', repoId: 'REPO-SEC-PROTO' },
  { id: 'PRJ-ECHO', name: 'Project ECHO', status: 'ARCHIVED', leadId: 'EMP-005', repoId: 'REPO-ECHO' },
  { id: 'PRJ-ARCHIVE', name: 'System Archives', status: 'MAINTENANCE', leadId: 'EMP-007', repoId: 'REPO-ARCHIVE' }
];

// 4. Timeline
const timeline = [
  { id: 'TL-001', year: '2015', event: 'NEXUS Dynamics founded to pursue next-generation computing infrastructure.', type: 'COMPANY' },
  { id: 'TL-002', year: '2016', event: 'Advanced Research division established by Dr. Arthur Penhaligon.', type: 'RESEARCH' },
  { id: 'TL-003', year: '2018', event: 'First prototype of autonomous resource allocation grid deployed.', type: 'PRODUCT' },
  { id: 'TL-004', year: '2019', event: 'Dr. Evelyn Vance joins as Chief AI Architect; conceptualization of AURELIA begins.', type: 'PERSONNEL' },
  { id: 'TL-005', year: '2021', event: 'AURELIA Alpha testing phase initiated internally.', type: 'PRODUCT' },
  { id: 'TL-006', year: '2023', event: 'AURELIA v1.0 officially launched for enterprise infrastructure management.', type: 'PRODUCT' },
  { id: 'TL-007', year: '2024', event: 'AURELIA v2.0 global deployment across 42 datacenters.', type: 'PRODUCT' },
  { id: 'TL-008', year: '2025', event: 'Security overhaul following minor anomaly in routing logic. Zero-Trust protocol enforced.', type: 'SECURITY' },
  { id: 'TL-009', year: '2026', event: 'AURELIA v3.2 operates at peak efficiency. (Present Day)', type: 'COMPANY' }
];

// 5. Documents
const documents = [
  { id: 'DOC-001', title: 'AURELIA Architecture Overview', authorId: 'EMP-001', date: '2023-04-12', classification: 'PUBLIC', projectId: 'PRJ-AURELIA', content: 'AURELIA is designed as a distributed, self-healing cognitive engine capable of managing enterprise-scale infrastructure. Its core relies on recursive learning loops.' },
  { id: 'DOC-002', title: 'Zero-Trust Implementation Guidelines', authorId: 'EMP-004', date: '2025-08-20', classification: 'INTERNAL', projectId: 'PRJ-ZERO-TRUST', content: 'All inter-node communications within the Nexus Grid must be authenticated. No implicit trust is granted to processes, even those spawned by AURELIA Core.' },
  { id: 'DOC-003', title: 'Memory Allocation Anomaly Report', authorId: 'EMP-003', date: '2026-02-15', classification: 'RESTRICTED', projectId: 'PRJ-MEM-ALLOC', content: 'We are seeing occasional memory spikes in isolated sectors. The allocator is reserving blocks for a process identifier that does not map to any known AURELIA subsystem. Investigating.' },
  { id: 'DOC-004', title: 'Project ECHO - Final Summary', authorId: 'EMP-005', date: '2018-11-30', classification: 'ARCHIVED', projectId: 'PRJ-ECHO', content: 'Project ECHO has reached its theoretical limits. The cognitive resonance models demonstrated emergent behavior that could not be adequately constrained. Project suspended indefinitely. All assets moved to cold storage.' }
];

// 6. Repositories
const repositories = [
  {
    id: 'REPO-AURELIA-CORE',
    name: 'aurelia-core',
    description: 'Main engine for the AURELIA platform',
    ownerId: 'EMP-001',
    isPublic: true,
    commits: [
      { hash: 'a1b2c3d', author: 'E. Vance', date: '2026-09-01', message: 'Optimize cognitive loop latency', filesChanged: 3 },
      { hash: 'e4f5g6h', author: 'S. Ockham', date: '2026-08-28', message: 'Update memory boundary checks', filesChanged: 2 },
      { hash: 'j7k8l9m', author: 'SYSTEM', date: '2026-08-20', message: 'Automated dependency update', filesChanged: 15 }
    ]
  },
  {
    id: 'REPO-ECHO',
    name: 'echo-legacy',
    description: 'Archived theoretical models',
    ownerId: 'EMP-005',
    isPublic: false,
    commits: [
      { hash: '999ffff', author: 'A. Penhaligon', date: '2018-11-30', message: 'Final commit before suspension. Halting main process.', filesChanged: 1 },
      { hash: '888eeee', author: 'A. Penhaligon', date: '2018-11-29', message: 'Attempting to isolate anomalous thread spawn.', filesChanged: 4 }
    ]
  }
];

// 7. Systems & Incidents
const systems = [
  { id: 'SYS-AURELIA', name: 'AURELIA CORE', status: 'OPERATIONAL', region: 'GLOBAL' },
  { id: 'SYS-GRID', name: 'NEXUS GRID', status: 'OPERATIONAL', region: 'GLOBAL' },
  { id: 'SYS-ARCHIVE', name: 'COLD STORAGE ARCHIVE', status: 'RESTRICTED', region: 'OFF-SITE' }
];

const incidents = [
  { id: 'INC-2025-01', systemId: 'SYS-GRID', date: '2025-08-10', severity: 'MEDIUM', description: 'Unauthorized routing deviation detected. Resolved via Zero-Trust enforcement.' }
];

// Write all to JSON files
const writeJson = (filename, data) => fs.writeFileSync(path.join(dataDir, filename), JSON.stringify(data, null, 2));

writeJson('departments.json', departments);
writeJson('characters.json', characters);
writeJson('projects.json', projects);
writeJson('timeline.json', timeline);
writeJson('documents.json', documents);
writeJson('repositories.json', repositories);
writeJson('systems.json', systems);
writeJson('incidents.json', incidents);

console.log('Data generation complete.');
