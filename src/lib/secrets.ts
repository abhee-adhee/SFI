import 'server-only';

// The flags are obfuscated using base64 so they are not trivially grep-able in the .next build output strings if bundled.
// Only Next.js API Routes (Server execution) can import this file.

const obfFlags: Record<string, string> = {
  // WEB challenges
  'WEB-01': 'ZmxhZ3tOZXh1c19EZXZfRXhwb3N1cmV9', // flag{Nexus_Dev_Exposure}
  'WEB-02': 'ZmxhZ3tEZWdyYWRlZF9EaWFnbm9zdGljc19BY3RpdmV9', // flag{Degraded_Diagnostics_Active}
  'WEB-03': 'ZmxhZ3tJRE9SX0F1dGhvcml6YXRpb25fQnlwYXNzfQ==', // flag{IDOR_Authorization_Bypass}
  'WEB-04': 'ZmxhZ3tHaG9zdF9UeXBlX0p1Z2dsaW5nfQ==', // flag{Ghost_Type_Juggling}
  'WEB-05': 'ZmxhZ3tDb3JlX1NTUkZfQnJlYWNofQ==', // flag{Core_SSRF_Breach}
  // FORENSICS challenges — flags live inside artifact files, not in API responses.
  // These entries are for organizer validation only.
  'FOR-01': 'ZmxhZ3tHaG9zdF9GaXJzdF9Gb290cHJpbnR9', // flag{Ghost_First_Footprint}
  'FOR-02': 'ZmxhZ3tTZXNzaW9uX0hpamFja19Pcl9JbXBlcnNvbmF0aW9ufQ==', // flag{Session_Hijack_Or_Impersonation}
  'FOR-03': 'ZmxhZ3tHaG9zdF9CZWFjb25fTWVtb3J5X1Jlc2lkZW50fQ==', // flag{Ghost_Beacon_Memory_Resident}
  'FOR-04': 'ZmxhZ3tUaW1lbGluZV9Db3JydXB0ZWRfR2hvc3RfQWN0aXZlfQ==', // flag{Timeline_Corrupted_Ghost_Active}
  // OSINT challenges
  'OSINT-01': 'ZmxhZ3tOZXh1c19QdWJsaWNfUmVjb3Jkc19PU0lOVH0=', // flag{Nexus_Public_Records_OSINT}
  'OSINT-02': 'ZmxhZ3tQZW5oYWxpZ29uX1JldHJhY3RlZF9SZXNlYXJjaH0=', // flag{Penhaligon_Retracted_Research}
  'OSINT-03': 'ZmxhZ3tBdXJlbGlhX0VjaG9fRXZvbHV0aW9ufQ==', // flag{Aurelia_Echo_Evolution}
  'OSINT-04': 'ZmxhZ3tHaG9zdF9PcmlnaW5fUHJlY2VkZXNfQXVyZWxpYX0=', // flag{Ghost_Origin_Precedes_Aurelia}
  // CRYPTO challenges
  'CRY-01': 'ZmxhZ3tWaWdlbmVyZV9JbnRlcmNlcHRfRUNIT19TdWJzeXN0ZW19', // flag{Vigenere_Intercept_ECHO_Subsystem}
  'CRY-02': 'ZmxhZ3tYT1JfS2V5X1JldXNlX0V4cG9zZXNfRUNIT30=', // flag{XOR_Key_Reuse_Exposes_ECHO}
  'CRY-03': 'ZmxhZ3tXZWFrX1BSTkdfU3RyZWFtX0NpcGhlcl9DcmFja2VkfQ==', // flag{Weak_PRNG_Stream_Cipher_Cracked}
  'CRY-04': 'ZmxhZ3tSU0FfU2hhcmVkX1ByaW1lX1Z1bG5lcmFiaWxpdHl9', // flag{RSA_Shared_Prime_Vulnerability}
  // REVERSE ENGINEERING challenges
  'REV-01': 'ZmxhZ3tDb250cm9sX0Zsb3dfVHJpYWdlX05FWFVTfQ==', // flag{Control_Flow_Triage_NEXUS}
  'REV-02': 'ZmxhZ3tSb2xsaW5nX1hPUl9TdGF0ZV9UcmFuc2Zvcm1hdGlvbn0=', // flag{Rolling_XOR_State_Transformation}
  'REV-03': 'ZmxhZ3tBbGdvcml0aG1pY19NYXRyaXhfU3RhdGVfUmVjb25zdHJ1Y3RlZH0=', // flag{Algorithmic_Matrix_State_Reconstructed}
  'REV-04': 'ZmxhZ3tNdWx0aVN0YWdlX0Rpc3BhdGNoX1N0YXRlX0JyaWRnZX0=', // flag{MultiStage_Dispatch_State_Bridge}
  // PWN challenges
  'PWN-01': 'ZmxhZ3tTdGFja19CdWZmZXJfT3ZlcmZsb3dfV2luX1BhdGh9', // flag{Stack_Buffer_Overflow_Win_Path}
  'PWN-02': 'ZmxhZ3tGb3JtYXRfU3RyaW5nX0xlYWtfRXhwbG9pdF9TdWNjZXNzfQ==', // flag{Format_String_Leak_Exploit_Success}
  'PWN-03': 'ZmxhZ3tNdWx0aVN0YWdlX1JPUF9HYXRld2F5X0J5cGFzc30=', // flag{MultiStage_ROP_Gateway_Bypass}
  // MISC/STEG challenges
  'MISC-01': 'ZmxhZ3tTaWduYWxfUGFja2V0X0ZyYW1pbmdfRGVjb2RlZH0=', // flag{Signal_Packet_Framing_Decoded}
  'MISC-02': 'ZmxhZ3tQTkdfQ2h1bmtfU3RlZ2Fub2dyYXBoeV9FeHRyYWN0ZWR9', // flag{PNG_Chunk_Steganography_Extracted}
  'MISC-03': 'ZmxhZ3tHaG9zdF9CaW5hcnlfQ29udGFpbmVyX0NhcnZlZH0=', // flag{Ghost_Binary_Container_Carved}
  // BOSS challenges
  'BOSS-01': 'ZmxhZ3tBdXJlbGlhX0NvcmVfRGlhZ25vc3RpY19TdGF0ZV9SZWNvbnN0cnVjdGVkfQ==', // flag{Aurelia_Core_Diagnostic_State_Reconstructed}
  'BOSS-02': 'ZmxhZ3tHaG9zdF9PcmdhbmljX0FyY2hpdGVjdHVyYWxfT3JpZ2luX1JldmVhbGVkfQ==', // flag{Ghost_Organic_Architectural_Origin_Revealed}
};

export function getFlag(challengeId: string): string {
  const enc = obfFlags[challengeId];
  if (!enc) return 'flag{not_found}';
  // Node.js base64 decode
  return Buffer.from(enc, 'base64').toString('utf-8');
}
