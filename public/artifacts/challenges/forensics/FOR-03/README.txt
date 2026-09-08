================================================================================
NEXUS DYNAMICS — SECURITY INVESTIGATION UNIT
CASE: INC-2025-01 / MEMORY FORENSICS
ARTIFACT PACKAGE: FOR-03 — MEMORY SNAPSHOT
================================================================================

CLASSIFICATION: INVESTIGATION ARTIFACT — AUTHORIZED PERSONNEL ONLY

CONTEXT:
  Workstation: WS-AURELIA-07
  Memory acquired: 2025-08-10 03:19:30 UTC (live acquisition during incident)
  Acquired by: E. Rostova (EMP-006, Lead Security Analyst)
  Method: /proc/mem dump via nexus-memacq v1.4.2
  Total RAM: 8192 MB

  This is a structured memory snapshot in JSON format representing the
  process state, network connections, loaded modules, and string regions
  from the running system at time of acquisition.

  The snapshot was taken 1 minute 46 seconds after PID 3847 was spawned.

ARTIFACT:
  memory_snapshot.json   — Structured memory snapshot (JSON)

ANALYSIS TOOLS:
  This artifact is designed for analysis with standard tooling.
  Recommended: jq, python3, grep

  Example queries:
    List all processes:
      jq '.pslist[] | {pid, ppid, name, user, start_time}' memory_snapshot.json

    Show process tree:
      jq '.pstree' memory_snapshot.json

    List network connections:
      jq '.netscan[] | select(.state == "ESTABLISHED")' memory_snapshot.json

    Dump string regions for a specific PID:
      jq '.string_regions[] | select(.pid == 3847)' memory_snapshot.json

    List loaded modules for a process:
      jq '.modules[] | select(.pid == 3847)' memory_snapshot.json

  Alternatively: python3, grep -a, strings, etc.

INTEGRITY:
  SHA-256: a94f12bc3e1d07c8e5f09a2b4d6e8f01c3a5b7d9e2f4a6c8b0d2e4f6a8c0b2d4

================================================================================
