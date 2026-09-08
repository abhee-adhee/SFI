# REV-03 — AURELIA MODULE: Organizer Solution Document

## Challenge Metadata
- **ID**: REV-03
- **Title**: AURELIA MODULE
- **Category**: Reverse Engineering
- **Difficulty**: Intermediate / Hard
- **Points**: 300
- **Estimated solve time**: 25–40 minutes

## Story Context
An AURELIA core module (`aurelia_validator`) uses an algorithmic license key checker involving bitwise rotation and dynamic constant XOR masking.

## Binary Architecture & Build
- **Architecture**: ELF 64-bit LSB executable, x86-64.
- **Compiler**: GCC 13.3 (`gcc -O2 -s`)
- **Binary Size**: ~14 KB

## Transformation Algorithm
For character `c` at index `i`:
$$\text{rot} = ((\text{c} \ll 3) \mid (\text{c} \gg 5)) \pmod{256}$$
$$\text{check}[i] = \text{rot} \oplus ((i \times 13 + 0\text{x}47) \pmod{256})$$

## Inversion Script (Python)
```python
target_state = [
  55, 30, 2, 70, 70, 20, 29, 0, 10, 12, 107, 107, 114, 118, 123, 44, 88, 92, 101
]

def ror3(val):
    return ((val >> 3) | (val << 5)) & 0xFF

license_chars = []
for i, target in enumerate(target_state):
    rot = target ^ ((i * 13 + 0x47) & 0xFF)
    c = ror3(rot)
    license_chars.append(chr(c))

print("Recovered license:", "".join(license_chars)) # AURA-9921-ECHO-8842
```

## Exact Solution
Run:
```bash
./aurelia_validator AURA-9921-ECHO-8842
```
Output:
`[AUTH] AURELIA MODULE AUTHORIZED. Security Token: flag{Algorithmic_Matrix_State_Reconstructed}`

## Recovered Evidence & Flag
- **Security Token**: `flag{Algorithmic_Matrix_State_Reconstructed}`
- **Flag**: `flag{Algorithmic_Matrix_State_Reconstructed}`

## Hints
1. Analyze check_aurelia_license. For each character index i, it rotates the character 3 bits left and XORs with ((i * 13 + 0x47) & 0xFF).
2. Invert the transformation: XOR target_state[i] with ((i * 13 + 0x47) & 0xFF), then rotate 3 bits right (((x >> 3) | (x << 5)) & 0xFF) to recover each byte.
3. Provide the recovered key 'AURA-9921-ECHO-8842' to aurelia_validator to output the security token.

## Verification Procedure
Run `./aurelia_validator AURA-9921-ECHO-8842` in Linux/WSL and confirm `flag{Algorithmic_Matrix_State_Reconstructed}` is printed.
