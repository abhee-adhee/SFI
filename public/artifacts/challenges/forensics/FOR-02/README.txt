================================================================================
NEXUS DYNAMICS — SECURITY INVESTIGATION UNIT
CASE: INC-2025-01 / LOG CORRELATION ANALYSIS
ARTIFACT PACKAGE: FOR-02 — MULTI-SOURCE LOG CORRELATION
================================================================================

CLASSIFICATION: INVESTIGATION ARTIFACT — AUTHORIZED PERSONNEL ONLY

CONTEXT:
  Incident: INC-2025-01
  Date: 2025-08-10
  Time Window: 03:00:00 — 03:30:00 UTC
  Systems: SYS-AURELIA, SYS-ARCHIVE, SYS-GRID

  Four log sources have been extracted from the relevant systems.
  All logs cover the same incident window.
  These logs do NOT all tell the same story.

ARTIFACTS INCLUDED:
  application.log   — AURELIA node access and session log
  auth.log          — Authentication and authorization log
  proxy.log         — Forward proxy access log (all traffic through nexus-proxy-01)
  system.log        — System event log (kernel + service events)

TASK:
  Correlate the log sources to identify the true sequence of events.
  One log source contains a misleading or inconsistent record.
  Identify the session of interest and trace it across all four logs.
  The forensic evidence is embedded in the authentic log entries.

  Standard forensic tools: grep, awk, jq, python, cut, sort.

  Recommended starting approach:
    grep -h "SES-" *.log | sort -k1,2

================================================================================
