# MISC-01 — SIGNAL: Organizer Solution Document

## Challenge Metadata
- **ID**: MISC-01
- **Title**: SIGNAL
- **Category**: Misc/Steg
- **Difficulty**: Beginner / Intermediate
- **Points**: 100
- **Estimated solve time**: 15–25 minutes

## Technical Concept
Binary packet stream protocol framing.

## Exact Solve Path
Write a Python script to parse `signal_stream.bin` based on the protocol specification in `README.txt`:
```python
import struct

with open("signal_stream.bin", "rb") as f:
    data = f.read()

offset = 0
while offset < len(data):
    if data[offset:offset+4] == b'NXS\x01':
        pkt_type, length = struct.unpack('>BH', data[offset+4:offset+7])
        payload = data[offset+7:offset+7+length]
        if pkt_type == 2:
            print("Decoded payload:", payload.decode())
        offset += 7 + length
    else:
        offset += 1
```

## Recovered Flag
- `flag{Signal_Packet_Framing_Decoded}`
