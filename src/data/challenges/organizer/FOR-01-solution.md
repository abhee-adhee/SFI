# FOR-01 — FIRST TRACE: Organizer Solution Document

## Challenge Metadata
- **ID**: FOR-01
- **Title**: First Trace
- **Category**: Forensics
- **Difficulty**: Beginner
- **Points**: 100
- **Estimated solve time**: 10–20 minutes
- **Author note**: Teaches basic endpoint triage — the foundation skill for all forensics work.

---

## Story Context
J.T. Halpern (EMP-007), Systems Maintainer, used his access to WS-AURELIA-07 (an AURELIA support terminal) to download an unofficial `aurelia-diag` binary and run it against NEXUS internal endpoints. The binary exported an internal diagnostic token to `/tmp/.d`. This is the first observable trace of GHOST activity on a NEXUS endpoint.

---

## Artifact Structure
| File | Contents | Purpose |
|---|---|---|
| `README.txt` | Context + instructions | Entry point |
| `ps_list.txt` | Full process snapshot | Anomalous PID 3847 visible |
| `bash_history.txt` | Shell history | curl command + output file revealed |
| `wtmp_decoded.txt` | Login records | Normal activity baseline |
| `browser_history.csv` | Browser history | Shows ECHO research premeditation |
| `aurelia_support.log` | AURELIA daemon log | Timestamps corroborate PID 3847 |
| `tmp_artifacts.txt` | /tmp listing + hex dump | Contains flag (base64 in JSON, hex-encoded) |

---

## Intended Discovery
`aurelia-diag` (PID 3847) is anomalous because:
1. It is a **root process** (uid=0)
2. Its **PPID is 1241** — jhalpern's interactive bash shell (not a system service or init)
3. Its **start time is 03:17:41** — during the incident window
4. `aurelia-diag` is not a registered NEXUS service

---

## Exact Solve Path
1. Open `ps_list.txt` → scan for unusual processes
2. Notice PID 3847: `aurelia-diag` running as root, PPID=1241 (bash), START=03:17
3. Open `bash_history.txt` → find the curl command:
   `curl -s http://core-internal.nexus.local/diag/export -H "X-Debug-Token: $(sudo cat /etc/.nexus_token)" -o /tmp/.d`
4. Note the output file: `/tmp/.d`
5. Open `tmp_artifacts.txt` → find `/tmp/.d` in listing (hidden, owned by root, 183 bytes)
6. Read the hex dump of `/tmp/.d`
7. Decode hex → JSON:
   ```json
   {
     "source": "nexus-diag-export",
     "node": "WS-AURELIA-07",
     "timestamp": "2025-08-10T03:17:52Z",
     "token": "ZmxhZ3tHaG9zdF9GaXJzdF9Gb290cHJpbnR9",
     "status": "export_complete"
   }
   ```
8. Base64-decode `token` value → **`flag{Ghost_First_Footprint}`**

### Decode commands:
```bash
# Decode hex dump to text (copy hex bytes without offsets/ASCII):
echo "7b 0a 20 20..." | xxd -r -p
# Or use python:
python3 -c "import binascii; print(binascii.unhexlify('7b0a2020...').decode())"

# Base64 decode:
echo "ZmxhZ3tHaG9zdF9GaXJzdF9Gb290cHJpbnR9" | base64 -d
```

---

## Flag
`flag{Ghost_First_Footprint}`

---

## Flag Location
`tmp_artifacts.txt` → hex dump → JSON `token` field → base64 decoded

---

## Hints
1. "One process in the list does not belong. Examine its parent PID, user context, and creation time carefully."
2. "Correlate the anomalous process PID with the shell history. What command spawned it, and what output file did it create?"
3. "The command wrote output to a hidden file in /tmp. The tmp_artifacts.txt listing shows its contents as a hex dump. Decode the hex, read the JSON, and decode the token field."

---

## Entities Involved
- **EMP-007** (J.T. Halpern) — actor
- **SYS-AURELIA** — targeted system

---

## Story Events
- 2025-08-10: Halpern runs unauthorized aurelia-diag binary, extracts diagnostic token
- This is the first endpoint trace of the GHOST operation

---

## Dependencies
- None (entry point)

---

## Evidence Links
- Connects forward to FOR-02 (same session SES-4471-A, same PID 3847)
- Connects forward to FOR-04 (same timestamp, same export data)

---

## Security Notes
- Flag is embedded in hex-encoded content inside a text file in `public/` — correct and intentional
- Flag requires two decoding steps (hex → JSON → base64) — not trivially greppable
- `strings artifact | grep flag` does NOT work (flag is base64 encoded inside hex)
- Audit script only checks `.next/static` — public/ artifact files are not scanned

---

## Verification Procedure
1. Confirm `tmp_artifacts.txt` contains hex dump with correct bytes
2. Decode hex → verify JSON structure with `token` field
3. Decode token → verify `flag{Ghost_First_Footprint}`
4. Confirm no direct plaintext `flag{` appears in any artifact file (grep `public/artifacts/challenges/forensics/FOR-01/` for `flag{`)
5. Confirm build succeeds and artifact is served at correct URL
