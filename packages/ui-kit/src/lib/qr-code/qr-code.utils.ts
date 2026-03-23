/**
 * Minimal QR Code encoder — byte mode, error-correction level L.
 * Produces a boolean[][] matrix (true = dark module).
 *
 * Supports versions 1-10 (up to ~271 characters).
 * Based on the ISO/IEC 18004 spec; no external dependencies.
 */

export type QRCodeMatrix = number[][]; // 0 = light, 1 = dark

// ── Galois-field arithmetic over GF(256) with polynomial 0x11d ──

const EXP = new Uint8Array(512);
const LOG = new Uint8Array(256);
(() => {
  let x = 1;
  for (let i = 0; i < 255; i++) {
    EXP[i] = x;
    LOG[x] = i;
    x = (x << 1) ^ (x & 0x80 ? 0x11d : 0);
  }
  for (let i = 255; i < 512; i++) EXP[i] = EXP[i - 255];
})();

function gfMul(a: number, b: number): number {
  return a === 0 || b === 0 ? 0 : EXP[LOG[a] + LOG[b]];
}

// ── Reed-Solomon generator polynomial ──

function rsGeneratorPoly(degree: number): Uint8Array {
  let g = new Uint8Array([1]);
  for (let i = 0; i < degree; i++) {
    const next = new Uint8Array(g.length + 1);
    for (let j = 0; j < g.length; j++) {
      next[j] ^= gfMul(g[j], EXP[i]);
      next[j + 1] ^= g[j];
    }
    g = next;
  }
  return g;
}

function rsEncode(data: Uint8Array, ecLen: number): Uint8Array {
  const gen = rsGeneratorPoly(ecLen);
  gen.reverse(); // Convert from constant-first to leading-first for synthetic division
  const msg = new Uint8Array(data.length + ecLen);
  msg.set(data);
  for (let i = 0; i < data.length; i++) {
    const coeff = msg[i];
    if (coeff !== 0) {
      for (let j = 0; j < gen.length; j++) {
        msg[i + j] ^= gfMul(gen[j], coeff);
      }
    }
  }
  return msg.slice(data.length);
}

// ── Version / capacity tables (EC level L only, byte mode) ──

interface VersionInfo {
  totalCodewords: number;
  ecPerBlock: number;
  numBlocks: number;
  dataCodewords: number;
  alignmentPatterns: number[];
}

const VERSIONS: VersionInfo[] = [
  /* v0 placeholder */ {
    totalCodewords: 0,
    ecPerBlock: 0,
    numBlocks: 0,
    dataCodewords: 0,
    alignmentPatterns: [],
  },
  /* v1  */ {
    totalCodewords: 26,
    ecPerBlock: 7,
    numBlocks: 1,
    dataCodewords: 19,
    alignmentPatterns: [],
  },
  /* v2  */ {
    totalCodewords: 44,
    ecPerBlock: 10,
    numBlocks: 1,
    dataCodewords: 34,
    alignmentPatterns: [18],
  },
  /* v3  */ {
    totalCodewords: 70,
    ecPerBlock: 15,
    numBlocks: 1,
    dataCodewords: 55,
    alignmentPatterns: [22],
  },
  /* v4  */ {
    totalCodewords: 100,
    ecPerBlock: 20,
    numBlocks: 1,
    dataCodewords: 80,
    alignmentPatterns: [26],
  },
  /* v5  */ {
    totalCodewords: 134,
    ecPerBlock: 26,
    numBlocks: 1,
    dataCodewords: 108,
    alignmentPatterns: [30],
  },
  /* v6  */ {
    totalCodewords: 172,
    ecPerBlock: 18,
    numBlocks: 2,
    dataCodewords: 136,
    alignmentPatterns: [34],
  },
  /* v7  */ {
    totalCodewords: 196,
    ecPerBlock: 20,
    numBlocks: 2,
    dataCodewords: 156,
    alignmentPatterns: [6, 22, 38],
  },
  /* v8  */ {
    totalCodewords: 242,
    ecPerBlock: 24,
    numBlocks: 2,
    dataCodewords: 194,
    alignmentPatterns: [6, 24, 42],
  },
  /* v9  */ {
    totalCodewords: 292,
    ecPerBlock: 30,
    numBlocks: 2,
    dataCodewords: 232,
    alignmentPatterns: [6, 26, 46],
  },
  /* v10 */ {
    totalCodewords: 346,
    ecPerBlock: 18,
    numBlocks: 4,
    dataCodewords: 274,
    alignmentPatterns: [6, 28, 50],
  },
];

function pickVersion(dataLen: number): number {
  for (let v = 1; v <= 10; v++) {
    // byte-mode overhead: 4 (mode) + 8 or 16 (count) bits → 2 bytes for v1-9
    const overhead = v <= 9 ? 2 : 3;
    if (dataLen + overhead <= VERSIONS[v].dataCodewords) return v;
  }
  return 10; // clamp
}

// ── Bit-stream helpers ──

class BitBuffer {
  private readonly bits: number[] = [];
  public get length(): number {
    return this.bits.length;
  }
  public put(value: number, length: number): void {
    for (let i = length - 1; i >= 0; i--) this.bits.push((value >>> i) & 1);
  }
  public getByte(index: number): number {
    let v = 0;
    for (let i = 0; i < 8; i++) {
      v = (v << 1) | (this.bits[index * 8 + i] ?? 0);
    }
    return v;
  }
}

// ── Matrix construction ──

function createMatrix(size: number): number[][] {
  return Array.from({ length: size }, () => Array<number>(size).fill(-1));
}

function placeFinderPattern(m: number[][], row: number, col: number): void {
  for (let r = -1; r <= 7; r++) {
    for (let c = -1; c <= 7; c++) {
      const rr = row + r,
        cc = col + c;
      if (rr < 0 || rr >= m.length || cc < 0 || cc >= m.length) continue;
      // Separator ring (outside the 7×7 pattern) is always light
      if (r === -1 || r === 7 || c === -1 || c === 7) {
        m[rr][cc] = 0;
        continue;
      }
      const inOuter = r === 0 || r === 6 || c === 0 || c === 6;
      const inInner = r >= 2 && r <= 4 && c >= 2 && c <= 4;
      m[rr][cc] = inOuter || inInner ? 1 : 0;
    }
  }
}

function placeAlignmentPattern(m: number[][], row: number, col: number): void {
  for (let r = -2; r <= 2; r++) {
    for (let c = -2; c <= 2; c++) {
      const inBorder = r === -2 || r === 2 || c === -2 || c === 2;
      const isCenter = r === 0 && c === 0;
      m[row + r][col + c] = inBorder || isCenter ? 1 : 0;
    }
  }
}

function placeTimingPatterns(m: number[][]): void {
  for (let i = 8; i < m.length - 8; i++) {
    const v = i % 2 === 0 ? 1 : 0;
    if (m[6][i] === -1) m[6][i] = v;
    if (m[i][6] === -1) m[i][6] = v;
  }
}

function reserveFormatArea(m: number[][]): void {
  const n = m.length;
  for (let i = 0; i < 8; i++) {
    if (m[8][i] === -1) m[8][i] = 0;
    if (m[i][8] === -1) m[i][8] = 0;
    if (m[8][n - 1 - i] === -1) m[8][n - 1 - i] = 0;
    if (m[n - 1 - i][8] === -1) m[n - 1 - i][8] = 0;
  }
  if (m[8][8] === -1) m[8][8] = 0;
  m[n - 8][8] = 1; // dark module
}

function placeData(m: number[][], data: Uint8Array): void {
  const n = m.length;
  let bitIdx = 0;
  let upward = true;
  for (let col = n - 1; col >= 1; col -= 2) {
    if (col === 6) col = 5; // skip timing column
    const rows = upward ? range(n - 1, -1) : range(0, n);
    for (const row of rows) {
      for (const c of [col, col - 1]) {
        if (m[row][c] !== -1) continue;
        const byteIndex = bitIdx >>> 3;
        const bitShift = 7 - (bitIdx & 7);
        m[row][c] =
          byteIndex < data.length ? (data[byteIndex] >>> bitShift) & 1 : 0;
        bitIdx++;
      }
    }
    upward = !upward;
  }
}

function range(from: number, to: number): number[] {
  const arr: number[] = [];
  if (from <= to) {
    for (let i = from; i < to; i++) arr.push(i);
  } else {
    for (let i = from; i > to; i--) arr.push(i);
  }
  return arr;
}

// ── Masking ──

type MaskFn = (r: number, c: number) => boolean;
const MASKS: MaskFn[] = [
  (r, c) => (r + c) % 2 === 0,
  (r) => r % 2 === 0,
  (_, c) => c % 3 === 0,
  (r, c) => (r + c) % 3 === 0,
  (r, c) => (Math.floor(r / 2) + Math.floor(c / 3)) % 2 === 0,
  (r, c) => ((r * c) % 2) + ((r * c) % 3) === 0,
  (r, c) => (((r * c) % 2) + ((r * c) % 3)) % 2 === 0,
  (r, c) => (((r + c) % 2) + ((r * c) % 3)) % 2 === 0,
];

function applyMask(
  m: number[][],
  reserved: number[][],
  maskIndex: number,
): void {
  const fn = MASKS[maskIndex];
  const n = m.length;
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      if (reserved[r][c] !== -1) continue;
      if (fn(r, c)) m[r][c] ^= 1;
    }
  }
}

function penalty(m: number[][]): number {
  const n = m.length;
  let score = 0;
  // Rule 1: runs of same color
  for (let r = 0; r < n; r++) {
    let count = 1;
    for (let c = 1; c < n; c++) {
      if (m[r][c] === m[r][c - 1]) {
        count++;
      } else {
        if (count >= 5) score += count - 2;
        count = 1;
      }
    }
    if (count >= 5) score += count - 2;
  }
  for (let c = 0; c < n; c++) {
    let count = 1;
    for (let r = 1; r < n; r++) {
      if (m[r][c] === m[r - 1][c]) {
        count++;
      } else {
        if (count >= 5) score += count - 2;
        count = 1;
      }
    }
    if (count >= 5) score += count - 2;
  }
  // Rule 2: 2×2 blocks
  for (let r = 0; r < n - 1; r++) {
    for (let c = 0; c < n - 1; c++) {
      const v = m[r][c];
      if (v === m[r][c + 1] && v === m[r + 1][c] && v === m[r + 1][c + 1])
        score += 3;
    }
  }
  // Rule 3: finder-like patterns (1011101 preceded/followed by 4 light modules)
  const pattern1 = [1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 0];
  const pattern2 = [0, 0, 0, 0, 1, 0, 1, 1, 1, 0, 1];
  for (let r = 0; r < n; r++) {
    for (let c = 0; c <= n - 11; c++) {
      if (pattern1.every((v, k) => m[r][c + k] === v)) score += 40;
      if (pattern2.every((v, k) => m[r][c + k] === v)) score += 40;
    }
  }
  for (let c = 0; c < n; c++) {
    for (let r = 0; r <= n - 11; r++) {
      if (pattern1.every((v, k) => m[r + k][c] === v)) score += 40;
      if (pattern2.every((v, k) => m[r + k][c] === v)) score += 40;
    }
  }
  // Rule 4: proportion of dark modules
  const total = n * n;
  let dark = 0;
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      if (m[r][c] === 1) dark++;
    }
  }
  const pct = (dark * 100) / total;
  const prev5 = Math.floor(pct / 5) * 5;
  const next5 = prev5 + 5;
  score += Math.min(Math.abs(prev5 - 50) / 5, Math.abs(next5 - 50) / 5) * 10;
  return score;
}

// ── Format info ──

const FORMAT_BITS: number[] = (() => {
  const result: number[] = [];
  for (let maskPattern = 0; maskPattern < 8; maskPattern++) {
    // EC level L = 01, mask pattern 3 bits
    const data = (0b01 << 3) | maskPattern;
    let rem = data;
    for (let i = 0; i < 10; i++) rem = (rem << 1) ^ ((rem >>> 9) * 0x537);
    const bits = ((data << 10) | rem) ^ 0x5412;
    result.push(bits);
  }
  return result;
})();

function placeFormatBits(m: number[][], maskPattern: number): void {
  const bits = FORMAT_BITS[maskPattern];
  const n = m.length;
  // ISO 18004 Table 9 — two copies of 15-bit format info, bit 0 = LSB
  for (let i = 0; i < 15; i++) {
    const bit = (bits >>> (14 - i)) & 1;

    // First copy: around top-left finder
    // bits 0-5 → row 8, cols 0-5; bit 6 → (8,7); bit 7 → (8,8)
    // bit 8 → (7,8); bits 9-14 → col 8, rows 5 down to 0
    if (i <= 5) m[8][i] = bit;
    else if (i === 6) m[8][7] = bit;
    else if (i === 7) m[8][8] = bit;
    else if (i === 8) m[7][8] = bit;
    else m[14 - i][8] = bit;

    // Second copy: bottom-left (col 8) + top-right (row 8)
    // bits 0-6 → col 8, rows n-1 down to n-7
    // bit 7 → (8, n-8); bits 8-14 → row 8, cols n-7 to n-1
    if (i <= 6) m[n - 1 - i][8] = bit;
    else if (i === 7) m[8][n - 8] = bit;
    else m[8][n - 15 + i] = bit;
  }
}

// ── Public API ──

export function generateQRCodeMatrix(data: string): QRCodeMatrix {
  const bytes = new TextEncoder().encode(data);
  const version = pickVersion(bytes.length);
  const vi = VERSIONS[version];
  const size = version * 4 + 17;

  // Build data stream
  const buf = new BitBuffer();
  buf.put(0b0100, 4); // byte mode indicator
  buf.put(bytes.length, version <= 9 ? 8 : 16); // character count
  for (const b of bytes) buf.put(b, 8);
  // Terminator
  const totalDataBits = vi.dataCodewords * 8;
  const terminatorLen = Math.min(4, totalDataBits - buf.length);
  buf.put(0, terminatorLen);
  // Pad to byte boundary
  while (buf.length % 8 !== 0) buf.put(0, 1);
  // Pad codewords
  const padBytes = [0xec, 0x11];
  let padIdx = 0;
  while (buf.length < totalDataBits) {
    buf.put(padBytes[padIdx % 2], 8);
    padIdx++;
  }

  // Extract data codewords
  const dataCodewords = new Uint8Array(vi.dataCodewords);
  for (let i = 0; i < vi.dataCodewords; i++) dataCodewords[i] = buf.getByte(i);

  // Reed-Solomon error correction
  const blockSize = Math.floor(vi.dataCodewords / vi.numBlocks);
  const longBlocks = vi.dataCodewords % vi.numBlocks;
  const allData: Uint8Array[] = [];
  const allEc: Uint8Array[] = [];
  let offset = 0;
  for (let b = 0; b < vi.numBlocks; b++) {
    const len = blockSize + (b >= vi.numBlocks - longBlocks ? 1 : 0);
    const blockData = dataCodewords.slice(offset, offset + len);
    allData.push(blockData);
    allEc.push(rsEncode(blockData, vi.ecPerBlock));
    offset += len;
  }

  // Interleave
  const interleaved: number[] = [];
  const maxDataLen = blockSize + (longBlocks > 0 ? 1 : 0);
  for (let i = 0; i < maxDataLen; i++) {
    for (const block of allData) {
      if (i < block.length) interleaved.push(block[i]);
    }
  }
  for (let i = 0; i < vi.ecPerBlock; i++) {
    for (const block of allEc) interleaved.push(block[i]);
  }
  const finalData = new Uint8Array(interleaved);

  // Build matrix
  const reserved = createMatrix(size);
  placeFinderPattern(reserved, 0, 0);
  placeFinderPattern(reserved, 0, size - 7);
  placeFinderPattern(reserved, size - 7, 0);
  placeTimingPatterns(reserved);
  reserveFormatArea(reserved);

  // Alignment patterns
  if (vi.alignmentPatterns.length > 0) {
    const positions = vi.alignmentPatterns;
    for (const r of positions) {
      for (const c of positions) {
        if (r <= 8 && c <= 8) continue; // overlaps top-left finder
        if (r <= 8 && c >= size - 8) continue; // overlaps top-right finder
        if (r >= size - 8 && c <= 8) continue; // overlaps bottom-left finder
        placeAlignmentPattern(reserved, r, c);
      }
    }
  }

  // Place data on a copy
  const matrix = reserved.map((row) => [...row]);
  placeData(matrix, finalData);

  // Try all masks, pick best
  let bestMask = 0;
  let bestScore = Infinity;
  for (let mask = 0; mask < 8; mask++) {
    const trial = matrix.map((row) => [...row]);
    applyMask(trial, reserved, mask);
    placeFormatBits(trial, mask);
    const s = penalty(trial);
    if (s < bestScore) {
      bestScore = s;
      bestMask = mask;
    }
  }

  applyMask(matrix, reserved, bestMask);
  placeFormatBits(matrix, bestMask);

  // Add 4-module quiet zone (ISO 18004 requirement for scanner detection)
  const quiet = 4;
  const padded: QRCodeMatrix = Array.from(
    { length: size + quiet * 2 },
    (_, r) =>
      Array.from({ length: size + quiet * 2 }, (_, c) => {
        const mr = r - quiet;
        const mc = c - quiet;
        return mr >= 0 && mr < size && mc >= 0 && mc < size
          ? matrix[mr][mc]
          : 0;
      }),
  );

  return padded;
}
