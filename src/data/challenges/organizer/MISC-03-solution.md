# MISC-03 — GHOST ARTIFACT: Organizer Solution Document

## Challenge Metadata
- **ID**: MISC-03
- **Title**: GHOST ARTIFACT
- **Category**: Misc/Steg
- **Difficulty**: Hard
- **Points**: 300
- **Estimated solve time**: 25–40 minutes

## Technical Concept
Custom container format directory parsing & binary carving.

## Exact Solve Path
```python
import struct

with open("ghost_archive.nxc", "rb") as f:
    data = f.read()

magic = data[0:8]
num_records = struct.unpack('>I', data[8:12])[0]

offset = 12
for _ in range(num_records):
    rec_id = data[offset:offset+16].rstrip(b'\x00').decode()
    rec_type, rec_off, rec_len = struct.unpack('>HII', data[offset+16:offset+26])
    if rec_type == 3:
        payload = data[rec_off:rec_off+rec_len]
        decoded = "".join(chr(b ^ 0x44) for b in payload)
        print("Decoded CLASSIFIED payload:", decoded)
    offset += 26
```

## Recovered Flag
- `flag{Ghost_Binary_Container_Carved}`
