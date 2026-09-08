#include <stdio.h>
#include <stdlib.h>
#include <string.h>

static const unsigned char flag_enc[] = {
  0, 10, 7, 1, 29, 32, 9, 20, 11, 7, 18, 57, 53, 18, 20, 15, 8, 1, 57, 42, 3, 7, 13, 57, 35, 30, 22, 10, 9, 15, 18, 57, 53, 19, 5, 5, 3, 21, 21, 27, 0
};

void grant_access(void) {
  char buf[64];
  size_t len = sizeof(flag_enc) - 1;
  for (size_t i = 0; i < len; i++) {
    buf[i] = flag_enc[i] ^ 0x66;
  }
  buf[len] = '\0';
  printf("[SERVICE AUTHENTICATED] Internal diagnostic state unlocked.\n");
  printf("[FLAG] %s\n", buf);
  fflush(stdout);
  exit(0);
}

int main(void) {
  setvbuf(stdout, NULL, _IONBF, 0);
  unsigned long secret_token = 0xA02E11A99UL; // Secret token on stack
  char input[128];
  char pass[64];

  printf("NEXUS Internal Service Diagnostics v2.4\n");
  printf("Enter operator ID: ");
  fflush(stdout);

  if (!fgets(input, sizeof(input), stdin)) return 1;

  // Format string vulnerability
  #pragma GCC diagnostic push
  #pragma GCC diagnostic ignored "-Wformat-security"
  printf("Operator registered: ");
  printf(input);
  printf("\n");
  #pragma GCC diagnostic pop
  fflush(stdout);

  printf("Enter authorization secret token (hex): ");
  fflush(stdout);

  if (!fgets(pass, sizeof(pass), stdin)) return 1;
  unsigned long user_secret = strtoul(pass, NULL, 16);

  if (user_secret == secret_token) {
    grant_access();
  } else {
    printf("[ERROR] Access denied. Secret mismatch.\n");
    fflush(stdout);
  }

  return 0;
}
