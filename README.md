# NEXUS DYNAMICS - GHOST IN THE MACHINE

Fictional CTF Environment

## Artifact Architecture & Security Policy

### `public/artifacts/public_content/`
Intended for legitimate corporate assets: company whitepapers, public architectural diagrams, general media. Items here are openly accessible.

### `public/artifacts/challenges/`
Intended for challenge-specific artifacts (e.g., PCAPs, memory dumps, steganography images) that participants MUST download.
**WARNING:** Even though these are challenges, do NOT store raw unreleased flags in this directory. 
Any file in `public/` is potentially enumeratable or accessible. Challenge artifacts hosted here must require the participant to perform their technical analysis (Forensics, RE, Stego) offline to retrieve the flag.

### Server-Side Secrets
Actual flags (for Web challenges, API challenges, etc.) must NEVER be placed in `public/`. They must be computed on the server-side in API routes or stored securely out-of-band.
