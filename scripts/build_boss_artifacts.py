import os
import subprocess

base_out = os.path.join(os.path.dirname(__file__), "..", "public", "artifacts", "challenges", "bosses")
for boss in ["BOSS-01", "BOSS-02"]:
    os.makedirs(os.path.join(base_out, boss), exist_ok=True)

src_dir = os.path.join(os.path.dirname(__file__), "boss_src")
os.makedirs(src_dir, exist_ok=True)

# -------------------------------------------------------------
# BOSS-01: core_diagnostic.c
# -------------------------------------------------------------
boss1_c = """#include <stdio.h>
#include <string.h>
#include <stdlib.h>

// Expected parameters: timestamp="2025-10-14T08:00:00Z", module_id="AURELIA-CORE-V4"
// Output token: 8d2efcc213b3f8f35e859b62c458744399be773f9d1632585c51d6721d6a0d0c

const char *decoy = "flag{fake_aurelia_core_decoy}";

int main(int argc, char **argv) {
    if (argc < 3) {
        printf("Usage: %s <timestamp> <module_id>\\n", argv[0]);
        return 1;
    }

    if (strcmp(argv[1], "2025-10-14T08:00:00Z") == 0 && strcmp(argv[2], "AURELIA-CORE-V4") == 0) {
        printf("[CORE DIAGNOSTIC STATE] Verification successful.\\n");
        printf("State Token: 8d2efcc213b3f8f35e859b62c458744399be773f9d1632585c51d6721d6a0d0c\\n");
        return 0;
    } else {
        printf("[ERROR] Invalid diagnostic parameters or timestamp mismatch.\\n");
        return 1;
    }
}
"""
with open(os.path.join(src_dir, "boss01.c"), "w") as f:
    f.write(boss1_c)

readme1 = """AURELIA CORE RESTRICTED DIAGNOSTIC MODULE // ND-BOSS-01
======================================================
The deepest diagnostic subsystem for AURELIA core services.

Binary:
- core_diagnostic (ELF 64-bit LSB executable, x86-64)

Usage:
./core_diagnostic <timestamp> <module_id>

Objective:
Pass the historical incident timestamp and target core module ID to derive the state token required for AURELIA Core verification.
"""
with open(os.path.join(base_out, "BOSS-01", "README.txt"), "w") as f:
    f.write(readme1)

# -------------------------------------------------------------
# BOSS-02: ghost_handshake.c
# -------------------------------------------------------------
boss2_c = """#include <stdio.h>
#include <string.h>
#include <stdlib.h>

const char *decoy_ghost = "flag{fake_ghost_boss_token}";

int main(int argc, char **argv) {
    if (argc < 2) {
        printf("Usage: %s <RouteA|RouteB|RouteC> [params...]\\n", argv[0]);
        return 1;
    }

    if (strcmp(argv[1], "RouteA") == 0 && argc >= 5) {
        if (strcmp(argv[2], "2015") == 0 && strcmp(argv[3], "ECHO-SUB-01") == 0 && strcmp(argv[4], "GHOST-BEACON-09") == 0) {
            printf("[GHOST HANDSHAKE VERIFIED] Route A Convergence Validated.\\n");
            printf("Handshake Token: 111c7da385284a74ac2c7235907450266f4e72050f82a227b8e8a433d7aaaa9d\\n");
            return 0;
        }
    } else if (strcmp(argv[1], "RouteB") == 0 && argc >= 5) {
        if (strcmp(argv[2], "SHARED_PRIME_P") == 0 && strcmp(argv[3], "AURA-9921-ECHO-8842") == 0 && strcmp(argv[4], "GHOST-BEACON-09") == 0) {
            printf("[GHOST HANDSHAKE VERIFIED] Route B Convergence Validated.\\n");
            printf("Handshake Token: aa2fa835c67884bed8983d7975ea6333551a7b25d0cd67564f736e5a917f86ec\\n");
            return 0;
        }
    } else if (strcmp(argv[1], "RouteC") == 0 && argc >= 5) {
        if (strcmp(argv[2], "NXS\\\\x01") == 0 && strcmp(argv[3], "REC-GHOST-99") == 0 && strcmp(argv[4], "AURA-9921-ECHO-8842") == 0) {
            printf("[GHOST HANDSHAKE VERIFIED] Route C Convergence Validated.\\n");
            printf("Handshake Token: be1b90316a79ca04602b33bc9e847fe8b8d45d2ceb4b7df6ce223356ae7caa0e\\n");
            return 0;
        }
    }

    printf("[ERROR] Invalid evidence route or parameter correlation failure.\\n");
    return 1;
}
"""
with open(os.path.join(src_dir, "boss02.c"), "w") as f:
    f.write(boss2_c)

readme2 = """GHOST FINAL HANDSHAKE ENGINE // ND-BOSS-02
=========================================
The ultimate GHOST state handshake verification utility.

Binary:
- ghost_handshake (ELF 64-bit LSB executable, x86-64)

Usage:
./ghost_handshake <RouteA|RouteB|RouteC> [param1] [param2] [param3]

Objective:
Correlate evidence parameters along Route A, B, or C to generate the valid final GHOST handshake token.
"""
with open(os.path.join(base_out, "BOSS-02", "README.txt"), "w") as f:
    f.write(readme2)

print("Boss C source files generated successfully.")
