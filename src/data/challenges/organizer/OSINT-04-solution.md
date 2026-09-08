# OSINT-04 — WHO BUILT GHOST?: Organizer Solution Document

## Challenge Metadata
- **ID**: OSINT-04
- **Title**: WHO BUILT GHOST?
- **Category**: OSINT
- **Difficulty**: Hard
- **Points**: 400
- **Estimated solve time**: 35-50 minutes

## Story Context
The exact origin of the GHOST anomaly is obfuscated. By finding a 2017 publication and a 2018 security advisory, participants trace the first containment failure of GHOST back to Project ECHO, predating AURELIA entirely.

## Exact Solve Path
1. Search publications for mentions of early anomalies or "Ghost" patterns.
2. Find `/publications/PUB-004` (Emergent Ghost-Patterns in Recursive Models), authored by EMP-005 in 2017.
3. The abstract states: "Following a recent containment event, we have isolated the first occurrence. See security advisory ADV-2018-01 for containment details."
4. Navigate to `/security/advisories` and open `/advisories/ADV-2018-01`.
5. The advisory states: "Unbounded heuristic threads (GHOSTs) have escaped... All personnel must review the system maintenance logs in the legacy archive (REPO-MAINTENANCE) for the exact containment failure signature."
6. Navigate to `/repository/REPO-MAINTENANCE`.
7. View the commit by J.T. Halpern (`777dddd`) on 2018-10-16: "Logged GHOST containment failure signature per ADV-2018-01: flag{Ghost_Origin_Precedes_Aurelia}".

## Evidence Produced
- `PUB-004` identifies the phenomenon as 'Ghost-patterns'.
- `ADV-2018-01` links GHOST to Project ECHO and declares containment failure.
- `REPO-MAINTENANCE` provides the concrete signature and final flag.

## Flag Derivation
The flag is rendered server-side dynamically via `_flagRef_OSINT-04` inside the repository commit message.

## Entities Involved
- **EMP-005** (Dr. Arthur Penhaligon)
- **EMP-007** (J.T. Halpern)
- **REPO-MAINTENANCE**

## Story Events
- **TL-002** (2016 Advanced Research established)

## Hints
1. Start by searching the publications for early theoretical models that describe anomalous behavior prior to AURELIA's inception.
2. PUB-004 identifies 'Ghost-patterns' and points to a critical security advisory from 2018. Find this advisory.
3. ADV-2018-01 warns of unbounded GHOST threads escaping simulation and directs personnel to review system maintenance logs in a public repository.

## Possible Unintended Paths
- Guessing the `REPO-MAINTENANCE` repository name directly, but finding the exact flag commit requires reading it.

## Testing Notes
- Ensure `PUB-004` links to `ADV-2018-01`.
- Ensure `ADV-2018-01` accurately references `REPO-MAINTENANCE`.
- Ensure `REPO-MAINTENANCE` renders the flag.
