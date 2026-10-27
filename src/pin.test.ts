import { createHash } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import { hashSecret, makeRecoveryCode, sha256 } from './pin';

describe('pin hashing', () => {
  it('matches known SHA-256 values', () => {
    expect(sha256('')).toBe('e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855');
    expect(sha256('abc')).toBe('ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad');
    expect(sha256('a'.repeat(200))).toBe(createHash('sha256').update('a'.repeat(200)).digest('hex'));
  });

  it('accepts recovery codes in any case', () => {
    const code = makeRecoveryCode();
    expect(code).toMatch(/^[A-Z2-9]{4}-[A-Z2-9]{4}$/);
    expect(hashSecret(code.toLowerCase(), 's')).toBe(hashSecret(code, 's'));
  });
});
