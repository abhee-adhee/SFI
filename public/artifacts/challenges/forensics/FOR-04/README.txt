================================================================================
NEXUS DYNAMICS — SECURITY INVESTIGATION UNIT
CASE: INC-2025-01 / INCIDENT RECONSTRUCTION
ARTIFACT PACKAGE: FOR-04 — THE OFFICIAL TIMELINE
================================================================================

CLASSIFICATION: INVESTIGATION ARTIFACT — AUTHORIZED PERSONNEL ONLY

CONTEXT:
  This package contains the evidence used by NEXUS Security to produce
  the official incident report for INC-2025-01.

  NEXUS Security issued a public statement and internal report characterizing
  the incident as "a minor routing deviation resolved by Zero-Trust enforcement."

  Your task: verify the official narrative against the evidence.

ARTIFACTS INCLUDED:
  official_incident_report.txt  — NEXUS official incident timeline and findings
  aurelia_event_log.jsonl       — AURELIA Core telemetry event log (JSONL format)
  browser_forensics.json        — Browser artifact from WS-AURELIA-07
  process_ledger.csv            — Process accounting records for 2025-08-10
  network_pcap_summary.txt      — Summarized network flows (2025-08-10 02:00–04:00 UTC)
  doc_metadata.txt              — File system metadata for files accessed during incident

TASK:
  Compare the official incident report against the artifact evidence.
  Reconstruct the actual sequence of events.
  Identify:
    1. When did anomalous activity ACTUALLY begin?
    2. What sensitive data was accessed (if any)?
    3. What does the AURELIA telemetry show that the report omits?
    4. Does the process accounting contradict the report?

  The flag is embedded in one of the artifacts.
  It will only be reached by correctly identifying the key contradiction
  and examining the relevant telemetry entry.

TOOLS:
  grep, jq, python3, awk, cut, sort, date

  Useful jq command:
    jq 'select(.level == "ANOMALY")' aurelia_event_log.jsonl

  Useful grep:
    grep "ANOMALY\|ERROR\|CRITICAL" aurelia_event_log.jsonl

================================================================================
