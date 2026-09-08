PWN TERMINAL CONTROL // ND-PWN-01
===================================
A vulnerable control terminal interface running on an internal NEXUS node.
Objective: Exploit the stack buffer overflow vulnerability to redirect execution to the win() function.

Artifacts:
- broken_terminal (ELF 64-bit LSB executable, x86-64)
- README.txt

Mitigations:
- No Canary (-fno-stack-protector)
- No PIE (-no-pie)
- NX Enabled
