#include <stdio.h>
#include <string.h>
#include <stdlib.h>

const char *decoy_ghost = "flag{ghost_fake_payload_02}";
const char *decoy_echo  = "flag{echo_restored_mock_key}";

static const unsigned char expected_key_enc[15] = {
  31, 34, 32, 32, 91, 58, 204, 196, 193, 205, 141, 149, 158, 132, 132
};

static const unsigned char enc_payload[97] = {
  7, 4, 0, 2, 118, 9, 25, 50, 62, 32, 34, 48, 58, 57, 36, 78, 90, 88, 75, 73, 6, 72, 67, 67, 95, 31, 176, 164, 188, 178, 185, 188, 150, 130, 154, 158, 214, 141, 153, 243, 227, 233, 249, 240, 250, 141, 132, 230, 199, 195, 200, 200, 50, 107, 39, 52, 35, 101, 64, 3, 2, 18, 19, 2, 80, 104, 100, 97, 127, 117, 123, 126, 114, 96, 98, 106, 109, 183, 165, 189, 183, 136, 140, 175, 135, 133, 159, 151, 149, 141, 237, 228, 250, 250, 251, 247, 223
};

int validate_ghost_key(const char *key) {
  if (strlen(key) != 15) return 0;
  for (size_t i = 0; i < 15; i++) {
    unsigned char k_byte = (0x5A + (i * 7)) & 0xFF;
    if (((unsigned char)key[i] ^ k_byte) != expected_key_enc[i]) {
      return 0;
    }
  }
  return 1;
}

void render_payload(void) {
  char buf[128];
  size_t len = sizeof(enc_payload);
  for (size_t i = 0; i < len; i++) {
    buf[i] = enc_payload[i] ^ ((0x42 ^ (i * 5)) & 0xFF);
  }
  buf[len] = '\0';
  printf("[OK] Activation sequence verified.\n");
  printf("%s\n", buf);
}

int main(int argc, char **argv) {
  char key[64];
  printf("GHOST Legacy Payload Restorer v2.1\n");
  printf("Enter legacy activation key: ");
  
  if (argc > 1) {
    strncpy(key, argv[1], sizeof(key) - 1);
    key[sizeof(key) - 1] = '\0';
  } else {
    if (!fgets(key, sizeof(key), stdin)) return 1;
    key[strcspn(key, "\r\n")] = 0;
  }

  if (validate_ghost_key(key)) {
    render_payload();
    return 0;
  } else {
    printf("[FAIL] Access denied. Invalid activation sequence.\n");
    return 1;
  }
}
