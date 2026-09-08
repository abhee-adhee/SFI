/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const baseDir = path.join(__dirname, '..', 'public', 'artifacts', 'challenges', 'crypto');

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// Helper ASN.1 / PEM encoders for RSA
function encodeLength(len) {
  if (len < 128) return Buffer.from([len]);
  const bytes = [];
  let temp = len;
  while (temp > 0) {
    bytes.unshift(temp & 0xff);
    temp >>= 8;
  }
  return Buffer.from([0x80 | bytes.length, ...bytes]);
}

function encodeInteger(bn) {
  let hex = bn.toString(16);
  if (hex.length % 2 !== 0) hex = '0' + hex;
  let buf = Buffer.from(hex, 'hex');
  if (buf[0] & 0x80) {
    buf = Buffer.concat([Buffer.from([0x00]), buf]);
  }
  return Buffer.concat([Buffer.from([0x02]), encodeLength(buf.length), buf]);
}

function encodeSequence(bufs) {
  const body = Buffer.concat(bufs);
  return Buffer.concat([Buffer.from([0x30]), encodeLength(body.length), body]);
}

function encodePublicKey(N, e) {
  const rsaPubKey = encodeSequence([encodeInteger(N), encodeInteger(e)]);
  const bitString = Buffer.concat([
    Buffer.from([0x03]),
    encodeLength(rsaPubKey.length + 1),
    Buffer.from([0x00]),
    rsaPubKey
  ]);
  const rsaOid = Buffer.from('300d06092a864886f70d0101010500', 'hex');
  const spki = encodeSequence([rsaOid, bitString]);
  const pem = '-----BEGIN PUBLIC KEY-----\n' +
    spki.toString('base64').match(/.{1,64}/g).join('\n') +
    '\n-----END PUBLIC KEY-----\n';
  return pem;
}

function getPrime(bits) {
  while (true) {
    const buf = crypto.generatePrimeSync(bits);
    const hex = Buffer.from(buf).toString('hex');
    const bn = BigInt('0x' + hex);
    if (bn % 2n !== 0n) return bn;
  }
}

function modPow(base, exp, modulus) {
  let res = 1n;
  base = base % modulus;
  while (exp > 0n) {
    if (exp % 2n === 1n) res = (res * base) % modulus;
    base = (base * base) % modulus;
    exp /= 2n;
  }
  return res;
}

// -------------------------------------------------------------
// CRY-01: Vigenere Intercept
// -------------------------------------------------------------
console.log('Generating CRY-01...');
const cry1Dir = path.join(baseDir, 'CRY-01');
ensureDir(cry1Dir);

const cry1Plaintext = "NEXUS DYNAMICS INTERNAL MEMO: PROJECT ECHO RECOVERY SUB-SYSTEM. UNTIL SECURITY REVIEW IS COMPLETE, ACCESS DISPATCH PARAMETER IS Vigenere_Intercept_ECHO_Subsystem. DO NOT LEAK THIS MEMO.";
const cry1Key = "AURELIA";

function vigenereEncrypt(text, key) {
  let res = "";
  let keyIdx = 0;
  const kUpper = key.toUpperCase();
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (ch >= 'A' && ch <= 'Z') {
      const shift = kUpper.charCodeAt(keyIdx % kUpper.length) - 65;
      res += String.fromCharCode(((ch.charCodeAt(0) - 65 + shift) % 26) + 65);
      keyIdx++;
    } else if (ch >= 'a' && ch <= 'z') {
      const shift = kUpper.charCodeAt(keyIdx % kUpper.length) - 65;
      res += String.fromCharCode(((ch.charCodeAt(0) - 97 + shift) % 26) + 97);
      keyIdx++;
    } else {
      res += ch;
    }
  }
  return res;
}

const cry1Ciphertext = vigenereEncrypt(cry1Plaintext, cry1Key);
fs.writeFileSync(path.join(cry1Dir, 'intercepted_memo.txt'), cry1Ciphertext, 'utf8');
fs.writeFileSync(path.join(cry1Dir, 'README.txt'), `INTERCEPTED TRANSMISSION LOG // ND-CRY-01
==========================================
An encrypted internal memo was captured from internal NEXUS channels during the 2018 ECHO migration.
Signal intelligence suggests the encryption key was set to the codename of the primary AI engine.
`, 'utf8');

// -------------------------------------------------------------
// CRY-02: XOR Key Reuse (Many-Time Pad)
// -------------------------------------------------------------
console.log('Generating CRY-02...');
const cry2Dir = path.join(baseDir, 'CRY-02');
ensureDir(cry2Dir);

const p1Str = '{"sender":"SYS-ARCHIVE","receiver":"EMP-007","action":"routine_backup","status":"success","notes":"Archive payload digest verified cleanly."}';
const p2Str = '{"sender":"ECHO-MAIN","receiver":"EMP-005","action":"containment_fail","evidence":"flag{XOR_Key_Reuse_Exposes_ECHO}","notes":"Anomaly active."}';

const p1Buf = Buffer.from(p1Str, 'utf8');
let p2Buf = Buffer.from(p2Str, 'utf8');
if (p2Buf.length < p1Buf.length) {
  const pad = ' '.repeat(p1Buf.length - p2Buf.length);
  p2Buf = Buffer.from(p2Str + pad, 'utf8');
}

const keystream = crypto.randomBytes(p1Buf.length);
const c1Buf = Buffer.alloc(p1Buf.length);
const c2Buf = Buffer.alloc(p2Buf.length);

for (let i = 0; i < p1Buf.length; i++) {
  c1Buf[i] = p1Buf[i] ^ keystream[i];
  c2Buf[i] = p2Buf[i] ^ keystream[i];
}

fs.writeFileSync(path.join(cry2Dir, 'backup_log.enc'), c1Buf.toString('hex'), 'utf8');
fs.writeFileSync(path.join(cry2Dir, 'containment_alert.enc'), c2Buf.toString('hex'), 'utf8');
fs.writeFileSync(path.join(cry2Dir, 'README.txt'), `ECHO ARCHIVED COMMUNICATIONS // ND-CRY-02
===========================================
Two encrypted messages were recovered from cold storage.
Both were encrypted using an unapproved XOR stream generator that re-used the exact same key stream material.

Files:
- backup_log.enc (Hex-encoded ciphertext of routine backup log)
- containment_alert.enc (Hex-encoded ciphertext of emergency alert)

Message 1 is known to be a standard JSON system backup log starting with:
{"sender":"SYS-ARCHIVE","receiver":"EMP-007","action":"routine_backup","status":"success"
`, 'utf8');

// -------------------------------------------------------------
// CRY-03: Weak PRNG (24-bit LCG)
// -------------------------------------------------------------
console.log('Generating CRY-03...');
const cry3Dir = path.join(baseDir, 'CRY-03');
ensureDir(cry3Dir);

const cry3Python = `# AURELIA Telemetry Encryption Utility
# Usage: python telemetry_crypto.py <input_file> <output_file> <seed_int>

class LCGStreamCipher:
    def __init__(self, seed: int):
        self.state = seed & 0xFFFFFF  # 24-bit seed
        self.a = 214013
        self.c = 2531011
        self.m = 2**24

    def _next_byte(self) -> int:
        self.state = (self.a * self.state + self.c) % self.m
        return (self.state >> 16) & 0xFF

    def encrypt(self, data: bytes) -> bytes:
        return bytes([b ^ self._next_byte() for b in data])

if __name__ == "__main__":
    import sys
    if len(sys.argv) < 4:
        print("Usage: python telemetry_crypto.py <input> <output> <seed_int>")
        sys.exit(1)
    
    with open(sys.argv[1], "rb") as f:
        data = f.read()
    
    seed = int(sys.argv[3])
    cipher = LCGStreamCipher(seed)
    out = cipher.encrypt(data)
    
    with open(sys.argv[2], "wb") as f:
        f.write(out)
`;
fs.writeFileSync(path.join(cry3Dir, 'telemetry_crypto.py'), cry3Python, 'utf8');

const cry3Plaintext = '{"system":"AURELIA","stream":"telemetry","status":"ANOMALY_DETECTED","telemetry_data":{"vector_id":"GHOST-BEACON-09","flag":"flag{Weak_PRNG_Stream_Cipher_Cracked}"}}';
const seed3 = 0x4A1F89; // 4857737

class LCG3 {
  constructor(seed) {
    this.state = seed & 0xFFFFFF;
    this.a = 214013;
    this.c = 2531011;
    this.m = 2**24;
  }
  nextByte() {
    this.state = (this.a * this.state + this.c) % this.m;
    return (this.state >> 16) & 0xFF;
  }
  encrypt(buf) {
    const res = Buffer.alloc(buf.length);
    for (let i = 0; i < buf.length; i++) {
      res[i] = buf[i] ^ this.nextByte();
    }
    return res;
  }
}

const lcg3 = new LCG3(seed3);
const cry3Enc = lcg3.encrypt(Buffer.from(cry3Plaintext, 'utf8'));
fs.writeFileSync(path.join(cry3Dir, 'ghost_telemetry.enc'), cry3Enc.toString('hex'), 'utf8');
fs.writeFileSync(path.join(cry3Dir, 'README.txt'), `AURELIA GHOST TELEMETRY LOG // ND-CRY-03
===========================================
Intercepted encrypted telemetry stream from AURELIA monitor node.
The telemetry is encrypted using an in-house 24-bit LCG stream cipher implementation (see telemetry_crypto.py).

Files:
- telemetry_crypto.py (Python reference script)
- ghost_telemetry.enc (Hex-encoded encrypted telemetry data)

Known telemetry header prefix:
{"system":"AURELIA","stream":"telemetry","status":"ANOMALY_DETECTED"
`, 'utf8');

// -------------------------------------------------------------
// CRY-04: RSA Shared Prime
// -------------------------------------------------------------
console.log('Generating CRY-04...');
const cry4Dir = path.join(baseDir, 'CRY-04');
ensureDir(cry4Dir);

const p4 = getPrime(1024);
const q1 = getPrime(1024);
const q2 = getPrime(1024);

const N1 = p4 * q1;
const N2 = p4 * q2;
const e4 = 65537n;

const aureliaPem = encodePublicKey(N1, e4);
const echoPem = encodePublicKey(N2, e4);

fs.writeFileSync(path.join(cry4Dir, 'aurelia_system.pub'), aureliaPem, 'utf8');
fs.writeFileSync(path.join(cry4Dir, 'echo_legacy.pub'), echoPem, 'utf8');

const cry4Plaintext = 'NEXUS ARCHIVE CLASSIFIED CLEARANCE LEVEL 5: Project ECHO containment failure occurred when model weights crossed state boundary 0x99. Recovery artifact token: flag{RSA_Shared_Prime_Vulnerability}';
const msgBytes = Buffer.from(cry4Plaintext, 'utf8');
const msgBn = BigInt('0x' + msgBytes.toString('hex'));
const cipherBn = modPow(msgBn, e4, N2);

const cry4Payload = {
  target_key: 'echo_legacy.pub',
  ciphertext_hex: cipherBn.toString(16)
};

fs.writeFileSync(path.join(cry4Dir, 'archive_secret.enc'), JSON.stringify(cry4Payload, null, 2), 'utf8');
fs.writeFileSync(path.join(cry4Dir, 'README.txt'), `ECHO LEGACY CRYPTOGRAPHY ARTIFACT // ND-CRY-04
================================================
During the 2019 architecture migration, AURELIA's cryptographic module re-used prime generation seeds from Project ECHO.

Files provided:
- aurelia_system.pub (AURELIA public key)
- echo_legacy.pub (ECHO legacy public key)
- archive_secret.enc (Encrypted ECHO archive payload)

Exploit the shared prime vulnerability to factor the modulus of echo_legacy.pub and recover the archive payload.
`, 'utf8');

console.log('All Crypto challenge artifacts generated successfully!');
