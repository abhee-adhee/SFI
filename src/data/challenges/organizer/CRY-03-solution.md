# CRY-03 — GHOST TALKS: Organizer Solution Document

## Challenge Metadata
- **ID**: CRY-03
- **Title**: GHOST TALKS
- **Category**: Cryptography
- **Difficulty**: Intermediate / Hard
- **Points**: 300
- **Estimated solve time**: 25–40 minutes

## Story Context
AURELIA's telemetry system encrypts diagnostic logs using a custom in-house stream cipher. The implementation relies on a Linear Congruential Generator (LCG) with a truncated 24-bit state, exposing the stream to brute-force or key-reconstruction attacks.

## Cryptographic Details
- **Primitive**: Stream Cipher / LCG (Linear Congruential Generator)
- **Vulnerability**: Small seed space ($2^{24} = 16,777,216$ states)
- **LCG Formula**: $\text{state}_{next} = (214013 \times \text{state} + 2531011) \pmod{2^{24}}$
- **Keystream Byte**: $(\text{state} \gg 16) \& 0xFF$
- **Artifacts**:
  - `telemetry_crypto.py` (Python encryption script)
  - `ghost_telemetry.enc` (Hex-encoded ciphertext)
- **Known Header**: `{"system":"AURELIA","stream":"telemetry","status":"ANOMALY_DETECTED"`

## Exact Attack Method
1. Read `telemetry_crypto.py` to identify the LCG recurrence parameters and seed masking (`seed & 0xFFFFFF`).
2. Write a Python script to iterate through seeds $0$ to $2^{24}-1$.
3. For each seed, generate the first 16 bytes of keystream and check if XORing with `ghost_telemetry.enc[0:16]` matches the known header `{"system":"AURELI`.
4. When the matching seed is found (`0x4A1F89` / `4857737`), decrypt the entire ciphertext to recover the telemetry JSON and flag.

## Python Solve Script
```python
import sys

class LCGStreamCipher:
    def __init__(self, seed: int):
        self.state = seed & 0xFFFFFF
        self.a = 214013
        self.c = 2531011
        self.m = 2**24

    def _next_byte(self) -> int:
        self.state = (self.a * self.state + self.c) % self.m
        return (self.state >> 16) & 0xFF

    def decrypt(self, data: bytes) -> bytes:
        return bytes([b ^ self._next_byte() for b in data])

with open("ghost_telemetry.enc") as f:
    ct_bytes = bytes.fromhex(f.read().strip())

header_prefix = b'{"system":"AURELI'

found_seed = None
for candidate in range(2**24):
    cipher = LCGStreamCipher(candidate)
    pt_sample = bytes([ct_bytes[i] ^ cipher._next_byte() for i in range(len(header_prefix))])
    if pt_sample == header_prefix:
        found_seed = candidate
        break

print(f"Found seed: {found_seed} (hex: {hex(found_seed)})")

cipher = LCGStreamCipher(found_seed)
plaintext = cipher.decrypt(ct_bytes)
print("Decrypted telemetry:", plaintext.decode('utf-8'))
```

## Recovered Evidence & Flag Derivation
- Decrypted JSON: `{"system":"AURELIA","stream":"telemetry","status":"ANOMALY_DETECTED","telemetry_data":{"vector_id":"GHOST-BEACON-09","flag":"flag{Weak_PRNG_Stream_Cipher_Cracked}"}}`
- Flag: `flag{Weak_PRNG_Stream_Cipher_Cracked}`

## Hints
1. Inspect telemetry_crypto.py. Note that the seed is masked with 0xFFFFFF, limiting the seed search space to 2^24 (16,777,216 possible seeds).
2. Use the known header prefix ({"system":"AURELIA","stream":"telemetry":...) to check candidate seeds by encrypting/decrypting the first 16 bytes.
3. Once the seed is found, instantiate LCGStreamCipher(seed) and decrypt ghost_telemetry.enc.

## Verification Procedure
Run the brute-force solve script. The search takes under 3 seconds in Python and recovers `flag{Weak_PRNG_Stream_Cipher_Cracked}`.
