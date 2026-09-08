import os

pwn_src_dir = os.path.join(os.path.dirname(__file__), "pwn_src")
os.makedirs(pwn_src_dir, exist_ok=True)

# Helper function to XOR encode flag string
def xor_encode(text, key=0x55):
    return [(ord(c) ^ key) & 0xFF for c in text]

# -------------------------------------------------------------
# PWN-01: broken_terminal (Stack Buffer Overflow -> win())
# -------------------------------------------------------------
pwn1_flag = "flag{Stack_Buffer_Overflow_Win_Path}"
pwn1_enc = xor_encode(pwn1_flag, 0x55)

pwn1_c = f"""#include <stdio.h>
#include <stdlib.h>
#include <string.h>

char *gets(char *s);

static const unsigned char flag_enc[] = {{
  {', '.join(str(b) for b in pwn1_enc)}, 0
}};

void win(void) {{
  char buf[64];
  size_t len = sizeof(flag_enc) - 1;
  for (size_t i = 0; i < len; i++) {{
    buf[i] = flag_enc[i] ^ 0x55;
  }}
  buf[len] = '\\0';
  printf("[AUTHORIZATION GRANTED] System terminal recovered.\\n");
  printf("[FLAG] %s\\n", buf);
  fflush(stdout);
  exit(0);
}}

void process_terminal(void) {{
  char buffer[64];
  printf("NEXUS Terminal Control Subsystem\\n");
  printf("Enter terminal session command: ");
  fflush(stdout);
  // Vulnerable gets call
  gets(buffer);
  printf("Command received: %s\\n", buffer);
  fflush(stdout);
}}

int main(void) {{
  setvbuf(stdout, NULL, _IONBF, 0);
  process_terminal();
  return 0;
}}
"""
with open(os.path.join(pwn_src_dir, "pwn01.c"), "w") as f:
    f.write(pwn1_c)

# -------------------------------------------------------------
# PWN-02: internal_service (Format String Leak -> Secret Check)
# -------------------------------------------------------------
pwn2_flag = "flag{Format_String_Leak_Exploit_Success}"
pwn2_enc = xor_encode(pwn2_flag, 0x66)

pwn2_c = f"""#include <stdio.h>
#include <stdlib.h>
#include <string.h>

static const unsigned char flag_enc[] = {{
  {', '.join(str(b) for b in pwn2_enc)}, 0
}};

void grant_access(void) {{
  char buf[64];
  size_t len = sizeof(flag_enc) - 1;
  for (size_t i = 0; i < len; i++) {{
    buf[i] = flag_enc[i] ^ 0x66;
  }}
  buf[len] = '\\0';
  printf("[SERVICE AUTHENTICATED] Internal diagnostic state unlocked.\\n");
  printf("[FLAG] %s\\n", buf);
  fflush(stdout);
  exit(0);
}}

int main(void) {{
  setvbuf(stdout, NULL, _IONBF, 0);
  unsigned long secret_token = 0xA02E11A99UL; // Secret token on stack
  char input[128];
  char pass[64];

  printf("NEXUS Internal Service Diagnostics v2.4\\n");
  printf("Enter operator ID: ");
  fflush(stdout);

  if (!fgets(input, sizeof(input), stdin)) return 1;

  // Format string vulnerability
  #pragma GCC diagnostic push
  #pragma GCC diagnostic ignored "-Wformat-security"
  printf("Operator registered: ");
  printf(input);
  printf("\\n");
  #pragma GCC diagnostic pop
  fflush(stdout);

  printf("Enter authorization secret token (hex): ");
  fflush(stdout);

  if (!fgets(pass, sizeof(pass), stdin)) return 1;
  unsigned long user_secret = strtoul(pass, NULL, 16);

  if (user_secret == secret_token) {{
    grant_access();
  }} else {{
    printf("[ERROR] Access denied. Secret mismatch.\\n");
    fflush(stdout);
  }}

  return 0;
}}
"""
with open(os.path.join(pwn_src_dir, "pwn02.c"), "w") as f:
    f.write(pwn2_c)

# -------------------------------------------------------------
# PWN-03: aurelia_gateway (Multi-stage ROP -> win())
# -------------------------------------------------------------
pwn3_flag = "flag{MultiStage_ROP_Gateway_Bypass}"
pwn3_enc = xor_encode(pwn3_flag, 0x77)

pwn3_c = f"""#include <stdio.h>
#include <stdlib.h>
#include <string.h>

static const unsigned char flag_enc[] = {{
  {', '.join(str(b) for b in pwn3_enc)}, 0
}};

void win(void) {{
  char buf[64];
  size_t len = sizeof(flag_enc) - 1;
  for (size_t i = 0; i < len; i++) {{
    buf[i] = flag_enc[i] ^ 0x77;
  }}
  buf[len] = '\\0';
  printf("[GATEWAY BYPASS] AURELIA Gateway Access Granted.\\n");
  printf("[FLAG] %s\\n", buf);
  fflush(stdout);
  exit(0);
}}

void gateway_service(void) {{
  char buffer[64];
  printf("AURELIA Secure Gateway Node v4.1\\n");
  printf("Gateway address: %p\\n", (void*)win);
  printf("Enter encrypted packet payload: ");
  fflush(stdout);
  // Stack overflow vulnerability using fread
  fread(buffer, 1, 256, stdin);
  printf("Packet processed.\\n");
  fflush(stdout);
}}

int main(void) {{
  setvbuf(stdout, NULL, _IONBF, 0);
  gateway_service();
  return 0;
}}
"""
with open(os.path.join(pwn_src_dir, "pwn03.c"), "w") as f:
    f.write(pwn3_c)

print("PWN C source files generated successfully.")
