#include <stdio.h>
#include <string.h>
#include <stdlib.h>

const char *decoy_aur = "flag{aurelia_mock_plugin_key}";

static const unsigned char target_state[19] = {
  77, 254, 243, 100, 18, 65, 92, 51, 38, 213, 227, 204, 161, 138, 148, 203, 214, 133, 160
};

static const unsigned char enc_payload[87] = {
  38, 39, 47, 205, 223, 215, 232, 148, 242, 133, 145, 181, 167, 179, 33, 77, 66, 118, 101, 119, 17, 7, 3, 33, 43, 84, 165, 195, 254, 197, 196, 206, 174, 166, 164, 200, 167, 145, 98, 113, 113, 16, 21, 38, 39, 55, 6, 23, 54, 238, 234, 247, 209, 199, 205, 172, 162, 179, 134, 175, 182, 103, 101, 110, 78, 74, 98, 27, 39, 63, 29, 17, 32, 216, 240, 195, 196, 216, 178, 184, 165, 151, 142, 140, 102, 106, 100
};

int check_aurelia_license(const char *license) {
  if (strlen(license) != 19) return 0;
  for (size_t i = 0; i < 19; i++) {
    unsigned char val = (unsigned char)license[i];
    unsigned char rot = ((val << 3) | (val >> 5)) & 0xFF;
    unsigned char x = rot ^ ((i * 13 + 0x47) & 0xFF);
    if (x != target_state[i]) {
      return 0;
    }
  }
  return 1;
}

void print_security_token(void) {
  char buf[128];
  size_t len = sizeof(enc_payload);
  for (size_t i = 0; i < len; i++) {
    buf[i] = enc_payload[i] ^ ((0x67 + (i * 11)) & 0xFF);
  }
  buf[len] = '\0';
  printf("[AUTH] %s\n", buf);
}

int main(int argc, char **argv) {
  char lic[64];
  printf("AURELIA Subsystem Plugin Authenticator v3.0\n");
  printf("Enter license key: ");

  if (argc > 1) {
    strncpy(lic, argv[1], sizeof(lic) - 1);
    lic[sizeof(lic) - 1] = '\0';
  } else {
    if (!fgets(lic, sizeof(lic), stdin)) return 1;
    lic[strcspn(lic, "\r\n")] = 0;
  }

  if (check_aurelia_license(lic)) {
    print_security_token();
    return 0;
  } else {
    printf("[REJECTED] License state check failed.\n");
    return 1;
  }
}
