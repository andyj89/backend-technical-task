import { describe, it, expect } from 'vitest';
import { ProductsRepository } from './productsRepository.js';
import { DatabaseSync } from 'node:sqlite';
import { NormalisedProduct } from '../types.js';

describe('ProductsRepository', () => {
  describe('initialiseDb', () => {
    it('creates products table with correct schema', () => {
      const db = new DatabaseSync(':memory:');
      new ProductsRepository(db);

      const result = db
        .prepare(
          "SELECT name FROM sqlite_master WHERE type='table' AND name='products'",
        )
        .get();
      expect(result).toBeDefined();
    });

    it('creates required indexes for performance', () => {
      const db = new DatabaseSync(':memory:');
      new ProductsRepository(db);

      const indexes = db
        .prepare(
          "SELECT name FROM sqlite_master WHERE type='index' AND tbl_name='products'",
        )
        .all();
      const indexNames = indexes.map((idx: any) => idx.name);

      expect(indexNames).toContain('idx_age_range');
      expect(indexNames).toContain('idx_store');
      expect(indexNames).toContain('idx_title');
      expect(indexNames).toContain('idx_inStock');
    });
  });

  describe('findByAge', () => {
    it('returns products within age range', () => {
      const db = new DatabaseSync(':memory:');
      const repository = new ProductsRepository(db);

      const products: NormalisedProduct[] = [
        {
          uuid: '1',
          handle: 'product-1',
          store: 'uk',
          title: 'Product 1',
          type: 'single',
          minAge: 3,
          maxAge: 10,
          price: 10.99,
          currency: 'GBP',
          inStock: true,
          stockLevel: 5,
        },
        {
          uuid: '2',
          handle: 'product-2',
          store: 'uk',
          title: 'Product 2',
          type: 'single',
          minAge: 8,
          maxAge: 14,
          price: 15.99,
          currency: 'GBP',
          inStock: true,
          stockLevel: 3,
        },
        {
          uuid: '3',
          handle: 'product-3',
          store: 'uk',
          title: 'Product 3',
          type: 'single',
          minAge: 12,
          maxAge: 18,
          price: 20.99,
          currency: 'GBP',
          inStock: false,
          stockLevel: 0,
        },
      ];

      repository.insertProducts(products);

      const results = repository.findByAge(9);

      expect(results).toHaveLength(2);
      expect(results[0].uuid).toBe('1');
      expect(results[1].uuid).toBe('2');
    });

    it('returns empty array when no products match age', () => {
      const db = new DatabaseSync(':memory:');
      const repository = new ProductsRepository(db);

      const products: NormalisedProduct[] = [
        {
          uuid: '1',
          handle: 'product-1',
          store: 'uk',
          title: 'Product 1',
          type: 'single',
          minAge: 10,
          maxAge: 14,
          price: 10.99,
          currency: 'GBP',
          inStock: true,
          stockLevel: 5,
        },
      ];

      repository.insertProducts(products);

      const results = repository.findByAge(5);

      expect(results).toHaveLength(0);
    });

    it('transforms rows to StoreProduct format', () => {
      const db = new DatabaseSync(':memory:');
      const repository = new ProductsRepository(db);

      const products: NormalisedProduct[] = [
        {
          uuid: '1',
          handle: 'product-1',
          store: 'uk',
          title: 'Product 1',
          type: 'single',
          minAge: 3,
          maxAge: 10,
          price: 10.99,
          currency: 'GBP',
          inStock: true,
          stockLevel: 5,
        },
      ];

      repository.insertProducts(products);

      const results = repository.findByAge(5);

      expect(results[0]).toEqual({
        uuid: '1',
        handle: 'product-1',
        store: 'uk',
        title: 'Product 1',
        type: 'single',
        inventory: {
          stockLevel: 5,
          inStock: true,
        },
        price: {
          currency: 'GBP',
          amount: 10.99,
        },
        ageSuitability: {
          minAge: 3,
          maxAge: 10,
        },
      });
    });
  });
});
