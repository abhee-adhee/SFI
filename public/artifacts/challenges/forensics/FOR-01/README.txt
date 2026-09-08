================================================================================
NEXUS DYNAMICS — SECURITY INVESTIGATION UNIT
CASE: INC-2025-01 / WORKSTATION TRIAGE
ARTIFACT PACKAGE: FOR-01 — ENDPOINT TRIAGE
================================================================================

CLASSIFICATION: INVESTIGATION ARTIFACT — AUTHORIZED PERSONNEL ONLY

CONTEXT:
  Workstation: WS-AURELIA-07
  Assigned User: J.T. Halpern (EMP-007, Systems Maintainer)
  Acquisition Time: 2025-08-10 04:02:11 UTC
  Acquired By: D. Aris (CSO, EMP-004)

  This workstation artifact was collected during initial triage of INC-2025-01.
  Unusual activity was flagged on the AURELIA support terminal.
  All artifacts are point-in-time snapshots from the acquisition window.

ARTIFACTS INCLUDED:
  ps_list.txt         — Process list at acquisition time
  bash_history.txt    — User shell command history (jhalpern)
  wtmp_decoded.txt    — Login/logout session records
  browser_history.csv — Chromium browser history (jhalpern profile)
  aurelia_support.log — AURELIA support daemon log
  tmp_artifacts.txt   — Directory listing and content dump of /tmp at acquisition

INSTRUCTIONS:
  Investigate the endpoint artifacts to identify the anomalous activity.
  Determine what process was running that should not have been.
  Follow the forensic trail to recover the evidence.

  Standard forensic tools apply: grep, awk, python, strings, xxd, base64.

INTEGRITY:
  SHA-256 checksums are provided in CHECKSUMS.sha256 (in full artifact archive).

================================================================================
