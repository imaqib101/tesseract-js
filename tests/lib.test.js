import { describe, expect, it } from 'vitest';
import {
  LANGUAGES,
  MAX_FILE_BYTES,
  describeProgress,
  formatBytes,
  formatConfidence,
  pickImageFile,
  validateImageFile,
} from '../lib.js';

const file = (name, type, size) => ({ name, type, size });

describe('validateImageFile', () => {
  it('accepts a normal image', () => {
    expect(validateImageFile(file('a.png', 'image/png', 1000))).toEqual({ ok: true });
  });
  it('rejects missing file, non-images, empty and oversized files', () => {
    expect(validateImageFile(null).ok).toBe(false);
    expect(validateImageFile(file('a.pdf', 'application/pdf', 10)).error).toMatch(/not an image/);
    expect(validateImageFile(file('a', '', 10)).ok).toBe(false);
    expect(validateImageFile(file('a.png', 'image/png', 0)).error).toMatch(/empty/);
    const big = validateImageFile(file('a.png', 'image/png', MAX_FILE_BYTES + 1));
    expect(big.ok).toBe(false);
    expect(big.error).toMatch(/limit is 20\.0 MB/);
  });
});

describe('pickImageFile', () => {
  it('prefers the first image', () => {
    const a = file('a.txt', 'text/plain', 1);
    const b = file('b.png', 'image/png', 1);
    expect(pickImageFile([a, b])).toBe(b);
  });
  it('falls back to first file, or null when empty', () => {
    const a = file('a.txt', 'text/plain', 1);
    expect(pickImageFile([a])).toBe(a);
    expect(pickImageFile([])).toBeNull();
    expect(pickImageFile(undefined)).toBeNull();
  });
});

describe('describeProgress', () => {
  it('reports percent while recognizing and clamps it', () => {
    expect(describeProgress({ status: 'recognizing text', progress: 0.456 })).toEqual({
      percent: 46,
      text: 'Recognizing text: 46%',
    });
    expect(describeProgress({ status: 'recognizing text', progress: 3 }).percent).toBe(100);
  });
  it('capitalizes other statuses without a percent', () => {
    expect(describeProgress({ status: 'loading language traineddata' })).toEqual({
      percent: null,
      text: 'Loading language traineddata',
    });
    expect(describeProgress({}).text).toBe('Working');
  });
});

describe('formatting', () => {
  it('formats bytes', () => {
    expect(formatBytes(512)).toBe('512 B');
    expect(formatBytes(2048)).toBe('2.0 KB');
    expect(formatBytes(5 * 1024 * 1024)).toBe('5.0 MB');
  });
  it('rounds confidence', () => {
    expect(formatConfidence(87.6)).toBe('88%');
  });
  it('lists English first with unique codes', () => {
    expect(LANGUAGES[0].code).toBe('eng');
    expect(new Set(LANGUAGES.map((l) => l.code)).size).toBe(LANGUAGES.length);
  });
});
