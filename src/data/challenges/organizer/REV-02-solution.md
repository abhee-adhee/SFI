# REV-02 — GHOST.EXE: Organizer Solution Document

## Challenge Metadata
- **ID**: REV-02
- **Title**: GHOST.EXE
- **Category**: Reverse Engineering
- **Difficulty**: Intermediate
- **Points**: 200
- **Estimated solve time**: 20–30 minutes

## Story Context
An archived payload loader (`ghost_loader`) was recovered from an ECHO-era system. It requires a specific activation key to decrypt its payload.

## Binary Architecture & Build
- **Architecture**: ELF 64-bit LSB executable, x86-64.
- **Compiler**: GCC 13.3 (`gcc -O2 -s`)
- **Binary Size**: ~14 KB

## Transformation Algorithm
The key verification loop in `validate_ghost_key` checks 15 characters against `expected_key_enc`:
$$\text{input}[i] \oplus ((0\text{x}5\text{A} + (i \times 7)) \pmod{256}) = \text{expected\_key\_enc}[i]$$

## Key Recovery Script (Python)
```python
expected_key_enc = [
  55, 30, 2, 70, 70, 20, 29, 0, 10, 12, 107, 107, 114, 118, 123
]
key = "".join(chr(expected_key_enc[i] ^ ((0x5A + (i * 7)) & 0xFF)) for i in range(15))
print("Recovered key:", key) # ECHO-GHOST-2018
```

## Exact Solution
Run:
```bash
./ghost_loader ECHO-GHOST-2018
```
Output:
`[OK] Activation sequence verified.`
`ECHO RESTORED: GHOST core parameters verified. Output key: flag{Rolling_XOR_State_Transformation}`

## Recovered Evidence & Flag
- **Payload Token**: `flag{Rolling_XOR_State_Transformation}`
- **Flag**: `flag{Rolling_XOR_State_Transformation}`

## Hints
1. Decompile or disassemble validate_ghost_key. Note the loop iterating over 15 characters, applying an XOR mask of (0x5A + (i * 7)) & 0xFF.
2. Extract expected_key_enc from the binary and XOR each byte with (0x5A + (i * 7)) & 0xFF to reconstruct the original key string.
3. Execute ./ghost_loader ECHO-GHOST-2018 to decrypt the payload buffer and retrieve the output key.

## Verification Procedure
Run `./ghost_loader ECHO-GHOST-2018` in Linux/WSL and confirm `flag{Rolling_XOR_State_Transformation}` is printed.
