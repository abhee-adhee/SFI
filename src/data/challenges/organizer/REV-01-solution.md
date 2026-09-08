# REV-01 — THE PROCESS: Organizer Solution Document

## Challenge Metadata
- **ID**: REV-01
- **Title**: THE PROCESS
- **Category**: Reverse Engineering
- **Difficulty**: Beginner
- **Points**: 100
- **Estimated solve time**: 10–20 minutes

## Story Context
A suspicious triage executable (`process_triage`) was captured running on an internal NEXUS server. Participants must analyze the binary to discover the authorization code format.

## Binary Architecture & Build
- **Architecture**: ELF 64-bit LSB executable, x86-64, dynamic linking.
- **Compiler**: GCC 13.3 (`gcc -O2 -s`)
- **Binary Size**: ~14 KB

## Control Flow & Logic
1. Running `strings process_triage` reveals decoy strings (`flag{fake_string_decoy_01}`, `flag{wrong_branch_try_again}`).
2. Inspecting disassembly / decompilation of `validate_code` reveals:
   - Input length must equal 14.
   - Must begin with `NX-`.
   - Must end with `-TRIAGE`.
   - Middle 4 digits must sum to 15 (e.g. `7+7+0+1 = 15` -> `NX-7701-TRIAGE`).
3. Passing `NX-7701-TRIAGE` branches to `render_evidence()`, which decrypts an in-memory byte array using XOR `0x33`.

## Exact Solution
Run:
```bash
./process_triage NX-7701-TRIAGE
```
Output:
`[SUCCESS] System triage code accepted.`
`[EVIDENCE] Forensic artifact token: flag{Control_Flow_Triage_NEXUS}`

## Recovered Evidence & Flag
- **Artifact Token**: `flag{Control_Flow_Triage_NEXUS}`
- **Flag**: `flag{Control_Flow_Triage_NEXUS}`

## Hints
1. Running strings process_triage reveals several decoy flags. Inspect the binary in GDB, Ghidra, or objdump to locate the true validation function validate_code.
2. Examine validate_code: it checks that the input is 14 characters long, starts with 'NX-', ends with '-TRIAGE', and that the middle 4 digits sum to 15.
3. Pass a valid authorization code such as 'NX-7701-TRIAGE' to execute the success branch and reveal the forensic token.

## Verification Procedure
Run `./process_triage NX-7701-TRIAGE` in an ELF x86-64 environment (Linux / WSL) and confirm `flag{Control_Flow_Triage_NEXUS}` is printed.
