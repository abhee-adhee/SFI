# CRY-01 — INTERCEPT: Organizer Solution Document

## Challenge Metadata
- **ID**: CRY-01
- **Title**: INTERCEPT
- **Category**: Cryptography
- **Difficulty**: Beginner
- **Points**: 100
- **Estimated solve time**: 10–20 minutes

## Story Context
An internal memo transmitted during the 2018 ECHO migration was intercepted by security monitoring. The memo contains dispatch parameters for the isolated ECHO sub-system.

## Cryptographic Details
- **Primitive**: Vigenère Cipher (Polyalphabetic substitution)
- **Key**: `AURELIA`
- **Ciphertext**: `intercepted_memo.txt`
- **Plaintext**: "NEXUS DYNAMICS INTERNAL MEMO: PROJECT ECHO RECOVERY SUB-SYSTEM. UNTIL SECURITY REVIEW IS COMPLETE, ACCESS DISPATCH PARAMETER IS Vigenere_Intercept_ECHO_Subsystem. DO NOT LEAK THIS MEMO."

## Exact Attack Method
1. Inspect `README.txt` which hints that the key is the codename of the primary AI engine (`AURELIA`).
2. Use CyberChef, dcode.fr, or a simple Python script to perform Vigenère decryption with key `AURELIA`.
3. Locate the dispatch parameter string inside the decrypted message.

## Python Solve Script
```python
def vigenere_decrypt(ciphertext, key):
    res = []
    key_idx = 0
    key = key.upper()
    for ch in ciphertext:
        if 'A' <= ch <= 'Z':
            shift = ord(key[key_idx % len(key)]) - 65
            res.append(chr((ord(ch) - 65 - shift) % 26 + 65))
            key_idx += 1
        elif 'a' <= ch <= 'z':
            shift = ord(key[key_idx % len(key)]) - 65
            res.append(chr((ord(ch) - 97 - shift) % 26 + 97))
            key_idx += 1
        else:
            res.append(ch)
    return "".join(res)

with open("intercepted_memo.txt") as f:
    ct = f.read()

print(vigenere_decrypt(ct, "AURELIA"))
```

## Recovered Evidence & Flag Derivation
- Decrypted Parameter: `Vigenere_Intercept_ECHO_Subsystem`
- Flag: `flag{Vigenere_Intercept_ECHO_Subsystem}`

## Hints
1. Examine the structure of the ciphertext in intercepted_memo.txt. The letter distribution and formatting point to a classic polyalphabetic substitution cipher.
2. The README mentions signal intelligence indicating the key is the codename of the primary AI engine.
3. Decrypt the Vigenère ciphertext using key 'AURELIA' to reveal the dispatch parameter.

## Verification Procedure
Run the Python solve script on `intercepted_memo.txt` and confirm `flag{Vigenere_Intercept_ECHO_Subsystem}` is in the output.
