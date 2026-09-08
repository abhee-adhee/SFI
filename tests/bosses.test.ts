import { describe, it, expect } from 'vitest';
import { existsSync } from 'fs';
import { execSync } from 'child_process';
import path from 'path';

import bossesManifest from '../src/data/challenges/bosses.json';
import { getFlag } from '../src/lib/secrets';

const baseDir = path.join(process.cwd(), 'public', 'artifacts', 'challenges', 'bosses');

describe('Boss Challenges Validation Suite', { timeout: 20000 }, () => {

  it('manifest contains exactly 2 boss challenges', () => {
    expect(bossesManifest.length).toBe(2);
    expect(bossesManifest.map(c => c.id)).toEqual(['BOSS-01', 'BOSS-02']);
  });

  describe('BOSS-01: AURELIA CORE', () => {
    const binPath = path.join(baseDir, 'BOSS-01', 'core_diagnostic');

    it('artifacts exist', () => {
      expect(existsSync(binPath)).toBe(true);
      expect(existsSync(path.join(baseDir, 'BOSS-01', 'README.txt'))).toBe(true);
    });

    it('core_diagnostic binary execution generates state token', () => {
      const out = execSync(`wsl bash -c "/mnt/d/SFI/nexus/public/artifacts/challenges/bosses/BOSS-01/core_diagnostic '2025-10-14T08:00:00Z' 'AURELIA-CORE-V4'"`).toString();
      expect(out).toContain('8d2efcc213b3f8f35e859b62c458744399be773f9d1632585c51d6721d6a0d0c');
    });

    it('secrets.ts flag matches expected', () => {
      expect(getFlag('BOSS-01')).toBe('flag{Aurelia_Core_Diagnostic_State_Reconstructed}');
    });
  });

  describe('BOSS-02: GHOST', () => {
    const binPath = path.join(baseDir, 'BOSS-02', 'ghost_handshake');

    it('artifacts exist', () => {
      expect(existsSync(binPath)).toBe(true);
      expect(existsSync(path.join(baseDir, 'BOSS-02', 'README.txt'))).toBe(true);
    });

    it('Route A evidence convergence handshake binary generates token', () => {
      const out = execSync(`wsl bash -c "/mnt/d/SFI/nexus/public/artifacts/challenges/bosses/BOSS-02/ghost_handshake RouteA 2015 ECHO-SUB-01 GHOST-BEACON-09"`).toString();
      expect(out).toContain('111c7da385284a74ac2c7235907450266f4e72050f82a227b8e8a433d7aaaa9d');
    });

    it('Route B evidence convergence handshake binary generates token', () => {
      const out = execSync(`wsl bash -c "/mnt/d/SFI/nexus/public/artifacts/challenges/bosses/BOSS-02/ghost_handshake RouteB SHARED_PRIME_P AURA-9921-ECHO-8842 GHOST-BEACON-09"`).toString();
      expect(out).toContain('aa2fa835c67884bed8983d7975ea6333551a7b25d0cd67564f736e5a917f86ec');
    });

    it('Route C evidence convergence handshake binary generates token', () => {
      const out = execSync(`wsl bash -c "/mnt/d/SFI/nexus/public/artifacts/challenges/bosses/BOSS-02/ghost_handshake RouteC 'NXS\\x01' REC-GHOST-99 AURA-9921-ECHO-8842"`).toString();
      expect(out).toContain('be1b90316a79ca04602b33bc9e847fe8b8d45d2ceb4b7df6ce223356ae7caa0e');
    });

    it('secrets.ts flag matches expected', () => {
      expect(getFlag('BOSS-02')).toBe('flag{Ghost_Organic_Architectural_Origin_Revealed}');
    });
  });

  describe('Security Audit', () => {
    it('no raw plaintext flags in bosses.json manifest', () => {
      const manifestStr = JSON.stringify(bossesManifest).toLowerCase();
      expect(manifestStr).not.toContain('flag{aurelia_core');
      expect(manifestStr).not.toContain('flag{ghost_organic');
    });
  });
});
