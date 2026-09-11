import os
import struct

base_dir = os.path.join(os.path.dirname(__file__), "..", "public", "artifacts", "challenges", "misc")
os.makedirs(base_dir, exist_ok=True)

# -------------------------------------------------------------
# MISC-01: signal_stream.bin
# -------------------------------------------------------------
misc1_dir = os.path.join(base_dir, "MISC-01")
os.makedirs(misc1_dir, exist_ok=True)

flag1 = b'flag{Signal_Packet_Framing_Decoded}'
# The Payload Data (Type 0x02) is masked with a single-byte XOR so the signal token
# is NOT recoverable with `strings`. The mask is documented in README.txt, so the
# intended solve is unchanged from the player's perspective: parse the NXS framing to
# locate the Type 0x02 packet, then XOR-decode its payload. This mirrors the payload
# masking already used by MISC-02 (XOR 0x77) and MISC-03 (XOR 0x44).
PAYLOAD_XOR_MASK = 0x2A
flag1_masked = bytes([b ^ PAYLOAD_XOR_MASK for b in flag1])
pkt1 = b'NXS\x01' + struct.pack('>BH', 1, 12) + b'AURELIA_LINK'
pkt2 = b'NXS\x01' + struct.pack('>BH', 2, len(flag1_masked)) + flag1_masked
pkt3 = b'NXS\x01' + struct.pack('>BH', 3, 4) + b'END\x00'

with open(os.path.join(misc1_dir, 'signal_stream.bin'), 'wb') as f:
    f.write(pkt1 + pkt2 + pkt3)

readme1 = """AURELIA COMMUNICATIONS SIGNAL TRACE // ND-MISC-01
=================================================
A raw binary telemetry stream (signal_stream.bin) was intercepted from an AURELIA RF relay module.

Protocol Framing Format Specification:
- Magic bytes (4 bytes): 0x4E 0x58 0x53 0x01 ('NXS\\x01')
- Packet Type (1 byte): 0x01=Header, 0x02=Payload Data, 0x03=Footer
- Payload Length (2 bytes, Big-Endian unsigned short)
- Payload Bytes (Variable length equal to Payload Length)

Objective: Parse the binary stream according to the protocol specification to locate the Payload Data (Type 0x02) packet. Note that Payload Data bytes are masked with XOR 0x2A; XOR-decode the extracted payload to recover the signal token.
"""
with open(os.path.join(misc1_dir, 'README.txt'), 'w') as f:
    f.write(readme1)

# -------------------------------------------------------------
# MISC-02: nexus_telemetry.png
# -------------------------------------------------------------
misc2_dir = os.path.join(base_dir, "MISC-02")
os.makedirs(misc2_dir, exist_ok=True)

png_sig = b'\x89PNG\r\n\x1a\n'
ihdr_data = struct.pack('>IIBBBBB', 1, 1, 8, 2, 0, 0, 0)

def make_chunk(chunk_type, data):
    import zlib
    crc = zlib.crc32(chunk_type + data) & 0xffffffff
    return struct.pack('>I', len(data)) + chunk_type + data + struct.pack('>I', crc)

ihdr_chunk = make_chunk(b'IHDR', ihdr_data)
flag_text2 = b'NEXUS IMAGE METADATA ARTIFACT: flag{PNG_Chunk_Steganography_Extracted}'
enc_flag2 = bytes([b ^ 0x77 for b in flag_text2])
custom_chunk = make_chunk(b'nxDS', enc_flag2)

import zlib
idat_raw = zlib.compress(b'\x00\x00\x00\x00')
idat_chunk = make_chunk(b'IDAT', idat_raw)
iend_chunk = make_chunk(b'IEND', b'')

png_data = png_sig + ihdr_chunk + custom_chunk + idat_chunk + iend_chunk

with open(os.path.join(misc2_dir, 'nexus_telemetry.png'), 'wb') as f:
    f.write(png_data)

readme2 = """NEXUS ANOMALOUS IMAGE ARTIFACT // ND-MISC-02
============================================
An image artifact (nexus_telemetry.png) was recovered from an AURELIA diagnostic station.
Incident response noted unusual ancillary structure within the file stream.

Objective: Analyze the PNG chunk structure or inspect custom chunk types to extract the embedded security data. Note that embedded payload bytes are masked with XOR 0x77.
"""
with open(os.path.join(misc2_dir, 'README.txt'), 'w') as f:
    f.write(readme2)

# -------------------------------------------------------------
# MISC-03: ghost_archive.nxc
# -------------------------------------------------------------
misc3_dir = os.path.join(base_dir, "MISC-03")
os.makedirs(misc3_dir, exist_ok=True)

header = b'NXCv1.0\x00'
num_records = 3

r1_id = b'REC-LOG-001'.ljust(16, b'\x00')
r2_id = b'REC-MEM-002'.ljust(16, b'\x00')
r3_id = b'REC-GHOST-99'.ljust(16, b'\x00')

r1_data = b'{"timestamp":"2025-10-14T08:00:00Z","event":"normal_boot"}'
r2_data = b'\x00\x01\x02\x03\x04\x05\x06\x07\x08\x09'

flag_str3 = b'GHOST ARTIFACT CARVED: flag{Ghost_Binary_Container_Carved}'
r3_data = bytes([b ^ 0x44 for b in flag_str3])

header_size = 8 + 4
dir_entry_size = 16 + 2 + 4 + 4
dir_size = dir_entry_size * num_records

off1 = header_size + dir_size
off2 = off1 + len(r1_data)
off3 = off2 + len(r2_data)

entry1 = r1_id + struct.pack('>HII', 1, off1, len(r1_data))
entry2 = r2_id + struct.pack('>HII', 2, off2, len(r2_data))
entry3 = r3_id + struct.pack('>HII', 3, off3, len(r3_data))

container_bytes = header + struct.pack('>I', num_records) + entry1 + entry2 + entry3 + r1_data + r2_data + r3_data

with open(os.path.join(misc3_dir, 'ghost_archive.nxc'), 'wb') as f:
    f.write(container_bytes)

readme3 = """GHOST CONTAINER ARCHIVE ARTIFACT // ND-MISC-03
===============================================
A custom container archive (ghost_archive.nxc) was carved from an unallocated cluster during the GHOST investigation.

NXC File Specification (Big-Endian):
- File Magic (8 bytes): "NXCv1.0\\0"
- Record Count (4 bytes uint32)
- Directory Entries (26 bytes each):
    - Record ID (16 bytes ASCII)
    - Record Type (2 bytes uint16: 1=LOG, 2=BINARY, 3=CLASSIFIED)
    - Data Offset (4 bytes uint32)
    - Data Length (4 bytes uint32)
- Data Payload Area

Objective: Parse the container directory to locate the CLASSIFIED record (Type 3 / REC-GHOST-99). Extract and XOR decode (mask 0x44) its payload to recover the evidence token.
"""
with open(os.path.join(misc3_dir, 'README.txt'), 'w') as f:
    f.write(readme3)

print("MISC artifacts generated successfully.")
