import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { TestServer } from './setup.js';

describe('Products API Integration', () => {
  const PORT = 3001;
  const BASE_URL = `http://localhost:${PORT}`;
  const server = new TestServer(PORT);

  beforeAll(async () => {
    await server.start();
    await server.seedData();
  });

  afterAll(async () => {
    await server.stop();
  });

  describe('GET /products', () => {
    it('returns products for valid age query', async () => {
      const response = await fetch(`${BASE_URL}/api/products?age=8`);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.products).toBeInstanceOf(Array);
      expect(data.products.length).toBeGreaterThan(0);

      data.products.forEach((product: any) => {
        expect(product.ageSuitability.minAge).toBeLessThanOrEqual(8);
        expect(product.ageSuitability.maxAge).toBeGreaterThanOrEqual(8);
      });
    });

    it('returns products for inStock filter', async () => {
      const response = await fetch(`${BASE_URL}/api/products?inStock=true`);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.products).toBeInstanceOf(Array);

      data.products.forEach((product: any) => {
        expect(product.inventory.inStock).toBe(true);
      });
    });

    it('returns products for text search', async () => {
      const response = await fetch(`${BASE_URL}/api/products?q=tiger`);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.products).toBeInstanceOf(Array);
    });

    it('returns products for combined filters', async () => {
      const response = await fetch(
        `${BASE_URL}/api/products?age=8&inStock=true&q=tiger`,
      );
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.products).toBeInstanceOf(Array);

      data.products.forEach((product: any) => {
        expect(product.ageSuitability.minAge).toBeLessThanOrEqual(8);
        expect(product.ageSuitability.maxAge).toBeGreaterThanOrEqual(8);
        expect(product.inventory.inStock).toBe(true);
      });
    });

    it('returns empty array for age with no matches', async () => {
      const response = await fetch(`${BASE_URL}/api/products?age=100`);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.products).toEqual([]);
    });

    it('returns 400 for invalid age parameter', async () => {
      const response = await fetch(`${BASE_URL}/api/products?age=invalid`);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('age is not a valid number');
    });

    it('returns 400 for invalid inStock parameter', async () => {
      const response = await fetch(`${BASE_URL}/api/products?inStock=maybe`);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('stock is not a valid boolean');
    });

    it('returns 400 for text query over 1000 characters', async () => {
      const longText = 'a'.repeat(1001);
      const response = await fetch(`${BASE_URL}/api/products?q=${longText}`);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('query parameter too long');
    });

    it('returns all products when no filters provided', async () => {
      const response = await fetch(`${BASE_URL}/api/products`);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.products).toBeInstanceOf(Array);
      expect(data.products.length).toBeGreaterThan(0);
    });

    it('handles products without descriptions', async () => {
      const response = await fetch(`${BASE_URL}/api/products`);
      const data = await response.json();

      expect(response.status).toBe(200);
      data.products.forEach((product: any) => {
        expect(product).toHaveProperty('uuid');
        expect(product).toHaveProperty('title');
        expect(product).toHaveProperty('price');
        expect(product).toHaveProperty('ageSuitability');
        expect(product).toHaveProperty('inventory');
      });
    });
  });
});
