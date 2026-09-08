# FOR-02 — THE LOG THAT LIED: Organizer Solution Document

## Challenge Metadata
- **ID**: FOR-02
- **Title**: The Log That Lied
- **Category**: Forensics
- **Difficulty**: Intermediate
- **Points**: 200
- **Estimated solve time**: 20–30 minutes

---

## Story Context
During INC-2025-01, session SES-4471-A was used to access the echo-legacy archive. The auth.log incorrectly attributes this session to elena.rostova (EMP-006), sourced from 10.0.3.2. However, the proxy.log (ground truth for network origin) and system.log both show the session originated from 10.0.4.7 — Halpern's workstation. The auth.log is misleading either due to tampering or a misconfiguration in the authentication service that trusted a forwarded identity header.

---

## The Lie
`auth.log` at `03:12:01`:
```
[AUTH] user=elena.rostova src_ip=10.0.3.2 method=TOTP result=SUCCESS session=SES-4471-A
```

**The contradiction**: `proxy.log` at `03:12:01`:
```
[PROXY] nexus-proxy-01 client=10.0.4.7 method=POST ... session=SES-4471-A status=200
```

The proxy never alters client IPs. The auth service received a spoofed identity claim.

---

## Artifact Structure
| File | Contents | Notes |
|---|---|---|
| `auth.log` | Authentication records | MISLEADING — wrong IP for SES-4471-A |
| `proxy.log` | Proxy access log | Ground truth for origin IP |
| `application.log` | AURELIA access log | Contains flag in `receipt_b64` field |
| `system.log` | Kernel + service events | Corroborates proxy.log |

---

## Exact Solve Path
1. Read `README.txt` → understand task: one log lies, correlate session tokens
2. Grep all logs for `SES-4471-A`:
   ```bash
   grep "SES-4471-A" *.log | sort
   ```
3. Compare `auth.log` (claims `src_ip=10.0.3.2`) vs `proxy.log` (shows `client=10.0.4.7`)
4. Identify contradiction: auth.log claims Rostova's IP, proxy says Halpern's workstation
5. Locate the interesting `application.log` entry at `03:15:09`:
   ```
   session=SES-4471-A user=elena.rostova action=READ resource=archive://SYS-ARCHIVE/echo-legacy/ result=200 latency=2104ms receipt_b64=ZmxhZ3tTZXNzaW9uX0hpamFja19Pcl9JbXBlcnNvbmF0aW9ufQ==
   ```
6. Base64-decode `receipt_b64`:
   ```bash
   echo "ZmxhZ3tTZXNzaW9uX0hpamFja19Pcl9JbXBlcnNvbmF0aW9ufQ==" | base64 -d
   ```
   → **`flag{Session_Hijack_Or_Impersonation}`**

---

## Flag
`flag{Session_Hijack_Or_Impersonation}`

---

## Flag Location
`application.log` → line at `03:15:09` → `receipt_b64` field → base64 decoded

---

## Why the Flag is Not Trivially Greppable
- `grep "flag{" *.log` — returns nothing (flag is base64 encoded in a field named `receipt_b64`)
- Participants must identify the correct log entry first
- `receipt_b64` is a plausible-looking field name (access receipt for the archive operation)

---

## Hints
1. "One log source disagrees with the others about who performed the suspicious action. Look for session token SES-4471-A across all four files."
2. "Compare the source IP address attributed to SES-4471-A in auth.log versus what the proxy.log and system.log record for that same session token."
3. "The application.log entry for the archive access at 03:15:09 contains an encoded field called receipt_b64. Decode it."

---

## Entities Involved
- **EMP-006** (Elena Rostova) — falsely attributed identity in auth.log
- **EMP-007** (J.T. Halpern) — actual origin of the session (10.0.4.7)
- **SYS-AURELIA** — session-managed system
- **SYS-ARCHIVE** — accessed resource

---

## Dependencies
- None (independent entry point)

---

## Evidence Links
- SES-4471-A → same session as FOR-01 (PID 3847 spawned under this session)
- SES-4471-A → appears in FOR-04 (incident reconstruction timeline)
- 10.0.4.7 → Halpern's workstation (consistent with FOR-01 wtmp: pts/1 from 10.0.4.1)

---

## Security Notes
- Flag is base64-encoded in a log field — not greppable without first decoding
- No `flag{` appears in plaintext in any artifact

---

## Verification Procedure
1. `grep "flag{" *.log` on all FOR-02 artifacts → must return no results
2. `grep "receipt_b64" application.log` → find the field
3. `echo "ZmxhZ3R..." | base64 -d` → verify flag decodes correctly
4. Confirm SES-4471-A appears with different IPs in auth.log vs proxy.log
