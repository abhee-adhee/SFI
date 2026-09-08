# OSINT-01 — NEXUS PUBLIC: Organizer Solution Document

## Challenge Metadata
- **ID**: OSINT-01
- **Title**: NEXUS PUBLIC
- **Category**: OSINT
- **Difficulty**: Beginner
- **Points**: 100
- **Estimated solve time**: 10-15 minutes

## Story Context
Early foundational work by NEXUS Dynamics (2016) was open-sourced to academia. Participants must pivot through the new public UI to uncover the legacy grant and find the foundational codebase containing the flag.

## Exact Solve Path
1. View `/company`. In the "Company Overview", the text states: "Our early research, including the 2016 Foundational AI Grant, has been declassified and is available in the Public Archive."
2. Navigate to `/documents`. Look for the document mentioning the grant: `DOC-005` (Foundational AI Grant Summary).
3. Open `/documents/DOC-005`. The text states: "...archived in the legacy repository 'nexus-foundation'."
4. Navigate to `/repository`. Find the public repository named `nexus-foundation` (ID: `REPO-OPEN-01`).
5. Open `/repository/REPO-OPEN-01`. Read the commit history. The first commit by SYSTEM states: "Initial import of legacy foundation. tag: flag{Nexus_Public_Records_OSINT}".

## Evidence Produced
- `DOC-005` reveals the name of the legacy repository.
- `REPO-OPEN-01` contains the flag in its commit history.

## Flag Derivation
The flag is rendered server-side and presented plainly within the commit message text.

## Entities Involved
- **EMP-005** (Dr. Arthur Penhaligon) - Author of DOC-005
- **PRJ-ECHO** - Associated project for DOC-005
- **REPO-OPEN-01** - Repository holding the evidence

## Story Events
- **TL-001** (2015 Founding of NEXUS)

## Hints
1. Start by reviewing the Company history timeline and mentions of early foundational research.
2. Check the Public Archive for any documents related to the 2016 Foundational AI Grant.
3. The grant summary mentions a legacy codebase that was open-sourced. Find this repository in the Code Repositories section and check its initial commit.

## Possible Unintended Paths
- Searching `repositories.json` directly if it were leaked, but the flag is dynamically fetched using `_flagRef_OSINT-01` so it is not visible in static bundles.

## Testing Notes
- Check that `/documents` lists `DOC-005`.
- Check that `/repository` lists `nexus-foundation`.
- Verify the flag `flag{Nexus_Public_Records_OSINT}` renders in `/repository/REPO-OPEN-01`.
