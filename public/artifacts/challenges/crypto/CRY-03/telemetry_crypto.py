# AURELIA Telemetry Encryption Utility
# Usage: python telemetry_crypto.py <input_file> <output_file> <seed_int>

class LCGStreamCipher:
    def __init__(self, seed: int):
        self.state = seed & 0xFFFFFF  # 24-bit seed
        self.a = 214013
        self.c = 2531011
        self.m = 2**24

    def _next_byte(self) -> int:
        self.state = (self.a * self.state + self.c) % self.m
        return (self.state >> 16) & 0xFF

    def encrypt(self, data: bytes) -> bytes:
        return bytes([b ^ self._next_byte() for b in data])

if __name__ == "__main__":
    import sys
    if len(sys.argv) < 4:
        print("Usage: python telemetry_crypto.py <input> <output> <seed_int>")
        sys.exit(1)
    
    with open(sys.argv[1], "rb") as f:
        data = f.read()
    
    seed = int(sys.argv[3])
    cipher = LCGStreamCipher(seed)
    out = cipher.encrypt(data)
    
    with open(sys.argv[2], "wb") as f:
        f.write(out)
