#include <stdio.h>
#include <string.h>
#include <stdlib.h>

const char *decoy_1 = "flag{fake_string_decoy_01}";
const char *decoy_2 = "flag{wrong_branch_try_again}";

static const unsigned char flag_enc[] = {
  85, 95, 82, 84, 72, 112, 92, 93, 71, 65, 92, 95, 108, 117, 95, 92, 68, 108, 103, 65, 90, 82, 84, 86, 108, 125, 118, 107, 102, 96, 78, 0
};

int validate_code(const char *input) {
  if (strlen(input) != 14) return 0;
  if (strncmp(input, "NX-", 3) != 0) return 0;
  if (strcmp(input + 7, "-TRIAGE") != 0) return 0;
  
  int sum = 0;
  for (int i = 3; i < 7; i++) {
    if (input[i] < '0' || input[i] > '9') return 0;
    sum += (input[i] - '0');
  }
  return (sum == 15);
}

void render_evidence(void) {
  char flag_buf[64];
  size_t len = sizeof(flag_enc) - 1;
  for (size_t i = 0; i < len; i++) {
    flag_buf[i] = flag_enc[i] ^ 0x33;
  }
  flag_buf[len] = '\0';
  printf("[SUCCESS] System triage code accepted.\n");
  printf("[EVIDENCE] Forensic artifact token: %s\n", flag_buf);
}

int main(int argc, char **argv) {
  char input[64];
  printf("NEXUS System Triage Utility v1.0.4\n");
  printf("Enter authorization code: ");
  
  if (argc > 1) {
    strncpy(input, argv[1], sizeof(input) - 1);
    input[sizeof(input) - 1] = '\0';
  } else {
    if (!fgets(input, sizeof(input), stdin)) return 1;
    input[strcspn(input, "\r\n")] = 0;
  }

  if (validate_code(input)) {
    render_evidence();
    return 0;
  } else {
    printf("[ERROR] Invalid authorization code.\n");
    return 1;
  }
}
