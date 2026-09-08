NEXUS ANOMALOUS IMAGE ARTIFACT // ND-MISC-02
============================================
An image artifact (nexus_telemetry.png) was recovered from an AURELIA diagnostic station.
Incident response noted unusual ancillary structure within the file stream.

Objective: Analyze the PNG chunk structure or inspect custom chunk types to extract the embedded security data. Note that embedded payload bytes are masked with XOR 0x77.
