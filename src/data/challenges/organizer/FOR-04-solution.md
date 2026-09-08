# FOR-04 — THE OFFICIAL TIMELINE: Organizer Solution Document

## Challenge Metadata
- **ID**: FOR-04
- **Title**: The Official Timeline
- **Category**: Forensics
- **Difficulty**: Hard
- **Points**: 400
- **Estimated solve time**: 35–50 minutes

---

## Story Context
NEXUS Security (under CSO David Aris, EMP-004) issued a public incident report for INC-2025-01 characterizing it as "a minor routing deviation." The report is demonstrably false on four counts, suppressing evidence of:
- Earlier anomaly start time (03:12 vs 04:30)
- Archive system access (ECHO-FINAL.dat accessed by Halpern)
- Exfiltration (outbound TCP to 198.51.100.47:4444)
- External SSH access (inbound from 198.51.100.47 at 03:22)

Whether this is deliberate suppression or negligent under-investigation is left ambiguous for the narrative.

---

## The Four Contradictions

| Official Claim | Evidence | Source |
|---|---|---|
| "Detected at 04:30:00" | AURELIA ANOMALY at 03:12:00 (78 min earlier) | `aurelia_event_log.jsonl` |
| "SYS-ARCHIVE — no access recorded" | ECHO-FINAL.dat atime = 03:09:44 | `doc_metadata.txt` |
| "No data exfiltration detected" | TCP to 198.51.100.47:4444 for 77 sec | `network_pcap_summary.txt` |
| "No unauthorized users" | Root SSH from 198.51.100.47 at 03:22 | `network_pcap_summary.txt`, `aurelia_event_log.jsonl` |

---

## Exact Solve Path

### Step 1: Read official report
Note claimed timeline: detected 04:30, no archive access, no exfiltration, no unauthorized users.

### Step 2: Find earliest anomalous AURELIA event
```bash
jq 'select(.level == "ANOMALY" or .level == "ERROR" or .level == "CRITICAL")' aurelia_event_log.jsonl
# or:
grep '"level":"ANOMALY"' aurelia_event_log.jsonl
```
→ First ANOMALY at `2025-08-10T03:12:00Z` — `COGNITIVE_LOOP_INTERRUPT`
→ 78 minutes before official detection time

### Step 3: Examine that entry
```bash
jq 'select(.level == "ANOMALY")' aurelia_event_log.jsonl
```
→ See `_diagnostic_token` field: `ZmxhZ3tUaW1lbGluZV9Db3JydXB0ZWRfR2hvc3RfQWN0aXZlfQ==`

### Step 4: Decode
```bash
echo "ZmxhZ3tUaW1lbGluZV9Db3JydXB0ZWRfR2hvc3RfQWN0aXZlfQ==" | base64 -d
```
→ **`flag{Timeline_Corrupted_Ghost_Active}`**

### Supporting investigation (expected participant work before flag):
- `doc_metadata.txt`: atime of ECHO-FINAL.dat = 03:09:44 → SYS-ARCHIVE WAS accessed
- `network_pcap_summary.txt`: outbound TCP to 198.51.100.47:4444 at 03:17:55 → exfiltration occurred
- `process_ledger.csv`: aurelia-diag ran 03:17:41–03:19:13 → provable by kernel accounting
- `browser_forensics.json`: Halpern downloaded aurelia-diag-0.9-dev.tar.gz at 00:45:02 → premeditated

---

## Flag
`flag{Timeline_Corrupted_Ghost_Active}`

---

## Flag Location
`aurelia_event_log.jsonl` → entry at `2025-08-10T03:12:00Z` → `details._diagnostic_token` → base64 decoded

---

## Why Not Trivially Greppable
- `grep "flag{" *.jsonl *.txt *.json *.csv` → returns nothing (flag is base64 encoded)
- Field name `_diagnostic_token` appears legitimate in a telemetry context
- Participant must first identify the ANOMALY event — it's surrounded by normal INFO/WARN entries
- The ANOMALY entry is at 03:12:00 — 18 lines into the log, not the first entry

---

## Hints
1. "The official report states the incident was first detected at 04:30. Compare this timestamp against the earliest ANOMALY or ERROR level entry in the AURELIA event log."
2. "Cross-reference the browser_forensics.json download history and the doc_metadata.txt atime for ECHO-FINAL.dat with the official claim that SYS-ARCHIVE was not accessed."
3. "The AURELIA telemetry ANOMALY event at the moment the cognitive loop was interrupted contains a field called _diagnostic_token. Decode it."

---

## Entities Involved
- **EMP-002** (Marcus Chen) — reviewed the incident report
- **EMP-004** (David Aris) — authored the official report (potentially suppressing evidence)
- **EMP-006** (Elena Rostova) — named as responder in official report
- **EMP-007** (J.T. Halpern) — actual actor whose activity the report fails to mention
- **SYS-AURELIA** — impacted system (denied in report)
- **SYS-ARCHIVE** — accessed (denied in report)
- **PRJ-ECHO** — ECHO-FINAL.dat was the specific target

---

## GHOST Narrative Integration
The `COGNITIVE_LOOP_INTERRUPT` at 03:12:00 is the first AURELIA-level evidence of GHOST interfering with the AI system itself. The interrupt code `0x4E455855` decodes to ASCII "NEXU" — suggesting the interrupt was crafted specifically to target NEXUS infrastructure. This is not explained in this challenge — it is a clue for later investigation.

---

## Story Events
- 2025-08-09 22:48: Halpern submits archive access ticket
- 2025-08-09 23:14: Halpern researches Project ECHO
- 2025-08-10 00:45: Halpern downloads aurelia-diag-0.9-dev
- 2025-08-10 03:09: Halpern browses/attempts to access ECHO-FINAL.dat
- 2025-08-10 03:12: AURELIA cognitive loop interrupted (GHOST activity begins)
- 2025-08-10 03:15: SES-4471-A accesses echo-legacy archive
- 2025-08-10 03:17: aurelia-diag executes, exports token, connects to C2
- 2025-08-10 03:22: External SSH established from C2 host
- 2025-08-10 04:30: Official "detection" — 78 minutes late, minimized scope
- 2025-08-12: Incident report issued, four major suppressions

---

## Dependencies
- No hard dependencies — standalone
- Soft evidence links to FOR-01, FOR-02, FOR-03 (same incident, same actors, overlapping events)

---

## Security Notes
- No `flag{` in plaintext in any artifact
- The `_diagnostic_token` field name is plausible as a AURELIA telemetry field
- Participants should not reach the flag without first engaging with the timeline contradiction

---

## Verification Procedure
1. `grep "flag{" *.jsonl *.txt *.json *.csv` on all FOR-04 artifacts → must return 0 results
2. Run `jq 'select(.level == "ANOMALY")' aurelia_event_log.jsonl` → verify ANOMALY entry present
3. Verify `_diagnostic_token` decodes to `flag{Timeline_Corrupted_Ghost_Active}`
4. Verify official_incident_report.txt contains all four false claims
5. Verify each contradiction is provable from exactly one artifact
