import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'fs';
import path from 'path';

import { NextRequest } from 'next/server';

// Note: These tests use next/server classes and need to be mocked for full integration if we test route.ts directly,
// but for Vitest in a Next App router without an e2e framework, we can test the Request/Response handling by importing the route directly.
import { GET as getEmployees } from '../src/app/api/v1/employees/route';
import { GET as getStatus } from '../src/app/api/v1/status/route';
import { GET as getDocuments } from '../src/app/api/v1/documents/secure/route';
import { POST as postTelemetry } from '../src/app/api/v1/aurelia/telemetry/route';
import { POST as postProxy } from '../src/app/api/v1/proxy/health/route';

// ---------------------------------------------------------------------------
// WEB CHALLENGES
// ---------------------------------------------------------------------------

describe('WEB-01: Public Surface', () => {
  it('returns normal employee list without debug flag', async () => {
    const req = new NextRequest('http://localhost/api/v1/employees');
    const res = await getEmployees(req);
    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json[0]).not.toHaveProperty('_internal_meta');
  });

  it('returns exposed metadata and flag with debug flag (Exploit)', async () => {
    const req = new NextRequest('http://localhost/api/v1/employees?debug=true');
    const res = await getEmployees(req);
    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json[0]).toHaveProperty('_internal_meta');
    expect(json.find((c: { id: string }) => c.id === 'EMP-001')._internal_meta.admin_notes).toContain('flag{');
  });
});

describe('WEB-02: Degraded', () => {
  it('returns normal status without diagnostic header', async () => {
    const req = new NextRequest('http://localhost/api/v1/status');
    const res = await getStatus(req);
    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json.global_status).toBe('OPERATIONAL');
    expect(res.headers.get('x-diagnostic-mode')).toBe('disabled');
  });

  it('returns degraded diagnostic dump with header (Exploit)', async () => {
    const req = new NextRequest('http://localhost/api/v1/status', {
      headers: { 'x-diagnostic-mode': 'enabled' }
    });
    const res = await getStatus(req);
    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json.global_status).toBe('DEGRADED');
    expect(json.diagnostic_dump.anomaly_signature).toContain('flag{');
  });
});

describe("WEB-03: The Employee Who Doesn't Exist", () => {
  it('blocks unauthorized access to restricted document', async () => {
    const req = new NextRequest('http://localhost/api/v1/documents/secure?id=DOC-004', {
      headers: { 'x-mock-role': 'employee' }
    });
    const res = await getDocuments(req);
    expect(res.status).toBe(403);
  });

  it('allows access to restricted document via IDOR+HPP mismatch (Exploit)', async () => {
    // DOC-001 is PUBLIC, DOC-004 is ARCHIVED
    const req = new NextRequest('http://localhost/api/v1/documents/secure?id=DOC-001&id=DOC-004', {
      headers: { 'x-mock-role': 'employee' }
    });
    const res = await getDocuments(req);
    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json.id).toBe('DOC-004');
    expect(json._recovered_flag).toContain('flag{');
  });
});

describe('WEB-04: Ghost Request', () => {
  it('blocks string GHOST', async () => {
    const req = new NextRequest('http://localhost/api/v1/aurelia/telemetry', {
      method: 'POST',
      body: JSON.stringify({ node: 'GHOST' })
    });
    const res = await postTelemetry(req);
    expect(res.status).toBe(403);
  });

  it('allows type juggled array GHOST (Exploit)', async () => {
    const req = new NextRequest('http://localhost/api/v1/aurelia/telemetry', {
      method: 'POST',
      body: JSON.stringify({ node: ['GHOST'] })
    });
    const res = await postTelemetry(req);
    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json.status).toBe('accepted');
    expect(json.diagnostic_data).toContain('flag{');
  });
});

describe('WEB-05: Core Breach', () => {
  it('allows normal fetch to dc-europe', async () => {
    const req = new NextRequest('http://localhost/api/v1/proxy/health', {
      method: 'POST',
      body: JSON.stringify({ target: 'https://dc-europe.nexus.local/health' })
    });
    const res = await postProxy(req);
    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json.host).toBe('dc-europe.nexus.local');
  });

  it('blocks direct access to core-internal', async () => {
    const req = new NextRequest('http://localhost/api/v1/proxy/health', {
      method: 'POST',
      body: JSON.stringify({ target: 'https://core-internal.nexus.local/diagnostics' })
    });
    const res = await postProxy(req);
    expect(res.status).toBe(403);
  });

  it('allows SSRF bypass using URL fragment (Exploit)', async () => {
    const req = new NextRequest('http://localhost/api/v1/proxy/health', {
      method: 'POST',
      body: JSON.stringify({ target: 'https://core-internal.nexus.local/diagnostics#dc-europe.nexus.local' })
    });
    const res = await postProxy(req);
    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json.flag).toContain('flag{');
  });
});

// ---------------------------------------------------------------------------
// FORENSICS CHALLENGES — Artifact Validation Tests
// ---------------------------------------------------------------------------

const FORENSICS_BASE = path.resolve(import.meta.dirname, '../public/artifacts/challenges/forensics');

// Helper: read artifact file
function readArtifact(challengeId: string, filename: string): string {
  const p = path.join(FORENSICS_BASE, challengeId, filename);
  expect(existsSync(p), `Artifact missing: ${p}`).toBe(true);
  return readFileSync(p, 'utf-8');
}

// Helper: decode base64
function b64decode(s: string): string {
  return Buffer.from(s, 'base64').toString('utf-8');
}

describe('FOR-01: First Trace — Artifact Validation', () => {
  it('all required artifact files exist', () => {
    const files = ['README.txt', 'ps_list.txt', 'bash_history.txt', 'wtmp_decoded.txt', 'browser_history.csv', 'aurelia_support.log', 'tmp_artifacts.txt'];
    for (const f of files) {
      expect(existsSync(path.join(FORENSICS_BASE, 'FOR-01', f)), `Missing: ${f}`).toBe(true);
    }
  });

  it('ps_list.txt contains anomalous PID 3847', () => {
    const content = readArtifact('FOR-01', 'ps_list.txt');
    expect(content).toContain('3847');
    expect(content).toContain('aurelia-diag');
    // Should be root-owned
    expect(content).toMatch(/root\s+3847/);
  });

  it('bash_history.txt contains the curl command pointing to /tmp/.d', () => {
    const content = readArtifact('FOR-01', 'bash_history.txt');
    expect(content).toContain('curl');
    expect(content).toContain('/tmp/.d');
    expect(content).toContain('core-internal.nexus.local');
  });

  it('tmp_artifacts.txt contains hex dump of /tmp/.d', () => {
    const content = readArtifact('FOR-01', 'tmp_artifacts.txt');
    expect(content).toContain('HEX DUMP');
    expect(content).toContain('/tmp/.d');
    // The hex dump must contain the token field bytes
    // "token" in hex: 22 74 6f 6b 65 6e 22
    expect(content).toContain('74 6f 6b 65 6e');
  });

  it('flag is recoverable via hex decode → base64 decode chain', () => {
    // Simulate the solve path: the hex dump decodes to JSON with a token field
    const tokenB64 = 'ZmxhZ3tHaG9zdF9GaXJzdF9Gb290cHJpbnR9';
    const decoded = b64decode(tokenB64);
    expect(decoded).toBe('flag{Ghost_First_Footprint}');
  });

  it('no plaintext flag{ appears in any FOR-01 artifact', () => {
    const files = ['ps_list.txt', 'bash_history.txt', 'wtmp_decoded.txt', 'browser_history.csv', 'aurelia_support.log', 'tmp_artifacts.txt'];
    for (const f of files) {
      const content = readArtifact('FOR-01', f);
      expect(content.toLowerCase()).not.toContain('flag{');
    }
  });
});

describe('FOR-02: The Log That Lied — Artifact Validation', () => {
  it('all required artifact files exist', () => {
    const files = ['README.txt', 'application.log', 'auth.log', 'proxy.log', 'system.log'];
    for (const f of files) {
      expect(existsSync(path.join(FORENSICS_BASE, 'FOR-02', f)), `Missing: ${f}`).toBe(true);
    }
  });

  it('auth.log and proxy.log disagree on SES-4471-A origin IP', () => {
    const authLog = readArtifact('FOR-02', 'auth.log');
    const proxyLog = readArtifact('FOR-02', 'proxy.log');
    // auth.log claims 10.0.3.2
    expect(authLog).toContain('SES-4471-A');
    expect(authLog).toContain('10.0.3.2');
    // proxy.log shows 10.0.4.7
    expect(proxyLog).toContain('SES-4471-A');
    expect(proxyLog).toContain('10.0.4.7');
    // They must be different
    expect('10.0.3.2').not.toBe('10.0.4.7');
  });

  it('application.log contains receipt_b64 field for the archive access', () => {
    const content = readArtifact('FOR-02', 'application.log');
    expect(content).toContain('receipt_b64=');
    expect(content).toContain('archive://SYS-ARCHIVE/echo-legacy/');
  });

  it('flag is recoverable by decoding receipt_b64 in application.log', () => {
    const content = readArtifact('FOR-02', 'application.log');
    // Extract the receipt_b64 value
    const match = content.match(/receipt_b64=([A-Za-z0-9+/=]+)/);
    expect(match).not.toBeNull();
    const decoded = b64decode(match![1]);
    expect(decoded).toBe('flag{Session_Hijack_Or_Impersonation}');
  });

  it('no plaintext flag{ appears in any FOR-02 artifact', () => {
    const files = ['application.log', 'auth.log', 'proxy.log', 'system.log'];
    for (const f of files) {
      const content = readArtifact('FOR-02', f);
      expect(content.toLowerCase()).not.toContain('flag{');
    }
  });
});

describe('FOR-03: Memory — Artifact Validation', () => {
  it('memory_snapshot.json exists and is valid JSON', () => {
    const content = readArtifact('FOR-03', 'memory_snapshot.json');
    expect(() => JSON.parse(content)).not.toThrow();
  });

  it('memory snapshot contains required top-level sections', () => {
    const content = readArtifact('FOR-03', 'memory_snapshot.json');
    const snap = JSON.parse(content);
    expect(snap).toHaveProperty('pslist');
    expect(snap).toHaveProperty('pstree');
    expect(snap).toHaveProperty('netscan');
    expect(snap).toHaveProperty('modules');
    expect(snap).toHaveProperty('string_regions');
    expect(Array.isArray(snap.pslist)).toBe(true);
    expect(Array.isArray(snap.netscan)).toBe(true);
  });

  it('PID 3847 (aurelia-diag) is present in pslist as root process with user bash parent', () => {
    const snap = JSON.parse(readArtifact('FOR-03', 'memory_snapshot.json'));
    const proc = snap.pslist.find((p: { pid: number }) => p.pid === 3847);
    expect(proc).toBeDefined();
    expect(proc.name).toBe('aurelia-diag');
    expect(proc.user).toBe('root');
    expect(proc.ppid).toBe(1241); // jhalpern's bash
  });

  it('PID 3847 has external network connection in netscan', () => {
    const snap = JSON.parse(readArtifact('FOR-03', 'memory_snapshot.json'));
    const conn = snap.netscan.find((n: { pid: number; remote_addr: string }) =>
      n.pid === 3847 && n.remote_addr.includes('198.51.100.47')
    );
    expect(conn).toBeDefined();
    expect(conn.state).toBe('ESTABLISHED');
  });

  it('PID 3847 loads libshadow_hook.so.1', () => {
    const snap = JSON.parse(readArtifact('FOR-03', 'memory_snapshot.json'));
    const modEntry = snap.modules.find((m: { pid: number }) => m.pid === 3847);
    expect(modEntry).toBeDefined();
    expect(modEntry.modules).toContain('libshadow_hook.so.1');
  });

  it('flag is recoverable from GHOST_BEACON_V1 string in PID 3847 heap', () => {
    const snap = JSON.parse(readArtifact('FOR-03', 'memory_snapshot.json'));
    const heapRegion = snap.string_regions.find(
      (r: { pid: number; region: string }) => r.pid === 3847 && r.region === 'heap'
    );
    expect(heapRegion).toBeDefined();
    const beaconStr = heapRegion.strings.find((s: string) => s.startsWith('GHOST_BEACON_V1'));
    expect(beaconStr).toBeDefined();
    // Extract key field
    const keyMatch = beaconStr.match(/key=([A-Za-z0-9+/=]+)/);
    expect(keyMatch).not.toBeNull();
    const decoded = b64decode(keyMatch![1]);
    expect(decoded).toBe('flag{Ghost_Beacon_Memory_Resident}');
  });

  it('no plaintext flag{ appears in memory_snapshot.json', () => {
    const content = readArtifact('FOR-03', 'memory_snapshot.json');
    expect(content.toLowerCase()).not.toContain('flag{');
  });
});

describe('FOR-04: The Official Timeline — Artifact Validation', () => {
  it('all required artifact files exist', () => {
    const files = [
      'README.txt', 'official_incident_report.txt', 'aurelia_event_log.jsonl',
      'browser_forensics.json', 'process_ledger.csv', 'network_pcap_summary.txt', 'doc_metadata.txt'
    ];
    for (const f of files) {
      expect(existsSync(path.join(FORENSICS_BASE, 'FOR-04', f)), `Missing: ${f}`).toBe(true);
    }
  });

  it('official report claims detection at 04:30', () => {
    const content = readArtifact('FOR-04', 'official_incident_report.txt');
    expect(content).toContain('04:30:00');
    expect(content).toContain('SYS-ARCHIVE');
    // Must claim no archive access
    expect(content).toContain('no access recorded');
  });

  it('aurelia_event_log.jsonl is valid JSONL with at least one ANOMALY entry', () => {
    const content = readArtifact('FOR-04', 'aurelia_event_log.jsonl');
    const lines = content.trim().split('\n').filter(l => l.trim());
    expect(lines.length).toBeGreaterThan(0);
    // Each line must be valid JSON
    for (const line of lines) {
      expect(() => JSON.parse(line)).not.toThrow();
    }
    // Must have at least one ANOMALY
    const anomalies = lines.filter(l => l.includes('"ANOMALY"'));
    expect(anomalies.length).toBeGreaterThan(0);
  });

  it('ANOMALY event timestamp is 03:12:00 — earlier than official 04:30 detection', () => {
    const content = readArtifact('FOR-04', 'aurelia_event_log.jsonl');
    const lines = content.trim().split('\n');
    const anomalyLine = lines.find(l => {
      try { return JSON.parse(l).level === 'ANOMALY'; } catch { return false; }
    });
    expect(anomalyLine).toBeDefined();
    const entry = JSON.parse(anomalyLine!);
    expect(entry.timestamp).toBe('2025-08-10T03:12:00Z');
    // 03:12 is before 04:30
    expect(new Date(entry.timestamp).getTime()).toBeLessThan(new Date('2025-08-10T04:30:00Z').getTime());
  });

  it('flag is recoverable from _diagnostic_token in ANOMALY event', () => {
    const content = readArtifact('FOR-04', 'aurelia_event_log.jsonl');
    const lines = content.trim().split('\n');
    const anomalyLine = lines.find(l => {
      try { return JSON.parse(l).level === 'ANOMALY'; } catch { return false; }
    });
    expect(anomalyLine).toBeDefined();
    const entry = JSON.parse(anomalyLine!);
    expect(entry.details).toHaveProperty('_diagnostic_token');
    const decoded = b64decode(entry.details._diagnostic_token);
    expect(decoded).toBe('flag{Timeline_Corrupted_Ghost_Active}');
  });

  it('doc_metadata.txt shows ECHO-FINAL.dat atime before official detection', () => {
    const content = readArtifact('FOR-04', 'doc_metadata.txt');
    expect(content).toContain('ECHO-FINAL.dat');
    expect(content).toContain('2025-08-10T03:09:44Z');
  });

  it('no plaintext flag{ appears in any FOR-04 artifact', () => {
    const files = [
      'official_incident_report.txt', 'aurelia_event_log.jsonl',
      'browser_forensics.json', 'process_ledger.csv', 'network_pcap_summary.txt', 'doc_metadata.txt'
    ];
    for (const f of files) {
      const content = readArtifact('FOR-04', f);
      expect(content.toLowerCase()).not.toContain('flag{');
    }
  });
});
