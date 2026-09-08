import { describe, it, expect } from 'vitest';
import { existsSync } from 'fs';
import { execSync } from 'child_process';
import path from 'path';

import pwnManifest from '../src/data/challenges/pwn.json';
import { getFlag } from '../src/lib/secrets';

const baseDir = path.join(process.cwd(), 'public', 'artifacts', 'challenges', 'pwn');

describe('PWN Challenges Validation Suite', { timeout: 20000 }, () => {

  it('manifest contains exactly 3 challenges', () => {
    expect(pwnManifest.length).toBe(3);
    expect(pwnManifest.map(c => c.id)).toEqual(['PWN-01', 'PWN-02', 'PWN-03']);
  });

  describe('PWN-01: BROKEN TERMINAL', () => {
    const binPath = path.join(baseDir, 'PWN-01', 'broken_terminal');

    it('binary exists', () => {
      expect(existsSync(binPath)).toBe(true);
      expect(existsSync(path.join(baseDir, 'PWN-01', 'README.txt'))).toBe(true);
    });

    it('stack overflow exploit produces flag', () => {
      const pythonCmd = `python -c "import subprocess, struct; win_addr = int(subprocess.check_output(['wsl', 'objdump', '-d', '/mnt/d/SFI/nexus/public/artifacts/challenges/pwn/PWN-01/broken_terminal']).decode().split('<win>:')[0].splitlines()[-1].split()[0], 16); p = subprocess.Popen(['wsl', '/mnt/d/SFI/nexus/public/artifacts/challenges/pwn/PWN-01/broken_terminal'], stdin=subprocess.PIPE, stdout=subprocess.PIPE); out, _ = p.communicate(input=b'A'*72 + struct.pack('<Q', win_addr)); print(out.decode('utf-8', 'ignore'))"`;
      const out = execSync(pythonCmd).toString();
      expect(out).toContain('flag{Stack_Buffer_Overflow_Win_Path}');
      expect(getFlag('PWN-01')).toBe('flag{Stack_Buffer_Overflow_Win_Path}');
    });
  });

  describe('PWN-02: INTERNAL SERVICE', () => {
    const binPath = path.join(baseDir, 'PWN-02', 'internal_service');

    it('binary exists', () => {
      expect(existsSync(binPath)).toBe(true);
      expect(existsSync(path.join(baseDir, 'PWN-02', 'README.txt'))).toBe(true);
    });

    it('format string leak exploit produces flag', () => {
      const pythonCmd = `python -c "import subprocess; p = subprocess.Popen(['wsl', '/mnt/d/SFI/nexus/public/artifacts/challenges/pwn/PWN-02/internal_service'], stdin=subprocess.PIPE, stdout=subprocess.PIPE); out, _ = p.communicate(input=b'%5$lx\\n0xA02E11A99\\n'); print(out.decode('utf-8', 'ignore'))"`;
      const out = execSync(pythonCmd).toString();
      expect(out).toContain('flag{Format_String_Leak_Exploit_Success}');
      expect(getFlag('PWN-02')).toBe('flag{Format_String_Leak_Exploit_Success}');
    });
  });

  describe('PWN-03: AURELIA GATEWAY', () => {
    const binPath = path.join(baseDir, 'PWN-03', 'aurelia_gateway');

    it('binary exists', () => {
      expect(existsSync(binPath)).toBe(true);
      expect(existsSync(path.join(baseDir, 'PWN-03', 'README.txt'))).toBe(true);
    });

    it('gateway overflow exploit produces flag', () => {
      const pythonCmd = `python -c "import subprocess, struct; win_addr = int(subprocess.check_output(['wsl', 'objdump', '-d', '/mnt/d/SFI/nexus/public/artifacts/challenges/pwn/PWN-03/aurelia_gateway']).decode().split('<win>:')[0].splitlines()[-1].split()[0], 16); p = subprocess.Popen(['wsl', '/mnt/d/SFI/nexus/public/artifacts/challenges/pwn/PWN-03/aurelia_gateway'], stdin=subprocess.PIPE, stdout=subprocess.PIPE); out, _ = p.communicate(input=b'A'*72 + struct.pack('<Q', win_addr)); print(out.decode('utf-8', 'ignore'))"`;
      const out = execSync(pythonCmd).toString();
      expect(out).toContain('flag{MultiStage_ROP_Gateway_Bypass}');
      expect(getFlag('PWN-03')).toBe('flag{MultiStage_ROP_Gateway_Bypass}');
    });
  });
});
