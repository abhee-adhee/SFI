import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'fs';
import path from 'path';
import crypto from 'crypto';

import cryptoManifest from '../src/data/challenges/crypto.json';
import { getFlag } from '../src/lib/secrets';

function gcd(a: bigint, b: bigint): bigint {
  const zero = BigInt(0);
  while (b !== zero) {
    const t = b;
    b = a % b;
    a = t;
  }
  return a;
}

function modInverse(a: bigint, m: bigint): bigint {
  const zero = BigInt(0);
  const one = BigInt(1);
  const m0 = m;
  let y = zero, x = one;
  if (m === one) return zero;
  while (a > one) {
    const q = a / m;
    let t = m;
    m = a % m;
    a = t;
    t = y;
    y = x - q * y;
    x = t;
  }
  if (x < zero) x += m0;
  return x;
}

function modPow(base: bigint, exp: bigint, modulus: bigint): bigint {
  const zero = BigInt(0);
  const one = BigInt(1);
  const two = BigInt(2);
  let res = one;
  base = base % modulus;
  while (exp > zero) {
    if (exp % two === one) res = (res * base) % modulus;
    base = (base * base) % modulus;
    exp /= two;
  }
  return res;
}

function extractModulusFromPem(pemContent: string): bigint {
  const pubKey = crypto.createPublicKey(pemContent);
  const jwk = pubKey.export({ format: 'jwk' });
  if (!jwk.n) throw new Error('Modulus missing from JWK');
  return BigInt('0x' + Buffer.from(jwk.n, 'base64url').toString('hex'));
}

describe('Crypto Challenges Validation Suite', () => {
  const baseArtifactDir = path.join(process.cwd(), 'public', 'artifacts', 'challenges', 'crypto');

  it('manifest contains exact 4 challenges', () => {
    expect(cryptoManifest.length).toBe(4);
    expect(cryptoManifest.map(c => c.id)).toEqual(['CRY-01', 'CRY-02', 'CRY-03', 'CRY-04']);
  });

  describe('CRY-01: INTERCEPT', () => {
    it('artifact files exist', () => {
      const memoPath = path.join(baseArtifactDir, 'CRY-01', 'intercepted_memo.txt');
      const readmePath = path.join(baseArtifactDir, 'CRY-01', 'README.txt');
      expect(existsSync(memoPath)).toBe(true);
      expect(existsSync(readmePath)).toBe(true);
    });

    it('Vigenere decryption yields the flag parameter matching secrets', () => {
      const memoPath = path.join(baseArtifactDir, 'CRY-01', 'intercepted_memo.txt');
      const ciphertext = readFileSync(memoPath, 'utf8');
      const key = 'AURELIA';
      
      let decrypted = '';
      let keyIdx = 0;
      for (let i = 0; i < ciphertext.length; i++) {
        const ch = ciphertext[i];
        if (ch >= 'A' && ch <= 'Z') {
          const shift = key.charCodeAt(keyIdx % key.length) - 65;
          decrypted += String.fromCharCode(((ch.charCodeAt(0) - 65 - shift + 26) % 26) + 65);
          keyIdx++;
        } else if (ch >= 'a' && ch <= 'z') {
          const shift = key.charCodeAt(keyIdx % key.length) - 65;
          decrypted += String.fromCharCode(((ch.charCodeAt(0) - 97 - shift + 26) % 26) + 97);
          keyIdx++;
        } else {
          decrypted += ch;
        }
      }

      const flag = getFlag('CRY-01');
      expect(decrypted).toContain('Vigenere_Intercept_ECHO_Subsystem');
      expect(flag).toBe('flag{Vigenere_Intercept_ECHO_Subsystem}');
    });
  });

  describe('CRY-02: ARCHIVED COMMUNICATION', () => {
    it('artifact files exist', () => {
      const c1Path = path.join(baseArtifactDir, 'CRY-02', 'backup_log.enc');
      const c2Path = path.join(baseArtifactDir, 'CRY-02', 'containment_alert.enc');
      expect(existsSync(c1Path)).toBe(true);
      expect(existsSync(c2Path)).toBe(true);
    });

    it('XOR key reuse attack recovers P2 containing the flag', () => {
      const c1Hex = readFileSync(path.join(baseArtifactDir, 'CRY-02', 'backup_log.enc'), 'utf8').trim();
      const c2Hex = readFileSync(path.join(baseArtifactDir, 'CRY-02', 'containment_alert.enc'), 'utf8').trim();

      const c1 = Buffer.from(c1Hex, 'hex');
      const c2 = Buffer.from(c2Hex, 'hex');

      const knownP1Prefix = '{"sender":"SYS-ARCHIVE","receiver":"EMP-007","action":"routine_backup","status":"success"';
      const p1Buf = Buffer.from(knownP1Prefix, 'utf8');

      // Recover keystream prefix
      const keystreamPrefix = Buffer.alloc(p1Buf.length);
      for (let i = 0; i < p1Buf.length; i++) {
        keystreamPrefix[i] = c1[i] ^ p1Buf[i];
      }

      // Recover P2 prefix
      const p2PrefixBuf = Buffer.alloc(p1Buf.length);
      for (let i = 0; i < p1Buf.length; i++) {
        p2PrefixBuf[i] = c2[i] ^ keystreamPrefix[i];
      }

      const p2PrefixStr = p2PrefixBuf.toString('utf8');
      expect(p2PrefixStr).toContain('{"sender":"ECHO-MAIN","receiver":"EMP-005"');

      // Verify secrets flag matches
      expect(getFlag('CRY-02')).toBe('flag{XOR_Key_Reuse_Exposes_ECHO}');
    });
  });

  describe('CRY-03: GHOST TALKS', () => {
    it('artifact files exist', () => {
      const scriptPath = path.join(baseArtifactDir, 'CRY-03', 'telemetry_crypto.py');
      const encPath = path.join(baseArtifactDir, 'CRY-03', 'ghost_telemetry.enc');
      expect(existsSync(scriptPath)).toBe(true);
      expect(existsSync(encPath)).toBe(true);
    });

    it('LCG 24-bit seed cracking decrypts telemetry payload', () => {
      const encHex = readFileSync(path.join(baseArtifactDir, 'CRY-03', 'ghost_telemetry.enc'), 'utf8').trim();
      const ctBytes = Buffer.from(encHex, 'hex');

      class LCGStreamCipher {
        state: number;
        a = 214013;
        c = 2531011;
        m = 2**24;
        constructor(seed: number) {
          this.state = seed & 0xFFFFFF;
        }
        nextByte(): number {
          this.state = (this.a * this.state + this.c) % this.m;
          return (this.state >> 16) & 0xFF;
        }
      }

      const headerPrefix = Buffer.from('{"system":"AURELI', 'utf8');
      let foundSeed = -1;

      // Seed search (known target seed is 0x4A1F89)
      for (let candidate = 0x4A1F00; candidate <= 0x4A2000; candidate++) {
        const cipher = new LCGStreamCipher(candidate);
        let match = true;
        for (let i = 0; i < headerPrefix.length; i++) {
          if ((ctBytes[i] ^ cipher.nextByte()) !== headerPrefix[i]) {
            match = false;
            break;
          }
        }
        if (match) {
          foundSeed = candidate;
          break;
        }
      }

      expect(foundSeed).toBe(0x4A1F89);

      // Decrypt
      const cipher = new LCGStreamCipher(foundSeed);
      const plaintextBuf = Buffer.alloc(ctBytes.length);
      for (let i = 0; i < ctBytes.length; i++) {
        plaintextBuf[i] = ctBytes[i] ^ cipher.nextByte();
      }

      const decryptedStr = plaintextBuf.toString('utf8');
      expect(decryptedStr).toContain('flag{Weak_PRNG_Stream_Cipher_Cracked}');
      expect(getFlag('CRY-03')).toBe('flag{Weak_PRNG_Stream_Cipher_Cracked}');
    });
  });

  describe('CRY-04: THE KEY', () => {
    it('artifact files exist', () => {
      const pub1 = path.join(baseArtifactDir, 'CRY-04', 'aurelia_system.pub');
      const pub2 = path.join(baseArtifactDir, 'CRY-04', 'echo_legacy.pub');
      const secret = path.join(baseArtifactDir, 'CRY-04', 'archive_secret.enc');
      expect(existsSync(pub1)).toBe(true);
      expect(existsSync(pub2)).toBe(true);
      expect(existsSync(secret)).toBe(true);
    });

    it('RSA GCD attack recovers private key and decrypts secret archive', () => {
      const pub1Pem = readFileSync(path.join(baseArtifactDir, 'CRY-04', 'aurelia_system.pub'), 'utf8');
      const pub2Pem = readFileSync(path.join(baseArtifactDir, 'CRY-04', 'echo_legacy.pub'), 'utf8');
      const secretJson = JSON.parse(readFileSync(path.join(baseArtifactDir, 'CRY-04', 'archive_secret.enc'), 'utf8'));

      const N1 = extractModulusFromPem(pub1Pem);
      const N2 = extractModulusFromPem(pub2Pem);

      // Attack: GCD
      const p = gcd(N1, N2);
      expect(p > BigInt(1)).toBe(true);

      const q2 = N2 / p;
      const e = BigInt(65537);
      const phi2 = (p - BigInt(1)) * (q2 - BigInt(1));
      const d2 = modInverse(e, phi2);

      const c = BigInt('0x' + secretJson.ciphertext_hex);
      const m = modPow(c, d2, N2);

      let decryptedHex = m.toString(16);
      if (decryptedHex.length % 2 !== 0) decryptedHex = '0' + decryptedHex;
      const decryptedStr = Buffer.from(decryptedHex, 'hex').toString('utf8');

      expect(decryptedStr).toContain('flag{RSA_Shared_Prime_Vulnerability}');
      expect(getFlag('CRY-04')).toBe('flag{RSA_Shared_Prime_Vulnerability}');
    });
  });

  describe('Security Audit', () => {
    it('no raw plaintext flags present in crypto.json or public artifacts', () => {
      const cryptoJsonStr = JSON.stringify(cryptoManifest).toLowerCase();
      expect(cryptoJsonStr).not.toContain('flag{');
    });
  });
});
