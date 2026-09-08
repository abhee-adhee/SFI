PWN INTERNAL SERVICE DIAGNOSTICS // ND-PWN-02
=============================================
An internal diagnostic service containing a format string vulnerability.
Objective: Exploit the format string leak to discover the secret authorization token stored on the stack and pass the authentication check.

Artifacts:
- internal_service (ELF 64-bit LSB executable, x86-64)
- README.txt

Mitigations:
- Format String Vulnerability in printf(input)
