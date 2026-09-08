AURELIA GHOST TELEMETRY LOG // ND-CRY-03
===========================================
Intercepted encrypted telemetry stream from AURELIA monitor node.
The telemetry is encrypted using an in-house 24-bit LCG stream cipher implementation (see telemetry_crypto.py).

Files:
- telemetry_crypto.py (Python reference script)
- ghost_telemetry.enc (Hex-encoded encrypted telemetry data)

Known telemetry header prefix:
{"system":"AURELIA","stream":"telemetry","status":"ANOMALY_DETECTED"
