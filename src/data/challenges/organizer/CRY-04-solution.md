# CRY-04 — THE KEY: Organizer Solution Document

## Challenge Metadata
- **ID**: CRY-04
- **Title**: THE KEY
- **Category**: Cryptography
- **Difficulty**: Hard
- **Points**: 400
- **Estimated solve time**: 30–50 minutes

## Story Context
Legacy cryptographic artifacts from Project ECHO were incorporated directly into AURELIA's key management architecture. Because prime generation relied on deterministic state seeds, two distinct public keys share a common prime factor $p$.

## Cryptographic Details
- **Primitive**: RSA Public Key Cryptography
- **Vulnerability**: Shared Prime Factor ($N_1 = p \cdot q_1$, $N_2 = p \cdot q_2$)
- **Artifacts**:
  - `aurelia_system.pub` (Public Key 1, $N_1$)
  - `echo_legacy.pub` (Public Key 2, $N_2$)
  - `archive_secret.enc` (JSON containing target key and hex ciphertext $C$)
- **Public Exponent**: $e = 65537$

## Exact Attack Method
1. Parse `aurelia_system.pub` and `echo_legacy.pub` to extract the 1024-bit moduli $N_1$ and $N_2$.
2. Compute the Greatest Common Divisor $p = \gcd(N_1, N_2)$.
3. Because $p > 1$, factor $N_2$: $q_2 = N_2 / p$.
4. Calculate Euler's totient $\phi(N_2) = (p - 1) \cdot (q_2 - 1)$.
5. Compute the private exponent $d_2 = e^{-1} \pmod{\phi(N_2)}$.
6. Decrypt the ciphertext $C$: $M = C^{d_2} \pmod{N_2}$.
7. Convert integer $M$ to UTF-8 string to reveal the secret archive payload and flag.

## Python Solve Script
```python
import json
import math
import base64

# Helper function to parse ASN.1 DER integer from PEM
def extract_modulus_from_pem(filename):
    with open(filename, 'r') as f:
        lines = [line.strip() for line in f if not line.startswith('-----')]
    der = base64.b64decode("".join(lines))
    
    # Simple ASN.1 DER parser for RSA SubjectPublicKeyInfo
    # BIT STRING contains RSAPublicKey (SEQUENCE of N, e)
    # Locate 0x02 (INTEGER) for N
    idx = der.find(b'\x30\x81')
    if idx == -1: idx = der.find(b'\x30\x82')
    
    # Search for the first INTEGER > 64 bytes
    pos = 0
    integers = []
    while pos < len(der):
        if der[pos] == 0x02: # INTEGER tag
            length = der[pos+1]
            pos_offset = 2
            if length & 0x80:
                len_bytes = length & 0x7f
                length = int.from_bytes(der[pos+2:pos+2+len_bytes], 'big')
                pos_offset = 2 + len_bytes
            val_bytes = der[pos+pos_offset:pos+pos_offset+length]
            integers.append(int.from_bytes(val_bytes, 'big'))
            pos += pos_offset + length
        else:
            pos += 1
            
    # Largest integer is N
    return max(integers)

def mod_inverse(a, m):
    m0, y, x = m, 0, 1
    if m == 1: return 0
    while a > 1:
        q = a // m
        m, a = a % m, m
        y, x = x - q * y, y
    if x < 0: x += m0
    return x

n1 = extract_modulus_from_pem("aurelia_system.pub")
n2 = extract_modulus_from_pem("echo_legacy.pub")

p = math.gcd(n1, n2)
print("GCD found shared prime:", p > 1)

q2 = n2 // p
e = 65537
phi2 = (p - 1) * (q2 - 1)
d2 = mod_inverse(e, phi2)

with open("archive_secret.enc") as f:
    data = json.load(f)

c_hex = data["ciphertext_hex"]
c = int(c_hex, 16)

m = pow(c, d2, n2)
m_bytes = m.to_bytes((m.bit_length() + 7) // 8, 'big')
print("Decrypted payload:", m_bytes.decode('utf-8'))
```

## Recovered Evidence & Flag Derivation
- Decrypted Payload: `NEXUS ARCHIVE CLASSIFIED CLEARANCE LEVEL 5: Project ECHO containment failure occurred when model weights crossed state boundary 0x99. Recovery artifact token: flag{RSA_Shared_Prime_Vulnerability}`
- Flag: `flag{RSA_Shared_Prime_Vulnerability}`

## Hints
1. Extract the moduli N1 and N2 from aurelia_system.pub and echo_legacy.pub using Python cryptography/pyasn1 or standard ASN.1 parsing.
2. Calculate p = GCD(N1, N2). Since p > 1, compute q2 = N2 / p and calculate the private exponent d2 = mod_inverse(e, (p-1)*(q2-1)).
3. Perform RSA decryption on the hex ciphertext in archive_secret.enc using (d2, N2) to recover the payload.

## Verification Procedure
Run the python solution script to verify successful extraction of $N_1, N_2$, computation of $\gcd(N_1, N_2) = p$, RSA private key reconstruction, and payload decryption yielding `flag{RSA_Shared_Prime_Vulnerability}`.
