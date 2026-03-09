import { describe, it, expect } from 'vitest';
import { DatabaseSync } from 'node:sqlite';
import { ProductsRepository } from '../../src/repositories/productRepository.js';
import { createProductsService } from '../../src/services/productService.js';
import { createProductsClient } from '../../src/clients/productsClient.js';
import { resolve } from 'node:path';

describe('Products Integration', () => {
  it('ingests all 1000 products and queries by age', async () => {
    const db = new DatabaseSync(':memory:');
    const repository = new ProductsRepository(db);
    const client = createProductsClient();
    const service = createProductsService(repository, client);

    const productsPath = resolve(
      process.cwd(),
      'products_1000_mixed_schema.json',
    );
    const result = await service.ingestProducts(productsPath);

    expect(result.inserted).toBeGreaterThan(0);
    expect(result.failed.length).toBeLessThan(1000);

    const productsForAge8 = await service.findByAge(8);
    expect(productsForAge8.length).toBeGreaterThan(0);

    productsForAge8.forEach((product) => {
      expect(product.ageSuitability.minAge).toBeLessThanOrEqual(8);
      expect(product.ageSuitability.maxAge).toBeGreaterThanOrEqual(8);
    });
  });

  it.each([3, 5, 8, 10, 14])('queries products for age %i', async (age) => {
    const db = new DatabaseSync(':memory:');
    const repository = new ProductsRepository(db);
    const client = createProductsClient();
    const service = createProductsService(repository, client);

    const productsPath = resolve(
      process.cwd(),
      'products_1000_mixed_schema.json',
    );
    await service.ingestProducts(productsPath);

    const products = await service.findByAge(age);
    expect(products.length).toBeGreaterThan(0);

    products.forEach((product) => {
      expect(product.ageSuitability.minAge).toBeLessThanOrEqual(age);
      expect(product.ageSuitability.maxAge).toBeGreaterThanOrEqual(age);
      expect(product.price.amount).toBeGreaterThan(0);
      expect(product.price.currency).toBeDefined();
    });
  });

  it('returns empty array for age with no matching products', async () => {
    const db = new DatabaseSync(':memory:');
    const repository = new ProductsRepository(db);
    const client = createProductsClient();
    const service = createProductsService(repository, client);

    const productsPath = resolve(
      process.cwd(),
      'products_1000_mixed_schema.json',
    );
    await service.ingestProducts(productsPath);

    const products = await service.findByAge(100);
    expect(products).toEqual([]);
  });

  it('handles invalid product data gracefully', async () => {
    const db = new DatabaseSync(':memory:');
    const repository = new ProductsRepository(db);
    const client = createProductsClient();
    const service = createProductsService(repository, client);

    const productsPath = resolve(
      process.cwd(),
      'products_1000_mixed_schema.json',
    );
    const result = await service.ingestProducts(productsPath);

    expect(result.inserted).toBeGreaterThan(0);
    expect(result.failed).toBeInstanceOf(Array);
  });
});
