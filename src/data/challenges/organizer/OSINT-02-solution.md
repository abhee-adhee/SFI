# OSINT-02 — THE MISSING RESEARCHER: Organizer Solution Document

## Challenge Metadata
- **ID**: OSINT-02
- **Title**: THE MISSING RESEARCHER
- **Category**: OSINT
- **Difficulty**: Intermediate
- **Points**: 200
- **Estimated solve time**: 20-30 minutes

## Story Context
Dr. Arthur Penhaligon has an apparent gap in his public history relating to Project ECHO. A publication was retracted due to containment failure. Participants must follow the breadcrumbs from his profile to the retracted publication, and finally to the post-mortem document.

## Exact Solve Path
1. Navigate to `/employees/EMP-005` (Dr. Arthur Penhaligon). Note his publications: `PUB-003`, `PUB-004`.
2. Navigate to `/publications/PUB-003`. Observe its status is "RETRACTED". 
3. Read the retraction notice: "Withdrawn by author due to uncontainable anomalies... Refer to the Project ECHO safety post-mortem (DOC-006)."
4. Navigate to `/documents/DOC-006`.
5. Read the post-mortem document. It reveals the flag in the "Final containment hash": `flag{Penhaligon_Retracted_Research}`.

## Evidence Produced
- `PUB-003` points out the retraction and refers to `DOC-006`.
- `DOC-006` contains the safety review and the flag.

## Flag Derivation
The flag is rendered server-side dynamically via `_flagRef_OSINT-02` inside the `DOC-006` content.

## Entities Involved
- **EMP-005** (Dr. Arthur Penhaligon)
- **PRJ-ECHO**

## Story Events
- **TL-002** (2016 Advanced Research established)

## Hints
1. Start with the public history of the Director of Advanced Research. Review his assigned projects and publications.
2. One of his publications has been retracted due to uncontainable anomalies. What document does the retraction note point you to?
3. Search the Public Archive for the Project ECHO safety post-mortem mentioned in the retraction notice.

## Possible Unintended Paths
- Guessing document IDs (`DOC-006`), but without knowing the context, it's just sequential scraping.

## Testing Notes
- Ensure `EMP-005` lists `PUB-003` under Publications.
- Ensure `PUB-003` shows the retraction UI (red highlight).
- Ensure `DOC-006` displays the flag.
