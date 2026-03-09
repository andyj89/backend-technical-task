import { describe, it, expect, vi } from 'vitest';
import { createProductsService } from './productService.js';
import { ProductsRepository } from '../repositories/productRepository.js';
import { DatabaseSync } from 'node:sqlite';

describe('createProductsService', () => {
  describe('ingestProducts', () => {
    it('ingestProducts inserts valid products', async () => {
      const db = new DatabaseSync(':memory:');
      const repository = new ProductsRepository(db);

      const mockData = {
        products: [
          {
            uuid: '1',
            handle: 'test',
            store: 'uk',
            title: 'Test',
            type: 'single',
            price: 10.99,
            currency: 'GBP',
            stockLevel: 5,
            cards: [{ minAge: 3, maxAge: 10 }],
          },
        ],
      };

      const mockClient = {
        fetchProducts: vi.fn().mockResolvedValue(mockData),
      };

      const service = createProductsService(repository, mockClient);
      const response = await service.ingestProducts('./products.json');

      expect(response.inserted).toBe(1);
      expect(response.failed).toEqual([]);
      expect(mockClient.fetchProducts).toHaveBeenCalledWith('./products.json');
    });

    it('ingestProducts tracks failed products', async () => {
      const db = new DatabaseSync(':memory:');
      const repository = new ProductsRepository(db);

      const mockData = {
        products: [
          {
            uuid: '1',
            handle: 'test',
            store: 'uk',
            title: 'Test',
            type: 'single',
            price: 10.99,
            currency: 'GBP',
            stockLevel: 5,
            cards: [{ minAge: 3, maxAge: 10 }],
          },
          {
            uuid: '2',
            handle: 'invalid',
            store: 'uk',
            title: 'Invalid',
            type: 'single',
          },
        ],
      };

      const mockClient = {
        fetchProducts: vi.fn().mockResolvedValue(mockData),
      };

      const service = createProductsService(repository, mockClient);
      const response = await service.ingestProducts('./products.json');

      expect(response.inserted).toBe(1);
      expect(response.failed).toEqual(['2']);
    });
  });

  describe('getProducts', () => {
    it('returns products by age', async () => {});
  });
});
