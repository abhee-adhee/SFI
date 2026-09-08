# MISC-02 — THE IMAGE: Organizer Solution Document

## Challenge Metadata
- **ID**: MISC-02
- **Title**: THE IMAGE
- **Category**: Misc/Steg
- **Difficulty**: Intermediate
- **Points**: 200
- **Estimated solve time**: 20–30 minutes

## Technical Concept
PNG custom ancillary chunk extraction and XOR decoding.

## Exact Solve Path
```python
with open("nexus_telemetry.png", "rb") as f:
    content = f.read()

idx = content.find(b'nxDS')
if idx != -1:
    length = int.from_bytes(content[idx-4:idx], 'big')
    raw_payload = content[idx+4:idx+4+length]
    decoded = "".join(chr(b ^ 0x77) for b in raw_payload)
    print("Decoded string:", decoded)
```

## Recovered Flag
- `flag{PNG_Chunk_Steganography_Extracted}`
