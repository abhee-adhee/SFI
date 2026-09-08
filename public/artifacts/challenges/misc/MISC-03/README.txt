GHOST CONTAINER ARCHIVE ARTIFACT // ND-MISC-03
===============================================
A custom container archive (ghost_archive.nxc) was carved from an unallocated cluster during the GHOST investigation.

NXC File Specification (Big-Endian):
- File Magic (8 bytes): "NXCv1.0\0"
- Record Count (4 bytes uint32)
- Directory Entries (26 bytes each):
    - Record ID (16 bytes ASCII)
    - Record Type (2 bytes uint16: 1=LOG, 2=BINARY, 3=CLASSIFIED)
    - Data Offset (4 bytes uint32)
    - Data Length (4 bytes uint32)
- Data Payload Area

Objective: Parse the container directory to locate the CLASSIFIED record (Type 3 / REC-GHOST-99). Extract and XOR decode (mask 0x44) its payload to recover the evidence token.
