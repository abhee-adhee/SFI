import os
import subprocess

# Ensure output directories exist
base_out = os.path.join(os.path.dirname(__file__), "..", "public", "artifacts", "challenges", "reverse")
for rev in ["REV-01", "REV-02", "REV-03", "REV-04"]:
    os.makedirs(os.path.join(base_out, rev), exist_ok=True)

src_dir = os.path.join(os.path.dirname(__file__), "rev_src")
os.makedirs(src_dir, exist_ok=True)

# Helper function to encode string with XOR pattern
def xor_encode(text, key_func):
    return [(ord(c) ^ (key_func(i) & 0xFF)) & 0xFF for i, c in enumerate(text)]

# -------------------------------------------------------------
# REV-01: process_triage
# -------------------------------------------------------------
# Input: NX-7701-TRIAGE
# Flag: flag{Control_Flow_Triage_NEXUS}
rev1_flag = "flag{Control_Flow_Triage_NEXUS}"
rev1_enc = xor_encode(rev1_flag, lambda i: 0x33)

rev1_c = f"""#include <stdio.h>
#include <string.h>
#include <stdlib.h>

const char *decoy_1 = "flag{{fake_string_decoy_01}}";
const char *decoy_2 = "flag{{wrong_branch_try_again}}";

static const unsigned char flag_enc[] = {{
  {', '.join(str(b) for b in rev1_enc)}, 0
}};

int validate_code(const char *input) {{
  if (strlen(input) != 14) return 0;
  if (strncmp(input, "NX-", 3) != 0) return 0;
  if (strcmp(input + 7, "-TRIAGE") != 0) return 0;
  
  int sum = 0;
  for (int i = 3; i < 7; i++) {{
    if (input[i] < '0' || input[i] > '9') return 0;
    sum += (input[i] - '0');
  }}
  return (sum == 15);
}}

void render_evidence(void) {{
  char flag_buf[64];
  size_t len = sizeof(flag_enc) - 1;
  for (size_t i = 0; i < len; i++) {{
    flag_buf[i] = flag_enc[i] ^ 0x33;
  }}
  flag_buf[len] = '\\0';
  printf("[SUCCESS] System triage code accepted.\\n");
  printf("[EVIDENCE] Forensic artifact token: %s\\n", flag_buf);
}}

int main(int argc, char **argv) {{
  char input[64];
  printf("NEXUS System Triage Utility v1.0.4\\n");
  printf("Enter authorization code: ");
  
  if (argc > 1) {{
    strncpy(input, argv[1], sizeof(input) - 1);
    input[sizeof(input) - 1] = '\\0';
  }} else {{
    if (!fgets(input, sizeof(input), stdin)) return 1;
    input[strcspn(input, "\\r\\n")] = 0;
  }}

  if (validate_code(input)) {{
    render_evidence();
    return 0;
  }} else {{
    printf("[ERROR] Invalid authorization code.\\n");
    return 1;
  }}
}}
"""
with open(os.path.join(src_dir, "rev01.c"), "w") as f:
    f.write(rev1_c)

# -------------------------------------------------------------
# REV-02: ghost_loader
# -------------------------------------------------------------
# Input: ECHO-GHOST-2018
# Key byte: (0x5A + (i * 7)) & 0xFF
rev2_key = "ECHO-GHOST-2018"
rev2_key_enc = [(ord(c) ^ (0x5A + (i * 7))) & 0xFF for i, c in enumerate(rev2_key)]

rev2_payload = "ECHO RESTORED: GHOST core parameters verified. Output key: flag{Rolling_XOR_State_Transformation}"
rev2_payload_enc = xor_encode(rev2_payload, lambda i: 0x42 ^ (i * 5))

rev2_c = f"""#include <stdio.h>
#include <string.h>
#include <stdlib.h>

const char *decoy_ghost = "flag{{ghost_fake_payload_02}}";
const char *decoy_echo  = "flag{{echo_restored_mock_key}}";

static const unsigned char expected_key_enc[{len(rev2_key_enc)}] = {{
  {', '.join(str(b) for b in rev2_key_enc)}
}};

static const unsigned char enc_payload[{len(rev2_payload_enc)}] = {{
  {', '.join(str(b) for b in rev2_payload_enc)}
}};

int validate_ghost_key(const char *key) {{
  if (strlen(key) != 15) return 0;
  for (size_t i = 0; i < 15; i++) {{
    unsigned char k_byte = (0x5A + (i * 7)) & 0xFF;
    if (((unsigned char)key[i] ^ k_byte) != expected_key_enc[i]) {{
      return 0;
    }}
  }}
  return 1;
}}

void render_payload(void) {{
  char buf[128];
  size_t len = sizeof(enc_payload);
  for (size_t i = 0; i < len; i++) {{
    buf[i] = enc_payload[i] ^ ((0x42 ^ (i * 5)) & 0xFF);
  }}
  buf[len] = '\\0';
  printf("[OK] Activation sequence verified.\\n");
  printf("%s\\n", buf);
}}

int main(int argc, char **argv) {{
  char key[64];
  printf("GHOST Legacy Payload Restorer v2.1\\n");
  printf("Enter legacy activation key: ");
  
  if (argc > 1) {{
    strncpy(key, argv[1], sizeof(key) - 1);
    key[sizeof(key) - 1] = '\\0';
  }} else {{
    if (!fgets(key, sizeof(key), stdin)) return 1;
    key[strcspn(key, "\\r\\n")] = 0;
  }}

  if (validate_ghost_key(key)) {{
    render_payload();
    return 0;
  }} else {{
    printf("[FAIL] Access denied. Invalid activation sequence.\\n");
    return 1;
  }}
}}
"""
with open(os.path.join(src_dir, "rev02.c"), "w") as f:
    f.write(rev2_c)

# -------------------------------------------------------------
# REV-03: aurelia_validator
# -------------------------------------------------------------
# Input: AURA-9921-ECHO-8842 (length 19)
# Transformation: ((val << 3) | (val >> 5)) ^ ((i * 13 + 0x47) & 0xFF)
rev3_key = "AURA-9921-ECHO-8842"
def rev3_transform(c, i):
    val = ord(c) & 0xFF
    rot = ((val << 3) | (val >> 5)) & 0xFF
    return rot ^ ((i * 13 + 0x47) & 0xFF)

rev3_target = [rev3_transform(c, i) for i, c in enumerate(rev3_key)]

rev3_payload = "AURELIA MODULE AUTHORIZED. Security Token: flag{Algorithmic_Matrix_State_Reconstructed}"
rev3_payload_enc = xor_encode(rev3_payload, lambda i: (0x67 + (i * 11)) & 0xFF)

rev3_c = f"""#include <stdio.h>
#include <string.h>
#include <stdlib.h>

const char *decoy_aur = "flag{{aurelia_mock_plugin_key}}";

static const unsigned char target_state[{len(rev3_target)}] = {{
  {', '.join(str(b) for b in rev3_target)}
}};

static const unsigned char enc_payload[{len(rev3_payload_enc)}] = {{
  {', '.join(str(b) for b in rev3_payload_enc)}
}};

int check_aurelia_license(const char *license) {{
  if (strlen(license) != 19) return 0;
  for (size_t i = 0; i < 19; i++) {{
    unsigned char val = (unsigned char)license[i];
    unsigned char rot = ((val << 3) | (val >> 5)) & 0xFF;
    unsigned char x = rot ^ ((i * 13 + 0x47) & 0xFF);
    if (x != target_state[i]) {{
      return 0;
    }}
  }}
  return 1;
}}

void print_security_token(void) {{
  char buf[128];
  size_t len = sizeof(enc_payload);
  for (size_t i = 0; i < len; i++) {{
    buf[i] = enc_payload[i] ^ ((0x67 + (i * 11)) & 0xFF);
  }}
  buf[len] = '\\0';
  printf("[AUTH] %s\\n", buf);
}}

int main(int argc, char **argv) {{
  char lic[64];
  printf("AURELIA Subsystem Plugin Authenticator v3.0\\n");
  printf("Enter license key: ");

  if (argc > 1) {{
    strncpy(lic, argv[1], sizeof(lic) - 1);
    lic[sizeof(lic) - 1] = '\\0';
  }} else {{
    if (!fgets(lic, sizeof(lic), stdin)) return 1;
    lic[strcspn(lic, "\\r\\n")] = 0;
  }}

  if (check_aurelia_license(lic)) {{
    print_security_token();
    return 0;
  }} else {{
    printf("[REJECTED] License state check failed.\\n");
    return 1;
  }}
}}
"""
with open(os.path.join(src_dir, "rev03.c"), "w") as f:
    f.write(rev3_c)

# -------------------------------------------------------------
# REV-04: nexus_bridge
# -------------------------------------------------------------
# Target: --bridge-mode=legacy --key=ECHO-HANDSHAKE-0x99
rev4_payload = "NEXUS BRIDGE ACTIVE: Echo-Aurelia handoff established. Vector: flag{MultiStage_Dispatch_State_Bridge}"
rev4_payload_enc = xor_encode(rev4_payload, lambda i: (0x8F ^ (i * 3)) & 0xFF)

rev4_c = f"""#include <stdio.h>
#include <string.h>
#include <stdlib.h>

const char *decoy_br = "flag{{fake_bridge_handshake_secret}}";

typedef struct {{
  int mode_ok;
  int key_ok;
  int state;
}} bridge_ctx_t;

typedef int (*state_handler_t)(bridge_ctx_t *ctx, const char *arg1, const char *arg2);

static const unsigned char enc_payload[{len(rev4_payload_enc)}] = {{
  {', '.join(str(b) for b in rev4_payload_enc)}
}};

int state_init(bridge_ctx_t *ctx, const char *arg1, const char *arg2) {{
  if (!arg1 || !arg2) return -1;
  if (strcmp(arg1, "--bridge-mode=legacy") == 0) {{
    ctx->mode_ok = 1;
  }}
  if (strcmp(arg2, "--key=ECHO-HANDSHAKE-0x99") == 0) {{
    ctx->key_ok = 1;
  }}
  ctx->state = 1;
  return 0;
}}

int state_verify_params(bridge_ctx_t *ctx, const char *arg1, const char *arg2) {{
  (void)arg1; (void)arg2;
  if (ctx->state == 1 && ctx->mode_ok && ctx->key_ok) {{
    ctx->state = 2;
    return 0;
  }}
  return -1;
}}

int state_render(bridge_ctx_t *ctx, const char *arg1, const char *arg2) {{
  (void)arg1; (void)arg2;
  if (ctx->state != 2) return -1;
  char buf[128];
  size_t len = sizeof(enc_payload);
  for (size_t i = 0; i < len; i++) {{
    buf[i] = enc_payload[i] ^ ((0x8F ^ (i * 3)) & 0xFF);
  }}
  buf[len] = '\\0';
  printf("%s\\n", buf);
  ctx->state = 3;
  return 0;
}}

state_handler_t dispatch_table[3] = {{
  state_init,
  state_verify_params,
  state_render
}};

int main(int argc, char **argv) {{
  printf("NEXUS Echo-Aurelia Bridge Interface v4.0\\n");
  if (argc < 3) {{
    printf("Usage: %s --bridge-mode=<mode> --key=<key>\\n", argv[0]);
    return 1;
  }}

  bridge_ctx_t ctx = {{0, 0, 0}};
  
  if (dispatch_table[0](&ctx, argv[1], argv[2]) == 0) {{
    if (dispatch_table[1](&ctx, argv[1], argv[2]) == 0) {{
      if (dispatch_table[2](&ctx, argv[1], argv[2]) == 0) {{
        return 0;
      }}
    }}
  }}

  printf("[ERROR] Bridge handshake failed. Check mode and authorization key.\\n");
  return 1;
}}
"""
with open(os.path.join(src_dir, "rev04.c"), "w") as f:
    f.write(rev4_c)

print("C source files generated successfully.")
