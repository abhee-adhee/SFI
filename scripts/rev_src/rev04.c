#include <stdio.h>
#include <string.h>
#include <stdlib.h>

const char *decoy_br = "flag{fake_bridge_handshake_secret}";

typedef struct {
  int mode_ok;
  int key_ok;
  int state;
} bridge_ctx_t;

typedef int (*state_handler_t)(bridge_ctx_t *ctx, const char *arg1, const char *arg2);

static const unsigned char enc_payload[101] = {
  193, 201, 209, 211, 208, 160, 223, 200, 222, 208, 214, 235, 139, 233, 230, 246, 246, 234, 252, 140, 147, 245, 174, 162, 168, 233, 128, 171, 169, 189, 185, 187, 142, 204, 129, 135, 141, 132, 146, 156, 145, 212, 148, 125, 127, 105, 103, 110, 118, 111, 113, 115, 119, 62, 13, 124, 66, 71, 85, 81, 73, 2, 21, 84, 35, 45, 46, 61, 14, 53, 49, 46, 62, 7, 37, 15, 12, 13, 58, 38, 22, 15, 9, 23, 7, 19, 229, 213, 212, 240, 224, 234, 254, 199, 215, 224, 198, 200, 206, 195, 222
};

int state_init(bridge_ctx_t *ctx, const char *arg1, const char *arg2) {
  if (!arg1 || !arg2) return -1;
  if (strcmp(arg1, "--bridge-mode=legacy") == 0) {
    ctx->mode_ok = 1;
  }
  if (strcmp(arg2, "--key=ECHO-HANDSHAKE-0x99") == 0) {
    ctx->key_ok = 1;
  }
  ctx->state = 1;
  return 0;
}

int state_verify_params(bridge_ctx_t *ctx, const char *arg1, const char *arg2) {
  (void)arg1; (void)arg2;
  if (ctx->state == 1 && ctx->mode_ok && ctx->key_ok) {
    ctx->state = 2;
    return 0;
  }
  return -1;
}

int state_render(bridge_ctx_t *ctx, const char *arg1, const char *arg2) {
  (void)arg1; (void)arg2;
  if (ctx->state != 2) return -1;
  char buf[128];
  size_t len = sizeof(enc_payload);
  for (size_t i = 0; i < len; i++) {
    buf[i] = enc_payload[i] ^ ((0x8F ^ (i * 3)) & 0xFF);
  }
  buf[len] = '\0';
  printf("%s\n", buf);
  ctx->state = 3;
  return 0;
}

state_handler_t dispatch_table[3] = {
  state_init,
  state_verify_params,
  state_render
};

int main(int argc, char **argv) {
  printf("NEXUS Echo-Aurelia Bridge Interface v4.0\n");
  if (argc < 3) {
    printf("Usage: %s --bridge-mode=<mode> --key=<key>\n", argv[0]);
    return 1;
  }

  bridge_ctx_t ctx = {0, 0, 0};
  
  if (dispatch_table[0](&ctx, argv[1], argv[2]) == 0) {
    if (dispatch_table[1](&ctx, argv[1], argv[2]) == 0) {
      if (dispatch_table[2](&ctx, argv[1], argv[2]) == 0) {
        return 0;
      }
    }
  }

  printf("[ERROR] Bridge handshake failed. Check mode and authorization key.\n");
  return 1;
}
