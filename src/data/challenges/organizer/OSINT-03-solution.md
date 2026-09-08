# OSINT-03 — PROJECT AURELIA: Organizer Solution Document

## Challenge Metadata
- **ID**: OSINT-03
- **Title**: PROJECT AURELIA
- **Category**: OSINT
- **Difficulty**: Intermediate/Hard
- **Points**: 300
- **Estimated solve time**: 25-35 minutes

## Story Context
AURELIA was officially launched in 2021, but Dr. Vance joined in 2019. The true origin of AURELIA stems from the suspended Project ECHO from 2018. Participants must reconstruct this development history.

## Exact Solve Path
1. Notice the discrepancy in timeline: AURELIA Alpha began in 2021 (TL-005) but Vance joined in 2019 (TL-004).
2. Go to `/employees/EMP-001` (Dr. Evelyn Vance). Check her publication `PUB-001`.
3. Read `/publications/PUB-001`. It states: "Building upon the suspended heuristic framework from 2018... For the migration framework and constraint implementation, see the initial AURELIA-CORE commit."
4. Navigate to `/repository/REPO-AURELIA-CORE`.
5. Check the commit history. The earliest commit (hash `000aaaa`) by E. Vance is dated 2019-05-01. The message states: "Forked from echo-legacy. Applying constraint limits. Migration key: flag{Aurelia_Echo_Evolution}".

## Evidence Produced
- `PUB-001` links AURELIA to the 2018 framework (Project ECHO).
- `REPO-AURELIA-CORE` commit `000aaaa` explicitly mentions the fork from `echo-legacy`.

## Flag Derivation
The flag is rendered server-side dynamically via `_flagRef_OSINT-03` inside the repository commit message.

## Entities Involved
- **EMP-001** (Dr. Evelyn Vance)
- **PRJ-AURELIA**
- **REPO-AURELIA-CORE**

## Story Events
- **TL-004** (2019 Vance joins)
- **TL-005** (2021 AURELIA Alpha)

## Hints
1. The official timeline states AURELIA began in 2021, but its lead architect joined in 2019. Check her early publications.
2. PUB-001 mentions that AURELIA builds upon a suspended 2018 framework and directs you to a specific repository.
3. Check the initial commits in the AURELIA Core repository to find evidence of the fork/migration from the legacy codebase.

## Possible Unintended Paths
- Searching repository commits indiscriminately.

## Testing Notes
- Check `PUB-001` renders correctly.
- Check `REPO-AURELIA-CORE` lists the 2019 commit and flag renders.
