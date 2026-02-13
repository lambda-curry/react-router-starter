import { describe, expect, it } from 'bun:test';
import { cn } from './cn';

// Simplified boolean logic for linter
const truthy = 'conditional-class';
const falsy = false as const;

describe('cn utility function', () => {
  it('should combine class names correctly', () => {
    const result = cn('text-red-500', 'bg-blue-100');
    expect(result).toBe('text-red-500 bg-blue-100');
  });

  it('should handle conditional classes', () => {
    const result = cn('base-class', truthy, falsy && 'hidden-class');
    expect(result).toBe('base-class conditional-class');
  });

  it('should merge conflicting Tailwind classes', () => {
    const result = cn('text-red-500', 'text-blue-500');
    expect(result).toBe('text-blue-500');
  });

  it('should handle empty inputs', () => {
    const result = cn();
    expect(result).toBe('');
  });

  it('should handle undefined and null values', () => {
    const result = cn('valid-class', undefined, null, 'another-class');
    expect(result).toBe('valid-class another-class');
  });

  it('should handle arrays of classes', () => {
    const result = cn(['class1', 'class2'], 'class3');
    expect(result).toBe('class1 class2 class3');
  });
});
