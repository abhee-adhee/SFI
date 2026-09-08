# FOR-03 — MEMORY: Organizer Solution Document

## Challenge Metadata
- **ID**: FOR-03
- **Title**: Memory
- **Category**: Forensics
- **Difficulty**: Intermediate/Hard
- **Points**: 300
- **Estimated solve time**: 25–40 minutes

---

## Story Context
A memory snapshot was taken from WS-AURELIA-07 during the incident. The aurelia-diag process (PID 3847) was still running at acquisition time. Its heap memory contains the GHOST beacon string — evidence that the process was not just a diagnostic tool but a command-and-control implant communicating with 198.51.100.47.

---

## Artifact Structure
`memory_snapshot.json` — queryable with `jq` or `python3`:
- `pslist` — Full process list (flat array)
- `pstree` — Process hierarchy (tree)
- `netscan` — Network connections
- `modules` — Loaded shared libraries per process
- `string_regions` — Extracted strings per PID, per memory region

---

## Anomaly Chain
1. **pslist**: PID 3847 (`aurelia-diag`) running as root, PPID=1241 (jhalpern's bash)
2. **pstree**: Same — `aurelia-diag [ROOT]` is a child of bash, not of systemd or a service manager
3. **netscan**: PID 3847 has ESTABLISHED connection to `198.51.100.47:4444` (external, non-NEXUS)
4. **modules**: PID 3847 loads `libshadow_hook.so.1` — not in any NEXUS software catalog
5. **string_regions heap**: Contains `GHOST_BEACON_V1|node=WS-AURELIA-07|key=ZmxhZ3tHaG9zdF9CZWFjb25fTWVtb3J5X1Jlc2lkZW50fQ==`

---

## Exact Solve Path

### Step 1: List processes
```bash
jq '.pslist[] | {pid, ppid, name, user, start_time}' memory_snapshot.json
# or: jq '.pslist[] | select(.user == "root")' memory_snapshot.json
```
→ Find PID 3847: root-owned, PPID=1241

### Step 2: Verify in process tree
```bash
jq '.pstree' memory_snapshot.json
```
→ Confirm aurelia-diag is a child of bash (user interactive session), not a system service

### Step 3: Check network connections
```bash
jq '.netscan[] | select(.pid == 3847)' memory_snapshot.json
```
→ ESTABLISHED connection to `198.51.100.47:4444` — external C2 suspected

### Step 4: Check loaded modules
```bash
jq '.modules[] | select(.pid == 3847)' memory_snapshot.json
```
→ `libshadow_hook.so.1` is not a registered NEXUS module

### Step 5: Dump string regions
```bash
jq '.string_regions[] | select(.pid == 3847 and .region == "heap")' memory_snapshot.json
```
→ Find string: `GHOST_BEACON_V1|node=WS-AURELIA-07|key=ZmxhZ3tHaG9zdF9CZWFjb25fTWVtb3J5X1Jlc2lkZW50fQ==`

### Step 6: Extract and decode key
```bash
echo "ZmxhZ3tHaG9zdF9CZWFjb25fTWVtb3J5X1Jlc2lkZW50fQ==" | base64 -d
```
→ **`flag{Ghost_Beacon_Memory_Resident}`**

---

## Flag
`flag{Ghost_Beacon_Memory_Resident}`

---

## Flag Location
`memory_snapshot.json` → `.string_regions[]` → `pid == 3847` → `region == "heap"` → GHOST_BEACON_V1 string → `key=` field → base64 decoded

---

## Why Not Trivially Greppable
- `strings memory_snapshot.json | grep flag` → returns nothing (flag is base64 in the key field)
- `grep "flag{" memory_snapshot.json` → returns nothing
- Participant must navigate the process investigation chain to reach PID 3847's heap strings
- The GHOST_BEACON_V1 string is embedded within a JSON string array — participants must know to look in `.string_regions`

---

## Hints
1. "Examine the process tree. One process claims a legitimate parent but does not fit the expected execution hierarchy for a root-level service."
2. "Check the network connections (netscan) for the anomalous process PID. Where is it connecting, and is that destination in the NEXUS IP inventory?"
3. "Dump the string_regions for the suspicious PID and examine the heap region. Look for a structured beacon string containing a key field and decode it."

---

## Entities Involved
- **EMP-007** (J.T. Halpern) — owner of the session that spawned the process
- **SYS-AURELIA** — target system whose diagnostic endpoint was abused

---

## GHOST Narrative Integration
The `GHOST_BEACON_V1` format implies a versioned protocol — this is V1. The beacon contains:
- `node` — compromised host identifier
- `key` — session/authentication key (the flag in this case)
- `beacon_interval=300` — reports back every 5 minutes
- `c2_host=198.51.100.47` — external command and control
This is the first in-memory evidence of the GHOST entity's operational tooling.

---

## Security Notes
- Flag is base64 within a structured string in a JSON array — multiple layers of context needed
- No `flag{` in plaintext anywhere in the artifact
- The mmap region also contains a reference to `/tmp/.d`'s token — intentional cross-challenge coherence

---

## Verification Procedure
1. Run all four jq queries above and confirm expected output
2. Confirm `grep "flag{" memory_snapshot.json` returns nothing
3. Confirm base64 decode of key field produces `flag{Ghost_Beacon_Memory_Resident}`
4. Confirm `_anomaly` field in pstree is not visible in a basic `jq .pslist` query (requires tree traversal or direct access)
