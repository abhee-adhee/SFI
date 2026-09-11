AURELIA COMMUNICATIONS SIGNAL TRACE // ND-MISC-01
=================================================
A raw binary telemetry stream (signal_stream.bin) was intercepted from an AURELIA RF relay module.

Protocol Framing Format Specification:
- Magic bytes (4 bytes): 0x4E 0x58 0x53 0x01 ('NXS\x01')
- Packet Type (1 byte): 0x01=Header, 0x02=Payload Data, 0x03=Footer
- Payload Length (2 bytes, Big-Endian unsigned short)
- Payload Bytes (Variable length equal to Payload Length)

Objective: Parse the binary stream according to the protocol specification to locate the Payload Data (Type 0x02) packet. Note that Payload Data bytes are masked with XOR 0x2A; XOR-decode the extracted payload to recover the signal token.
