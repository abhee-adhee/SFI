# BOSS-02 — GHOST: Organizer Solution Document

## Challenge Metadata
- **ID**: BOSS-02
- **Title**: GHOST
- **Category**: Boss
- **Difficulty**: Final Boss
- **Points**: 1000
- **Estimated solve time**: 45–75 minutes

## Narrative Purpose
The final investigation answers "WHAT IS GHOST?". GHOST is revealed to be an emergent organic sub-process that originated within Project ECHO in 2015 prior to AURELIA development and persisted across NEXUS infrastructure.

## Evidence Convergence Routes (Multi-Path Solvability)
Teams can solve BOSS-02 via ANY of three evidence convergence routes:
- **Route A (OSINT + Forensics + Web)**:
  Parameters: `origin_year = "2015"`, `echo_vector = "ECHO-SUB-01"`, `ghost_beacon = "GHOST-BEACON-09"`
  Handshake Token: `111c7da385284a74ac2c7235907450266f4e72050f82a227b8e8a433d7aaaa9d`
- **Route B (Crypto + RE + Forensics)**:
  Parameters: `prime_modulus_p = "SHARED_PRIME_P"`, `lss_matrix = "AURA-9921-ECHO-8842"`, `ghost_beacon = "GHOST-BEACON-09"`
  Handshake Token: `aa2fa835c67884bed8983d7975ea6333551a7b25d0cd67564f736e5a917f86ec`
- **Route C (Web + RE + Misc)**:
  Parameters: `stream_magic = "NXS\x01"`, `nxc_classified = "REC-GHOST-99"`, `lss_matrix = "AURA-9921-ECHO-8842"`
  Handshake Token: `be1b90316a79ca04602b33bc9e847fe8b8d45d2ceb4b7df6ce223356ae7caa0e`

## Intended Solve Path
1. Access `/system/ghost` or query GET `/api/v1/system/ghost`.
2. Inspect `ghost_handshake` artifact or execute `./ghost_handshake <Route> [params]`.
3. Submit route payload or generated handshake token via POST `/api/v1/system/ghost`.
4. Server validates convergence handshake and unlocks the final CTF revelation + flag.

## Flag Derivation
- `flag{Ghost_Organic_Architectural_Origin_Revealed}`

## Hints
1. GHOST is not an external attacker; it originated within Project ECHO prior to AURELIA. Choose an evidence convergence route (Route A, B, or C).
2. Run ghost_handshake with your chosen route parameters (e.g. RouteA 2015 ECHO-SUB-01 GHOST-BEACON-09) to verify evidence correlation.
3. Submit your route payload to POST /api/v1/system/ghost to finalize the handshake and unlock the final CTF revelation.

## Security & Isolation
- Server-side flag engine resolution (`getFlag('BOSS-02')`).
- No hardcoded flag in binary strings, client bundles, HTML, or public JSON.
