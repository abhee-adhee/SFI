import { describe, it, expect } from 'vitest';
import { existsSync, readFileSync } from 'fs';
import path from 'path';

import miscManifest from '../src/data/challenges/misc.json';
import { getFlag } from '../src/lib/secrets';

const baseDir = path.join(process.cwd(), 'public', 'artifacts', 'challenges', 'misc');

describe('MISC/STEG Challenges Validation Suite', () => {

  it('manifest contains exactly 3 challenges', () => {
    expect(miscManifest.length).toBe(3);
    expect(miscManifest.map(c => c.id)).toEqual(['MISC-01', 'MISC-02', 'MISC-03']);
  });

  describe('MISC-01: SIGNAL', () => {
    const artPath = path.join(baseDir, 'MISC-01', 'signal_stream.bin');

    it('artifact exists', () => {
      expect(existsSync(artPath)).toBe(true);
      expect(existsSync(path.join(baseDir, 'MISC-01', 'README.txt'))).toBe(true);
    });

    it('binary protocol parser extracts flag', () => {
      const data = readFileSync(artPath);
      let offset = 0;
      let extractedFlag = '';

      while (offset < data.length) {
        if (data.subarray(offset, offset + 4).toString('ascii') === 'NXS\x01') {
          const pktType = data[offset + 4];
          const len = (data[offset + 5] << 8) | data[offset + 6];
          const payload = data.subarray(offset + 7, offset + 7 + len);
          if (pktType === 2) {
            extractedFlag = payload.toString('utf8');
          }
          offset += 7 + len;
        } else {
          offset += 1;
        }
      }

      expect(extractedFlag).toBe('flag{Signal_Packet_Framing_Decoded}');
      expect(getFlag('MISC-01')).toBe('flag{Signal_Packet_Framing_Decoded}');
    });
  });

  describe('MISC-02: THE IMAGE', () => {
    const artPath = path.join(baseDir, 'MISC-02', 'nexus_telemetry.png');

    it('artifact exists', () => {
      expect(existsSync(artPath)).toBe(true);
      expect(existsSync(path.join(baseDir, 'MISC-02', 'README.txt'))).toBe(true);
    });

    it('PNG custom chunk extraction and XOR decoding extracts flag', () => {
      const content = readFileSync(artPath);
      const chunkTag = Buffer.from('nxDS', 'ascii');
      const idx = content.indexOf(chunkTag);
      expect(idx).not.toBe(-1);

      const length = content.readUInt32BE(idx - 4);
      const rawPayload = content.subarray(idx + 4, idx + 4 + length);
      
      const decoded = Array.from(rawPayload).map(b => String.fromCharCode(b ^ 0x77)).join('');
      expect(decoded).toContain('flag{PNG_Chunk_Steganography_Extracted}');
      expect(getFlag('MISC-02')).toBe('flag{PNG_Chunk_Steganography_Extracted}');
    });
  });

  describe('MISC-03: GHOST ARTIFACT', () => {
    const artPath = path.join(baseDir, 'MISC-03', 'ghost_archive.nxc');

    it('artifact exists', () => {
      expect(existsSync(artPath)).toBe(true);
      expect(existsSync(path.join(baseDir, 'MISC-03', 'README.txt'))).toBe(true);
    });

    it('custom NXC container directory parsing and carving extracts flag', () => {
      const data = readFileSync(artPath);
      const magic = data.subarray(0, 8).toString('ascii');
      expect(magic).toBe('NXCv1.0\x00');

      const numRecords = data.readUInt32BE(8);
      expect(numRecords).toBe(3);

      let offset = 12;
      let extractedPayload = '';

      for (let i = 0; i < numRecords; i++) {
        const recType = data.readUInt16BE(offset + 16);
        const recOff = data.readUInt32BE(offset + 18);
        const recLen = data.readUInt32BE(offset + 22);

        if (recType === 3) { // CLASSIFIED
          const payload = data.subarray(recOff, recOff + recLen);
          extractedPayload = Array.from(payload).map(b => String.fromCharCode(b ^ 0x44)).join('');
        }
        offset += 26;
      }

      expect(extractedPayload).toContain('flag{Ghost_Binary_Container_Carved}');
      expect(getFlag('MISC-03')).toBe('flag{Ghost_Binary_Container_Carved}');
    });
  });
});
