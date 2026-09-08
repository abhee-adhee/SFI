ECHO LEGACY CRYPTOGRAPHY ARTIFACT // ND-CRY-04
================================================
During the 2019 architecture migration, AURELIA's cryptographic module re-used prime generation seeds from Project ECHO.

Files provided:
- aurelia_system.pub (AURELIA public key)
- echo_legacy.pub (ECHO legacy public key)
- archive_secret.enc (Encrypted ECHO archive payload)

Exploit the shared prime vulnerability to factor the modulus of echo_legacy.pub and recover the archive payload.
