#include <stdio.h>
#include <string.h>
#include <stdlib.h>

const char *decoy_ghost = "flag{fake_ghost_boss_token}";

int main(int argc, char **argv) {
    if (argc < 2) {
        printf("Usage: %s <RouteA|RouteB|RouteC> [params...]\n", argv[0]);
        return 1;
    }

    if (strcmp(argv[1], "RouteA") == 0 && argc >= 5) {
        if (strcmp(argv[2], "2015") == 0 && strcmp(argv[3], "ECHO-SUB-01") == 0 && strcmp(argv[4], "GHOST-BEACON-09") == 0) {
            printf("[GHOST HANDSHAKE VERIFIED] Route A Convergence Validated.\n");
            printf("Handshake Token: 111c7da385284a74ac2c7235907450266f4e72050f82a227b8e8a433d7aaaa9d\n");
            return 0;
        }
    } else if (strcmp(argv[1], "RouteB") == 0 && argc >= 5) {
        if (strcmp(argv[2], "SHARED_PRIME_P") == 0 && strcmp(argv[3], "AURA-9921-ECHO-8842") == 0 && strcmp(argv[4], "GHOST-BEACON-09") == 0) {
            printf("[GHOST HANDSHAKE VERIFIED] Route B Convergence Validated.\n");
            printf("Handshake Token: aa2fa835c67884bed8983d7975ea6333551a7b25d0cd67564f736e5a917f86ec\n");
            return 0;
        }
    } else if (strcmp(argv[1], "RouteC") == 0 && argc >= 5) {
        if (strcmp(argv[2], "NXS\\x01") == 0 && strcmp(argv[3], "REC-GHOST-99") == 0 && strcmp(argv[4], "AURA-9921-ECHO-8842") == 0) {
            printf("[GHOST HANDSHAKE VERIFIED] Route C Convergence Validated.\n");
            printf("Handshake Token: be1b90316a79ca04602b33bc9e847fe8b8d45d2ceb4b7df6ce223356ae7caa0e\n");
            return 0;
        }
    }

    printf("[ERROR] Invalid evidence route or parameter correlation failure.\n");
    return 1;
}
