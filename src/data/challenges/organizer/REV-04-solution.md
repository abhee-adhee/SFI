# REV-04 — UNKNOWN: Organizer Solution Document

## Challenge Metadata
- **ID**: REV-04
- **Title**: UNKNOWN
- **Category**: Reverse Engineering
- **Difficulty**: Hard
- **Points**: 400
- **Estimated solve time**: 30–50 minutes

## Story Context
An unidentified legacy bridge binary (`nexus_bridge`) links Project ECHO state modules with AURELIA infrastructure. It contains a multi-stage dispatch state machine.

## Binary Architecture & Build
- **Architecture**: ELF 64-bit LSB executable, x86-64.
- **Compiler**: GCC 13.3 (`gcc -O2 -s`)
- **Binary Size**: ~14 KB

## Control Flow & Function Pointer Dispatch
The main function initializes `bridge_ctx_t` and dispatches execution through `dispatch_table`:
1. `dispatch_table[0]` (`state_init`): Checks `arg1 == "--bridge-mode=legacy"` and `arg2 == "--key=ECHO-HANDSHAKE-0x99"`. Sets `ctx->state = 1`.
2. `dispatch_table[1]` (`state_verify_params`): Checks `ctx->state == 1` and flags `mode_ok` / `key_ok`. Sets `ctx->state = 2`.
3. `dispatch_table[2]` (`state_render`): Checks `ctx->state == 2` and decrypts payload buffer, printing the handoff vector token.

## Exact Solution
Run:
```bash
./nexus_bridge --bridge-mode=legacy --key=ECHO-HANDSHAKE-0x99
```
Output:
`NEXUS BRIDGE ACTIVE: Echo-Aurelia handoff established. Vector: flag{MultiStage_Dispatch_State_Bridge}`

## Recovered Evidence & Flag
- **Handoff Vector Token**: `flag{MultiStage_Dispatch_State_Bridge}`
- **Flag**: `flag{MultiStage_Dispatch_State_Bridge}`

## Hints
1. Examine the main function in GDB or Ghidra. Notice that execution branches through dispatch_table function pointers dependent on ctx.state.
2. Inspect state_init (first table entry) to determine expected command line arguments: --bridge-mode=legacy and --key=ECHO-HANDSHAKE-0x99.
3. Execute ./nexus_bridge --bridge-mode=legacy --key=ECHO-HANDSHAKE-0x99 to complete the 3-stage handoff and output the bridge vector.

## Verification Procedure
Run `./nexus_bridge --bridge-mode=legacy --key=ECHO-HANDSHAKE-0x99` in Linux/WSL and verify `flag{MultiStage_Dispatch_State_Bridge}` is printed.
