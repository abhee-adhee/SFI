import { describe, it, expect } from 'vitest';

// For static data tests, we just import the JSON files
import publications from '../src/data/publications.json';
import advisories from '../src/data/advisories.json';
import documents from '../src/data/documents.json';
import repositories from '../src/data/repositories.json';
import characters from '../src/data/characters.json';
import osintManifest from '../src/data/challenges/osint.json';
import { getFlag } from '../src/lib/secrets';

describe('OSINT Challenges Validation', () => {
  it('manifest contains exact 4 challenges', () => {
    expect(osintManifest.length).toBe(4);
    expect(osintManifest.map(c => c.id)).toEqual(['OSINT-01', 'OSINT-02', 'OSINT-03', 'OSINT-04']);
  });

  describe('OSINT-01: NEXUS PUBLIC', () => {
    it('DOC-005 exists and points to legacy repo', () => {
      const doc = documents.find(d => d.id === 'DOC-005');
      expect(doc).toBeDefined();
      expect(doc?.content).toContain('nexus-foundation');
    });

    it('REPO-OPEN-01 exists, is public, and contains the flag reference', () => {
      const repo = repositories.find(r => r.id === 'REPO-OPEN-01');
      expect(repo).toBeDefined();
      expect(repo?.isPublic).toBe(true);
      
      const commit = repo?.commits.find(c => c.message.includes('_flagRef_OSINT-01'));
      expect(commit).toBeDefined();
      
      // Verify flag decoding
      const decodedFlag = getFlag('OSINT-01');
      expect(decodedFlag).toBe('flag{Nexus_Public_Records_OSINT}');
    });
  });

  describe('OSINT-02: THE MISSING RESEARCHER', () => {
    it('EMP-005 exists and references PUB-003', () => {
      const emp = characters.find(c => c.id === 'EMP-005');
      expect(emp).toBeDefined();
      expect(emp?.publications).toContain('PUB-003');
    });

    it('PUB-003 is retracted and points to DOC-006', () => {
      const pub = publications.find(p => p.id === 'PUB-003');
      expect(pub).toBeDefined();
      expect(pub?.status).toBe('RETRACTED');
      expect(pub?.retractionNote).toContain('DOC-006');
    });

    it('DOC-006 exists and contains the flag reference', () => {
      const doc = documents.find(d => d.id === 'DOC-006');
      expect(doc).toBeDefined();
      expect(doc?.content).toContain('_flagRef_OSINT-02');
      
      // Verify flag decoding
      const decodedFlag = getFlag('OSINT-02');
      expect(decodedFlag).toBe('flag{Penhaligon_Retracted_Research}');
    });
  });

  describe('OSINT-03: PROJECT AURELIA', () => {
    it('EMP-001 exists and references PUB-001', () => {
      const emp = characters.find(c => c.id === 'EMP-001');
      expect(emp).toBeDefined();
      expect(emp?.publications).toContain('PUB-001');
    });

    it('PUB-001 exists and mentions AURELIA-CORE initial commit', () => {
      const pub = publications.find(p => p.id === 'PUB-001');
      expect(pub).toBeDefined();
      expect(pub?.abstract).toContain('AURELIA-CORE commit');
    });

    it('REPO-AURELIA-CORE contains early commit with flag reference', () => {
      const repo = repositories.find(r => r.id === 'REPO-AURELIA-CORE');
      expect(repo).toBeDefined();
      
      const commit = repo?.commits.find(c => c.hash === '000aaaa');
      expect(commit).toBeDefined();
      expect(commit?.date).toBe('2019-05-01');
      expect(commit?.message).toContain('_flagRef_OSINT-03');
      
      // Verify flag decoding
      const decodedFlag = getFlag('OSINT-03');
      expect(decodedFlag).toBe('flag{Aurelia_Echo_Evolution}');
    });
  });

  describe('OSINT-04: WHO BUILT GHOST?', () => {
    it('PUB-004 identifies Ghost-patterns and links to ADV-2018-01', () => {
      const pub = publications.find(p => p.id === 'PUB-004');
      expect(pub).toBeDefined();
      expect(pub?.abstract).toContain('Ghost-patterns');
      expect(pub?.abstract).toContain('ADV-2018-01');
    });

    it('ADV-2018-01 exists, is CRITICAL, and points to REPO-MAINTENANCE', () => {
      const adv = advisories.find(a => a.id === 'ADV-2018-01');
      expect(adv).toBeDefined();
      expect(adv?.severity).toBe('CRITICAL');
      expect(adv?.description).toContain('REPO-MAINTENANCE');
    });

    it('REPO-MAINTENANCE contains the containment failure flag reference', () => {
      const repo = repositories.find(r => r.id === 'REPO-MAINTENANCE');
      expect(repo).toBeDefined();
      expect(repo?.isPublic).toBe(true);
      
      const commit = repo?.commits.find(c => c.message.includes('_flagRef_OSINT-04'));
      expect(commit).toBeDefined();
      
      // Verify flag decoding
      const decodedFlag = getFlag('OSINT-04');
      expect(decodedFlag).toBe('flag{Ghost_Origin_Precedes_Aurelia}');
    });
  });

  describe('Security and Consistency', () => {
    it('no plaintext flags in raw JSON files', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const checkNoFlag = (jsonObj: any) => {
        const str = JSON.stringify(jsonObj).toLowerCase();
        expect(str).not.toContain('flag{');
      };
      
      checkNoFlag(publications);
      checkNoFlag(advisories);
      checkNoFlag(documents);
      checkNoFlag(repositories);
      checkNoFlag(characters);
    });
  });
});
