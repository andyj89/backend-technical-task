import { describe, it, expect } from 'vitest';
import {
  extractAgeData,
  extractPrice,
  extractStock,
} from './productsNormaliser';
import { RawProduct } from '../types';

describe('productsNormaliser', () => {
  describe('extractAge', () => {
    it('extracts age from cards', () => {
      const rawProduct = {
        cards: [
          {
            id: '1',
            name: 'Card 1',
            minAge: 3,
            maxAge: 14,
            type: 'type1',
          },
          {
            id: '2',
            name: 'Card 2',
            age: 5,
            type: 'type2',
          },
        ],
      } as unknown as RawProduct;

      const age = extractAgeData(rawProduct);

      expect(age).toEqual({ minAge: 3, maxAge: 14 });
    });

    it('extracts age from variants', () => {
      const rawProduct = {
        variants: [
          {
            format: 'digital',
            ageRange: {
              min: 5,
              max: 14,
            },
          },
          {
            format: 'digital',
            ageRange: {
              min: 3,
              max: 10,
            },
          },
        ],
      } as unknown as RawProduct;

      const age = extractAgeData(rawProduct);
      expect(age).toEqual({ minAge: 3, maxAge: 14 });
    });

    it('extracts age from recommendedAge string', () => {
      const rawProduct = {
        recommendedAge: '5-14 years',
      } as unknown as RawProduct;
      const age = extractAgeData(rawProduct);
      expect(age).toEqual({ minAge: 5, maxAge: 14 });
    });

    it('calculates the age based on ranges in separate data sources', () => {
      const rawProduct = {
        cards: [
          {
            id: '1',
            name: 'Card 1',
            minAge: 3,
            maxAge: 14,
            type: 'type1',
          },
          {
            id: '2',
            name: 'Card 2',
            age: 5,
            type: 'type2',
          },
        ],
        variants: [
          {
            format: 'digital',
            ageRange: {
              min: 5,
              max: 14,
            },
          },
          {
            format: 'digital',
            ageRange: {
              min: 2,
              max: 10,
            },
          },
        ],
      } as unknown as RawProduct;
      const ageData = extractAgeData(rawProduct);
      expect(ageData).toEqual({ minAge: 2, maxAge: 14 });
    });

    it('takes minimum of all minAge values across sources', () => {
      const rawProduct = {
        cards: [{ minAge: 5, maxAge: 10 }],
        variants: [{ ageRange: { min: 3, max: 12 } }],
        recommendedAge: '7-15',
      } as unknown as RawProduct;

      const ageData = extractAgeData(rawProduct);
      expect(ageData).not.toBeNull();
      expect(ageData!.minAge).toBe(3);
    });

    it('takes maximum of all maxAge values across sources', () => {
      const rawProduct = {
        cards: [{ minAge: 5, maxAge: 10 }],
        variants: [{ ageRange: { min: 3, max: 12 } }],
        recommendedAge: '7-15',
      } as unknown as RawProduct;

      const ageData = extractAgeData(rawProduct);
      expect(ageData).not.toBeNull();
      expect(ageData!.maxAge).toBe(15);
    });
  });

  describe('extractPrice', () => {
    it('extracts price from price', () => {
      const rawProduct = {
        price: 100,
        currency: 'GBP',
      } as unknown as RawProduct;

      const price = extractPrice(rawProduct);

      expect(price).toEqual({ price: 100, currency: 'GBP' });
    });

    it('extracts price from price object with amount and currency', () => {
      const rawProduct = {
        price: { amount: 16.82, currency: 'GBP' },
      } as unknown as RawProduct;

      const price = extractPrice(rawProduct);

      expect(price).toEqual({ price: 16.82, currency: 'GBP' });
    });

    it('extracts price from pricing', () => {
      const rawProduct = {
        pricing: {
          current: {
            amount: 100,
            currency: 'GBP',
          },
        },
      } as unknown as RawProduct;

      const price = extractPrice(rawProduct);

      expect(price).toEqual({ price: 100, currency: 'GBP' });
    });

    it('returns null when price is missing', () => {
      const rawProduct = {
        currency: 'GBP',
      } as unknown as RawProduct;

      const price = extractPrice(rawProduct);

      expect(price).toBeNull();
    });

    it('returns null when currency is missing', () => {
      const rawProduct = {
        price: 100,
      } as unknown as RawProduct;

      const price = extractPrice(rawProduct);

      expect(price).toBeNull();
    });
  });

  describe('extractStock', () => {
    it('extracts stock from stockLevel', () => {
      const rawProduct = {
        stockLevel: 10,
      } as unknown as RawProduct;

      const stock = extractStock(rawProduct);
      expect(stock).toEqual({ inStock: true, stockLevel: 10 });
    });

    it('extracts stock from inventory.stockLevel', () => {
      const rawProduct = {
        inventory: {
          stockLevel: 5,
        },
      } as unknown as RawProduct;

      const stock = extractStock(rawProduct);
      expect(stock).toEqual({ inStock: true, stockLevel: 5 });
    });

    it('extracts stock from availability.stock', () => {
      const rawProduct = {
        availability: {
          stock: 20,
        },
      } as unknown as RawProduct;

      const stock = extractStock(rawProduct);
      expect(stock).toEqual({ inStock: true, stockLevel: 20 });
    });

    it('returns inStock false when stock is 0', () => {
      const rawProduct = {
        stockLevel: 0,
      } as unknown as RawProduct;

      const stock = extractStock(rawProduct);
      expect(stock).toEqual({ inStock: false, stockLevel: 0 });
    });

    it('returns null when stock data is missing', () => {
      const rawProduct = {} as unknown as RawProduct;

      const stock = extractStock(rawProduct);
      expect(stock).toBeNull();
    });
  });
});
