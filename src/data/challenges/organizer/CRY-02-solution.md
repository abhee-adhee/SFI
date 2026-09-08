# CRY-02 — ARCHIVED COMMUNICATION: Organizer Solution Document

## Challenge Metadata
- **ID**: CRY-02
- **Title**: ARCHIVED COMMUNICATION
- **Category**: Cryptography
- **Difficulty**: Intermediate
- **Points**: 200
- **Estimated solve time**: 20–30 minutes

## Story Context
During an archived ECHO communication session, two distinct messages were encrypted using a stream cipher with a reused keystream. One message was a routine backup log, while the second was an emergency containment alert.

## Cryptographic Details
- **Primitive**: Stream Cipher / One-Time Pad Key Reuse (Many-Time Pad)
- **Vulnerability**: $C_1 = P_1 \oplus K$, $C_2 = P_2 \oplus K \implies C_1 \oplus C_2 = P_1 \oplus P_2$
- **Artifacts**:
  - `backup_log.enc` (Hex-encoded ciphertext of $C_1$)
  - `containment_alert.enc` (Hex-encoded ciphertext of $C_2$)
- **Known Plaintext**: $P_1$ starts with `{"sender":"SYS-ARCHIVE","receiver":"EMP-007","action":"routine_backup","status":"success"`

## Exact Attack Method
1. Read `backup_log.enc` ($C_1$) and `containment_alert.enc` ($C_2$).
2. Compute $C_{xor} = C_1 \oplus C_2$.
3. Compute $K_{partial} = C_1 \oplus P_{known\_prefix}$.
4. Decrypt $P_{2\_partial} = C_2 \oplus K_{partial}$.
5. Recover full keystream $K = C_1 \oplus P_1$ or crib-drag to reveal full $P_2$.

## Python Solve Script
```python
def hex_xor(h1, h2):
    b1 = bytes.fromhex(h1)
    b2 = bytes.fromhex(h2)
    return bytes([x ^ y for x, y in zip(b1, b2)])

with open("backup_log.enc") as f:
    c1_hex = f.read().strip()

with open("containment_alert.enc") as f:
    c2_hex = f.read().strip()

c1 = bytes.fromhex(c1_hex)
c2 = bytes.fromhex(c2_hex)

# Recover keystream using known prefix of P1
p1_prefix = b'{"sender":"SYS-ARCHIVE","receiver":"EMP-007","action":"routine_backup","status":"success"'
keystream_prefix = bytes([c1[i] ^ p1_prefix[i] for i in range(len(p1_prefix))])
p2_prefix = bytes([c2[i] ^ keystream_prefix[i] for i in range(len(keystream_prefix))])
print("P2 recovered prefix:", p2_prefix.decode('utf-8', errors='ignore'))

# Full recovery if P1 full structure is known
p1_full = b'{"sender":"SYS-ARCHIVE","receiver":"EMP-007","action":"routine_backup","status":"success","notes":"Archive payload digest verified cleanly."}'
full_keystream = bytes([c1[i] ^ p1_full[i] for i in range(len(p1_full))])
p2_full = bytes([c2[i] ^ full_keystream[i] for i in range(len(full_keystream))])
print("P2 full recovered:", p2_full.decode('utf-8'))
```

## Recovered Evidence & Flag Derivation
- Plaintext P2: `{"sender":"ECHO-MAIN","receiver":"EMP-005","action":"containment_fail","evidence":"flag{XOR_Key_Reuse_Exposes_ECHO}","notes":"Anomaly active."}`
- Flag: `flag{XOR_Key_Reuse_Exposes_ECHO}`

## Hints
1. Because both messages were encrypted using the same keystream K, XORing the two hex ciphertexts together removes K and yields P1 XOR P2.
2. Use the known starting string of Message 1 ({"sender":"SYS-ARCHIVE","receiver":...) to crib drag and recover the corresponding bytes of Message 2.
3. Once you recover Message 2, locate the 'evidence' JSON field containing the flag.

## Verification Procedure
Run the python script to verify complete plaintext recovery of `P2` and extraction of `flag{XOR_Key_Reuse_Exposes_ECHO}`.
