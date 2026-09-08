import { describe, it, expect } from 'vitest';
import { existsSync, statSync } from 'fs';
import { execSync } from 'child_process';
import path from 'path';

import reverseManifest from '../src/data/challenges/reverse.json';
import { getFlag } from '../src/lib/secrets';

const baseDir = path.join(process.cwd(), 'public', 'artifacts', 'challenges', 'reverse');

// Run a binary in WSL and return its stdout (captures both success and failure)
function runBinary(binRelPath: string, args: string[]): string {
  const wslPath = '/mnt/d/SFI/nexus/' + binRelPath.replace(/\\/g, '/');
  const quotedArgs = args.map(a => `'${a.replace(/'/g, "'\\''")}'`).join(' ');
  const cmd = args.length > 0
    ? `wsl bash -c "${wslPath} ${quotedArgs} 2>&1; true"`
    : `wsl bash -c "${wslPath} 2>&1; true"`;
  try {
    const out = execSync(cmd, { timeout: 10000 });
    return out.toString();
  } catch (e: unknown) {
    if (e && typeof e === 'object' && 'stdout' in e) {
      return Buffer.isBuffer((e as { stdout: unknown }).stdout)
        ? (e as { stdout: Buffer }).stdout.toString()
        : String((e as { stdout: unknown }).stdout);
    }
    return '';
  }
}

// Scan for raw flag text in binary via strings
function stringsOutput(binRelPath: string): string {
  const wslPath = '/mnt/d/SFI/nexus/' + binRelPath.replace(/\\/g, '/');
  try {
    return execSync(`wsl bash -c "strings ${wslPath}"`, { timeout: 5000 }).toString();
  } catch {
    return '';
  }
}

describe('Reverse Engineering Challenges Validation Suite', { timeout: 20000 }, () => {

  it('manifest contains exactly 4 challenges', () => {
    expect(reverseManifest.length).toBe(4);
    expect(reverseManifest.map(c => c.id)).toEqual(['REV-01', 'REV-02', 'REV-03', 'REV-04']);
  });

  describe('REV-01: THE PROCESS (process_triage)', () => {
    const binPath = path.join(baseDir, 'REV-01', 'process_triage');
    const relBin = 'public/artifacts/challenges/reverse/REV-01/process_triage';

    it('binary exists and is executable', () => {
      expect(existsSync(binPath)).toBe(true);
      expect(existsSync(path.join(baseDir, 'REV-01', 'README.txt'))).toBe(true);
      const st = statSync(binPath);
      expect(st.size).toBeGreaterThan(1000);
    });

    it('correct input produces flag output', () => {
      const out = runBinary(relBin, ['NX-7701-TRIAGE']);
      expect(out).toContain('flag{Control_Flow_Triage_NEXUS}');
    });

    it('wrong input does not produce flag output', () => {
      const out = runBinary(relBin, ['NX-0000-TRIAGE']);
      expect(out).not.toContain('flag{Control_Flow_Triage_NEXUS}');
    });

    it('flag is not visible in strings output', () => {
      const s = stringsOutput(relBin);
      expect(s).not.toContain('flag{Control_Flow_Triage_NEXUS}');
    });

    it('secrets.ts flag matches expected', () => {
      expect(getFlag('REV-01')).toBe('flag{Control_Flow_Triage_NEXUS}');
    });
  });

  describe('REV-02: GHOST.EXE (ghost_loader)', () => {
    const binPath = path.join(baseDir, 'REV-02', 'ghost_loader');
    const relBin = 'public/artifacts/challenges/reverse/REV-02/ghost_loader';

    it('binary exists and is executable', () => {
      expect(existsSync(binPath)).toBe(true);
      expect(existsSync(path.join(baseDir, 'REV-02', 'README.txt'))).toBe(true);
      const st = statSync(binPath);
      expect(st.size).toBeGreaterThan(1000);
    });

    it('rolling XOR key recovery algorithm produces correct key', () => {
      // Reconstruct expected_key_enc via rolling XOR
      const key = 'ECHO-GHOST-2018';
      const enc = Array.from(key).map((c, i) => (c.charCodeAt(0) ^ (0x5A + i * 7)) & 0xFF);

      // Reverse: XOR back to recover original key
      const recovered = enc.map((b, i) => String.fromCharCode(b ^ ((0x5A + i * 7) & 0xFF))).join('');
      expect(recovered).toBe('ECHO-GHOST-2018');
    });

    it('correct key produces flag in output', () => {
      const out = runBinary(relBin, ['ECHO-GHOST-2018']);
      expect(out).toContain('flag{Rolling_XOR_State_Transformation}');
    });

    it('wrong key does not produce flag in output', () => {
      const out = runBinary(relBin, ['WRONG-KEY-12345']);
      expect(out).not.toContain('flag{Rolling_XOR_State_Transformation}');
    });

    it('flag is not visible in strings output', () => {
      const s = stringsOutput(relBin);
      expect(s).not.toContain('flag{Rolling_XOR_State_Transformation}');
    });

    it('secrets.ts flag matches expected', () => {
      expect(getFlag('REV-02')).toBe('flag{Rolling_XOR_State_Transformation}');
    });
  });

  describe('REV-03: AURELIA MODULE (aurelia_validator)', () => {
    const binPath = path.join(baseDir, 'REV-03', 'aurelia_validator');
    const relBin = 'public/artifacts/challenges/reverse/REV-03/aurelia_validator';

    it('binary exists and is executable', () => {
      expect(existsSync(binPath)).toBe(true);
      expect(existsSync(path.join(baseDir, 'REV-03', 'README.txt'))).toBe(true);
      const st = statSync(binPath);
      expect(st.size).toBeGreaterThan(1000);
    });

    it('bitwise rotation+XOR inversion algorithm recovers correct license', () => {
      // Forward transform: rot3l then XOR
      const key = 'AURA-9921-ECHO-8842';
      const target = Array.from(key).map((c, i) => {
        const val = c.charCodeAt(0) & 0xFF;
        const rot = ((val << 3) | (val >> 5)) & 0xFF;
        return rot ^ ((i * 13 + 0x47) & 0xFF);
      });

      // Inversion: XOR then rot3r
      const recovered = target.map((b, i) => {
        const rot = b ^ ((i * 13 + 0x47) & 0xFF);
        const c = ((rot >> 3) | (rot << 5)) & 0xFF;
        return String.fromCharCode(c);
      }).join('');

      expect(recovered).toBe('AURA-9921-ECHO-8842');
    });

    it('correct license produces flag in output', () => {
      const out = runBinary(relBin, ['AURA-9921-ECHO-8842']);
      expect(out).toContain('flag{Algorithmic_Matrix_State_Reconstructed}');
    });

    it('wrong license does not produce flag', () => {
      const out = runBinary(relBin, ['AURA-0000-ECHO-0000']);
      expect(out).not.toContain('flag{Algorithmic_Matrix_State_Reconstructed}');
    });

    it('flag is not visible in strings output', () => {
      const s = stringsOutput(relBin);
      expect(s).not.toContain('flag{Algorithmic_Matrix_State_Reconstructed}');
    });

    it('secrets.ts flag matches expected', () => {
      expect(getFlag('REV-03')).toBe('flag{Algorithmic_Matrix_State_Reconstructed}');
    });
  });

  describe('REV-04: UNKNOWN (nexus_bridge)', () => {
    const binPath = path.join(baseDir, 'REV-04', 'nexus_bridge');
    const relBin = 'public/artifacts/challenges/reverse/REV-04/nexus_bridge';

    it('binary exists and is executable', () => {
      expect(existsSync(binPath)).toBe(true);
      expect(existsSync(path.join(baseDir, 'REV-04', 'README.txt'))).toBe(true);
      const st = statSync(binPath);
      expect(st.size).toBeGreaterThan(1000);
    });

    it('correct bridge args produce flag in output', () => {
      const out = runBinary(relBin, ['--bridge-mode=legacy', '--key=ECHO-HANDSHAKE-0x99']);
      expect(out).toContain('flag{MultiStage_Dispatch_State_Bridge}');
    });

    it('wrong args do not produce flag', () => {
      const out = runBinary(relBin, ['--bridge-mode=modern', '--key=WRONG']);
      expect(out).not.toContain('flag{MultiStage_Dispatch_State_Bridge}');
    });

    it('missing args produce usage error', () => {
      const out = runBinary(relBin, []);
      expect(out).toContain('Usage:');
    });

    it('flag is not visible in strings output', () => {
      const s = stringsOutput(relBin);
      expect(s).not.toContain('flag{MultiStage_Dispatch_State_Bridge}');
    });

    it('secrets.ts flag matches expected', () => {
      expect(getFlag('REV-04')).toBe('flag{MultiStage_Dispatch_State_Bridge}');
    });
  });

  describe('Security Audit', () => {
    it('no raw plaintext flags in reverse.json manifest', () => {
      const manifestStr = JSON.stringify(reverseManifest).toLowerCase();
      expect(manifestStr).not.toContain('flag{control_flow');
      expect(manifestStr).not.toContain('flag{rolling');
      expect(manifestStr).not.toContain('flag{algorithmic');
      expect(manifestStr).not.toContain('flag{multistage');
    });
  });
});
