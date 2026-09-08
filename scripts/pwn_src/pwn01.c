#include <stdio.h>
#include <stdlib.h>
#include <string.h>

char *gets(char *s);

static const unsigned char flag_enc[] = {
  51, 57, 52, 50, 46, 6, 33, 52, 54, 62, 10, 23, 32, 51, 51, 48, 39, 10, 26, 35, 48, 39, 51, 57, 58, 34, 10, 2, 60, 59, 10, 5, 52, 33, 61, 40, 0
};

void win(void) {
  char buf[64];
  size_t len = sizeof(flag_enc) - 1;
  for (size_t i = 0; i < len; i++) {
    buf[i] = flag_enc[i] ^ 0x55;
  }
  buf[len] = '\0';
  printf("[AUTHORIZATION GRANTED] System terminal recovered.\n");
  printf("[FLAG] %s\n", buf);
  fflush(stdout);
  exit(0);
}

void process_terminal(void) {
  char buffer[64];
  printf("NEXUS Terminal Control Subsystem\n");
  printf("Enter terminal session command: ");
  fflush(stdout);
  // Vulnerable gets call
  gets(buffer);
  printf("Command received: %s\n", buffer);
  fflush(stdout);
}

int main(void) {
  setvbuf(stdout, NULL, _IONBF, 0);
  process_terminal();
  return 0;
}
