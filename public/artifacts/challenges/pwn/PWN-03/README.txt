AURELIA GATEWAY NODE // ND-PWN-03
=================================
A core AURELIA secure gateway node with an unbounded read vulnerability.
Objective: Analyze the memory layout and win() argument checks to construct a payload executing win(0xDEADBEEF, 0xCAFEBABE).

Artifacts:
- aurelia_gateway (ELF 64-bit LSB executable, x86-64)
- README.txt

Mitigations:
- No Canary (-fno-stack-protector)
- No PIE (-no-pie)
