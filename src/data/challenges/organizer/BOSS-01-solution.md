# BOSS-01 — AURELIA CORE: Organizer Solution Document

## Challenge Metadata
- **ID**: BOSS-01
- **Title**: AURELIA CORE
- **Category**: Boss
- **Difficulty**: Boss
- **Points**: 1000
- **Estimated solve time**: 40–60 minutes

## Narrative Purpose
The participants reach the restricted diagnostic layer of AURELIA at `/aurelia/core`. They must demonstrate that AURELIA is built directly on top of legacy ECHO components and state transitions.

## Technical Architecture & Evidence Graph
- **Route**: `/aurelia/core` & `/api/v1/aurelia/core`
- **Primary Disciplines**: WEB/API + REVERSE ENGINEERING + FORENSICS
- **Required Evidence**:
  - `FOR-04`: Incident Timestamp (`2025-10-14T08:00:00Z`)
  - `REV-04`: Core Module Identifier (`AURELIA-CORE-V4`)
- **Supporting Evidence**:
  - `WEB-05`: SSRF Endpoint Discovery
  - `CRY-04`: RSA Shared Prime

## Intended Solve Path
1. Access `/aurelia/core` or query GET `/api/v1/aurelia/core` to discover diagnostic parameters and artifact location.
2. Download `public/artifacts/challenges/bosses/BOSS-01/core_diagnostic`.
3. Reverse engineer `core_diagnostic` or run `./core_diagnostic 2025-10-14T08:00:00Z AURELIA-CORE-V4` in Linux/WSL.
4. Binary calculates SHA256 state token: `8d2efcc213b3f8f35e859b62c458744399be773f9d1632585c51d6721d6a0d0c`.
5. Submit token via UI or POST `/api/v1/aurelia/core` `{ action: "verify", token: "8d2efcc213b3f8f35e859b62c458744399be773f9d1632585c51d6721d6a0d0c" }`.
6. Receive flag: `flag{Aurelia_Core_Diagnostic_State_Reconstructed}`.

## Flag Derivation
- `flag{Aurelia_Core_Diagnostic_State_Reconstructed}`

## Hints
1. Access /aurelia/core or inspect /api/v1/aurelia/core to discover the internal diagnostic component parameters.
2. Analyze the core_diagnostic binary with timestamp '2025-10-14T08:00:00Z' and module ID 'AURELIA-CORE-V4' to calculate the state token.
3. Submit the calculated token '8d2efcc213b3f8f35e859b62c458744399be773f9d1632585c51d6721d6a0d0c' to POST /api/v1/aurelia/core.

## Verification & Security Boundaries
- Deterministic, stateless verification via SHA256 digest calculation.
- Server-side flag engine resolution (`getFlag('BOSS-01')`). Zero plaintext flag leakage in client assets.
