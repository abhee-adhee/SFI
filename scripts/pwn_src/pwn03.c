#include <stdio.h>
#include <stdlib.h>
#include <string.h>

static const unsigned char flag_enc[] = {
  17, 27, 22, 16, 12, 58, 2, 27, 3, 30, 36, 3, 22, 16, 18, 40, 37, 56, 39, 40, 48, 22, 3, 18, 0, 22, 14, 40, 53, 14, 7, 22, 4, 4, 10, 0
};

void win(void) {
  char buf[64];
  size_t len = sizeof(flag_enc) - 1;
  for (size_t i = 0; i < len; i++) {
    buf[i] = flag_enc[i] ^ 0x77;
  }
  buf[len] = '\0';
  printf("[GATEWAY BYPASS] AURELIA Gateway Access Granted.\n");
  printf("[FLAG] %s\n", buf);
  fflush(stdout);
  exit(0);
}

void gateway_service(void) {
  char buffer[64];
  printf("AURELIA Secure Gateway Node v4.1\n");
  printf("Gateway address: %p\n", (void*)win);
  printf("Enter encrypted packet payload: ");
  fflush(stdout);
  // Stack overflow vulnerability using fread
  fread(buffer, 1, 256, stdin);
  printf("Packet processed.\n");
  fflush(stdout);
}

int main(void) {
  setvbuf(stdout, NULL, _IONBF, 0);
  gateway_service();
  return 0;
}
