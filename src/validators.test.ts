import { describe, it, expect } from 'vitest';
import {
  validateAge,
  validateText,
  validateInStock,
  validateQuery,
} from './validators';
import ClientError from './errors/ClientError';

describe('validators', () => {
  describe('validateAge', () => {
    it('returns number for valid age string', () => {
      expect(validateAge('8')).toBe(8);
    });

    it('returns undefined for undefined', () => {
      expect(validateAge(undefined)).toBeUndefined();
    });

    it('throws ClientError for invalid number', () => {
      expect(() => validateAge('abc')).toThrow(ClientError);
      expect(() => validateAge('abc')).toThrow('age is not a valid number');
    });
  });

  describe('validateText', () => {
    it('returns string for valid text', () => {
      expect(validateText('search term')).toBe('search term');
    });

    it('returns undefined for undefined', () => {
      expect(validateText(undefined)).toBeUndefined();
    });

    it('throws ClientError for text over 1000 characters', () => {
      const longText = 'a'.repeat(1001);
      expect(() => validateText(longText)).toThrow(ClientError);
      expect(() => validateText(longText)).toThrow('query parameter too long');
    });
  });

  describe('validateInStock', () => {
    it('returns true for "true"', () => {
      expect(validateInStock('true')).toBe(true);
    });

    it('returns false for "false"', () => {
      expect(validateInStock('false')).toBe(false);
    });

    it('returns undefined for undefined', () => {
      expect(validateInStock(undefined)).toBeUndefined();
    });

    it('throws ClientError for invalid boolean string', () => {
      expect(() => validateInStock('yes')).toThrow(ClientError);
      expect(() => validateInStock('yes')).toThrow('stock is not a valid boolean');
    });
  });

  describe('validateQuery', () => {
    it('validates all query parameters', () => {
      const query = {
        age: '8',
        inStock: 'true',
        q: 'search',
      };

      const result = validateQuery(query);

      expect(result).toEqual({
        age: 8,
        inStock: true,
        q: 'search',
      });
    });

    it('handles missing parameters', () => {
      const query = {};

      const result = validateQuery(query);

      expect(result).toEqual({
        age: undefined,
        inStock: undefined,
        q: undefined,
      });
    });

    it('throws on invalid age', () => {
      const query = { age: 'invalid' };

      expect(() => validateQuery(query)).toThrow(ClientError);
    });
  });
});
