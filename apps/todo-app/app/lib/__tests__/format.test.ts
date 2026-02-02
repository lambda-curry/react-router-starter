import { describe, expect, it } from 'vitest';
import { slugify } from '../format';

describe('format utilities', () => {
  describe('slugify', () => {
    it('converts text to lowercase hyphenated slug', () => {
      expect(slugify('Hello World')).toBe('hello-world');
    });

    it('trims leading and trailing whitespace', () => {
      expect(slugify('  foo bar  ')).toBe('foo-bar');
    });

    it('collapses multiple spaces into a single hyphen', () => {
      expect(slugify('a   b   c')).toBe('a-b-c');
    });

    it('strips non-alphanumeric characters', () => {
      expect(slugify('Hello, World!')).toBe('hello-world');
    });

    it('collapses multiple hyphens', () => {
      expect(slugify('a---b')).toBe('a-b');
    });

    it('returns empty string for empty or only-symbols input', () => {
      expect(slugify('')).toBe('');
      expect(slugify('   ')).toBe('');
      expect(slugify('!!!')).toBe('');
    });
  });
});
