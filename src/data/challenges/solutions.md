# WEB CHALLENGE SOLUTIONS (ORGANIZER ONLY)

This document contains the exact implementation details, exploits, and testing notes for the 5 web challenges.

## WEB-01: Public Surface
- **ID**: WEB-01
- **Title**: Public Surface
- **Difficulty**: BEGINNER
- **Objective**: Discover undocumented API behavior to expose internal developer metadata.
- **Story Context**: "What is NEXUS exposing?" The public employee endpoint leaks metadata if queried improperly.
- **Vulnerability**: Excessive Data Exposure / Undocumented Parameter Fuzzing.
- **Intended Solve Path**:
  1. Inspect network traffic to `GET /api/v1/employees`.
  2. Notice the normal JSON structure.
  3. Fuzz or guess parameters (e.g., `?debug=true` or `?include_metadata=true`).
  4. The response expands to include `_internal_meta` for each employee.
  5. The flag is located in `EMP-001`'s admin notes.
- **Evidence Produced**: The first flag, indicating NEXUS is leaking internal build data.
- **Entities Involved**: `EMP-001`
- **Hint 1**: "Have you checked what the API returns in normal circumstances? What if it's in a debug state?"
- **Hint 2**: "Try adding common debug parameters to the query string."
- **Hint 3**: "`?debug=true`"
- **Secret/Flag Storage**: Dynamically retrieved from `src/lib/secrets.ts` (server-side only) via base64 obfuscation.
- **Security Boundaries**: No actual sensitive data exposed, just mock developer notes.
- **Reset/State**: Fully stateless.

## WEB-02: Degraded
- **ID**: WEB-02
- **Title**: Degraded
- **Difficulty**: BEGINNER/INTERMEDIATE
- **Objective**: Use a diagnostic header to force an endpoint into a degraded telemetry mode.
- **Story Context**: "Something about the API is wrong."
- **Vulnerability**: Method/Header specific behavior manipulation.
- **Intended Solve Path**:
  1. Hit `GET /api/v1/status`.
  2. Notice the HTTP response header `X-Diagnostic-Mode: disabled`.
  3. Re-send the request with the header `X-Diagnostic-Mode: enabled`.
  4. The endpoint returns a degraded diagnostic payload containing the flag.
- **Hint 1**: "Check the HTTP response headers carefully."
- **Hint 2**: "The server is explicitly telling you a mode is disabled. What if it wasn't?"
- **Hint 3**: "Send `X-Diagnostic-Mode: enabled` as a request header."
- **Secret/Flag Storage**: Server-side vault.
- **Reset/State**: Fully stateless.

## WEB-03: The Employee Who Doesn't Exist
- **ID**: WEB-03
- **Title**: The Employee Who Doesn't Exist
- **Difficulty**: INTERMEDIATE
- **Objective**: Bypass document clearance validation to retrieve a restricted document.
- **Story Context**: "Someone has access they shouldn't."
- **Vulnerability**: Insecure Direct Object Reference (IDOR) with HTTP Parameter Pollution (HPP).
- **Intended Solve Path**:
  1. Hit `GET /api/v1/documents/secure?id=DOC-004`. Get 403 Forbidden.
  2. Hit `GET /api/v1/documents/secure?id=DOC-001`. Get 200 OK (Public document).
  3. Send `?id=DOC-001&id=DOC-004`.
  4. The validation logic checks the first parameter (`DOC-001`) and passes the clearance check.
  5. The backend fetch logic uses the last parameter (`DOC-004`) and returns the restricted document, along with the flag.
- **Hint 1**: "Can you ask for two documents at once?"
- **Hint 2**: "Sometimes validation checks the first item, but data retrieval uses the last."
- **Hint 3**: "Try `?id=[public_doc]&id=[restricted_doc]`."
- **Secret/Flag Storage**: Server-side vault.
- **Reset/State**: Fully stateless.

## WEB-04: Ghost Request
- **ID**: WEB-04
- **Title**: Ghost Request
- **Difficulty**: INTERMEDIATE
- **Objective**: Bypass telemetry sanitization using type juggling.
- **Story Context**: "This traffic resembles GHOST."
- **Vulnerability**: Type Juggling / Parser Normalization Discrepancy.
- **Intended Solve Path**:
  1. POST to `/api/v1/aurelia/telemetry` with `{"node": "GHOST"}`. Rejected.
  2. The validator expects a string and strictly blocks "GHOST".
  3. Send an array: `{"node": ["GHOST"]}`.
  4. The validator allows objects/arrays. The backend uses `String(node)`, which coerces `["GHOST"]` to `"GHOST"`, bypassing the filter.
- **Hint 1**: "The filter is looking for a string. Is there another JSON type that might bypass a `typeof string` check but still resolve to a string later?"
- **Hint 2**: "Try sending the data inside an array."
- **Hint 3**: `{"node": ["GHOST"]}`
- **Secret/Flag Storage**: Server-side vault.
- **Reset/State**: Fully stateless.

## WEB-05: Core Breach
- **ID**: WEB-05
- **Title**: Core Breach
- **Difficulty**: HARD
- **Objective**: Perform a simulated Server-Side Request Forgery to access an internal service.
- **Story Context**: "There is an internal system hidden behind the public application."
- **Vulnerability**: Simulated Local SSRF (Regex Bypass).
- **Intended Solve Path**:
  1. Hit `/api/v1/proxy/health` with `{"target": "https://dc-europe.nexus.local/health"}`. Normal response.
  2. Hit it with `{"target": "https://core-internal.nexus.local/diagnostics"}`. Blocked by regex enforcing `dc-europe.nexus.local`.
  3. The regex is flawed: `^https?:\/\/.*dc-europe.nexus.local.*`.
  4. Send `{"target": "https://core-internal.nexus.local/diagnostics#dc-europe.nexus.local"}`.
  5. The regex passes. The simulated internal network routes `core-internal.nexus.local` and returns the flag.
- **Security Control**: The resolver is *simulated in-process*. It does not use `fetch()`. It cannot reach real hosts, localhost, or `.env` files.
- **Hint 1**: "The proxy validates the URL string, but how does the underlying URL parser split the host and the fragment?"
- **Hint 2**: "Can you include the allowed domain in a part of the URL that the parser ignores, like the hash/fragment?"
- **Hint 3**: "Append `#dc-europe.nexus.local` to the restricted target URL."
- **Secret/Flag Storage**: Server-side vault.
- **Reset/State**: Fully stateless.
