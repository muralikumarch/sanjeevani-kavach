import { describe, it, expect } from 'vitest';
import {
  sanitizeString,
  validateVaniPayload,
  validateImageUpload,
  VALID_URGENCY_LEVELS,
} from '../src/lib/validation';

describe('Input Validation & Sanitization', () => {
  describe('sanitizeString', () => {
    it('should strip HTML tags to prevent XSS', () => {
      const malicious = '<script>alert("xss")</script>Hello';
      const result = sanitizeString(malicious);
      expect(result).not.toContain('<');
      expect(result).not.toContain('>');
      expect(result).toContain('Hello');
    });

    it('should strip javascript: protocol injections', () => {
      const result = sanitizeString('javascript:alert(1)');
      expect(result).not.toContain('javascript:');
    });

    it('should strip inline event handlers', () => {
      const result = sanitizeString('onerror=alert(1)');
      expect(result).not.toContain('onerror=');
    });

    it('should enforce maximum length of 500 characters', () => {
      const longString = 'A'.repeat(600);
      const result = sanitizeString(longString);
      expect(result.length).toBeLessThanOrEqual(500);
    });

    it('should trim whitespace', () => {
      const result = sanitizeString('  hello world  ');
      expect(result).toBe('hello world');
    });
  });

  describe('validateVaniPayload', () => {
    it('should accept valid payloads', () => {
      const result = validateVaniPayload({
        childName: 'Aarav',
        vaccineCode: 'PENTA-3',
        urgency: 'RED',
        targetLanguage: 'hi',
      });
      expect(result.childName).toBe('Aarav');
      expect(result.urgency).toBe('RED');
    });

    it('should reject missing childName', () => {
      expect(() =>
        validateVaniPayload({
          childName: '',
          vaccineCode: 'PENTA-3',
          urgency: 'RED',
          targetLanguage: 'hi',
        })
      ).toThrow('Invalid childName');
    });

    it('should reject invalid urgency value', () => {
      expect(() =>
        validateVaniPayload({
          childName: 'Aarav',
          vaccineCode: 'PENTA-3',
          urgency: 'CRITICAL',
          targetLanguage: 'hi',
        })
      ).toThrow('Invalid urgency');
    });

    it('should reject non-string vaccineCode', () => {
      expect(() =>
        validateVaniPayload({
          childName: 'Aarav',
          vaccineCode: 123 as unknown as string,
          urgency: 'GREEN',
          targetLanguage: 'en',
        })
      ).toThrow('Invalid vaccineCode');
    });

    it('should sanitize XSS in payload fields', () => {
      const result = validateVaniPayload({
        childName: '<img src=x onerror=alert(1)>Aarav',
        vaccineCode: 'PENTA-3',
        urgency: 'GREEN',
        targetLanguage: 'hi',
      });
      expect(result.childName).not.toContain('<');
      expect(result.childName).not.toContain('>');
    });
  });

  describe('validateImageUpload', () => {
    it('should reject null files', () => {
      expect(() => validateImageUpload(null)).toThrow('No image file provided');
    });

    it('should accept valid JPEG images', () => {
      const file = new File(['image data'], 'test.jpg', { type: 'image/jpeg' });
      const result = validateImageUpload(file);
      expect(result).toBe(file);
    });

    it('should accept valid PNG images', () => {
      const file = new File(['image data'], 'test.png', { type: 'image/png' });
      const result = validateImageUpload(file);
      expect(result).toBe(file);
    });
  });

  describe('Constants', () => {
    it('should define exactly three urgency levels', () => {
      expect(VALID_URGENCY_LEVELS).toEqual(['GREEN', 'YELLOW', 'RED']);
    });
  });
});
